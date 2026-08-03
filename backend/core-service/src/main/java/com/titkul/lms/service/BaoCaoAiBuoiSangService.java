package com.titkul.lms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

// QT14.1 (AI-01): tóm tắt tiến độ lớp buổi sáng, gọi Gemma3 thật 1 lần/ngày/lớp
// rồi cache vào bao_cao_ai_buoi_sang (UNIQUE giao_vien_id, lop_hoc_id, ngay_bao_cao).
@Slf4j
@Service
@RequiredArgsConstructor
public class BaoCaoAiBuoiSangService {

    private final NguoiDungRepository userRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final LopHocRepository classRoomRepository;
    private final HoSoHocSinhRepository studentProfileRepository;
    private final StudentProgressRepository studentProgressRepository;
    private final BaiNopRepository submissionRepository;
    private final PhanPhoiDangBaiRepository contentDistributionRepository;
    private final BaoCaoAiBuoiSangRepository morningReportRepository;
    private final OllamaClient ollamaClient;
    private final ObjectMapper objectMapper;

    @Transactional
    public Map<String, Object> getOrGenerate(String username, Long classId) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoGiaoVien teacher = teacherProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));

        LopHoc classRoom = resolveClass(teacher, classId);
        LocalDate today = LocalDate.now();

        Optional<BaoCaoAiBuoiSang> cached = morningReportRepository
                .findByTeacher_GiaoVienIdAndClassRoom_LopHocIdAndNgayBaoCao(teacher.getGiaoVienId(), classRoom.getLopHocId(), today);
        if (cached.isPresent()) {
            return toDto(cached.get(), classRoom);
        }

        BaoCaoAiBuoiSang generated = generate(teacher, classRoom, today);
        return toDto(generated, classRoom);
    }

    private LopHoc resolveClass(HoSoGiaoVien teacher, Long classId) {
        if (classId != null) {
            return classRoomRepository.findById(classId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        }
        List<LopHoc> homeroom = classRoomRepository.findByGiaoVienChuNhiem_GiaoVienId(teacher.getGiaoVienId());
        if (homeroom.isEmpty()) {
            throw new RuntimeException("Bạn chưa là giáo viên chủ nhiệm của lớp nào để xem báo cáo.");
        }
        return homeroom.get(0);
    }

    private BaoCaoAiBuoiSang generate(HoSoGiaoVien teacher, LopHoc classRoom, LocalDate today) {
        List<HoSoHocSinh> students = studentProfileRepository.findByLopHoc_LopHocId(classRoom.getLopHocId());
        int totalStudents = students.size();

        Map<String, Object> analysis = new LinkedHashMap<>();
        analysis.put("totalStudents", totalStudents);

        if (totalStudents == 0) {
            String summary = "Lớp " + classRoom.getTenLop() + " hiện chưa có học sinh nào để phân tích tiến độ.";
            return persist(teacher, classRoom, today, summary, analysis);
        }

        List<Long> studentIds = students.stream().map(HoSoHocSinh::getHocSinhId).collect(Collectors.toList());
        LocalDateTime since = today.minusDays(1).atStartOfDay();

        List<StudentProgress> progressList = studentProgressRepository.findByStudent_HocSinhIdIn(studentIds);
        List<StudentProgress> recentProgress = progressList.stream()
                .filter(p -> p.getLastViewedAt() != null && p.getLastViewedAt().isAfter(since))
                .collect(Collectors.toList());

        Set<Long> studentsActiveYesterday = recentProgress.stream()
                .map(p -> p.getStudent().getHocSinhId())
                .collect(Collectors.toSet());
        Set<Long> studentsCompletedSomething = recentProgress.stream()
                .filter(p -> Boolean.TRUE.equals(p.getCompleted()))
                .map(p -> p.getStudent().getHocSinhId())
                .collect(Collectors.toSet());

        List<PhanPhoiDangBai> distributed = contentDistributionRepository.findByLopHoc_LopHocId(classRoom.getLopHocId());

        Map<Long, Set<Integer>> completedByStudent = progressList.stream()
                .filter(p -> Boolean.TRUE.equals(p.getCompleted()))
                .collect(Collectors.groupingBy(p -> p.getStudent().getHocSinhId(),
                        Collectors.mapping(p -> p.getContentNode().getDangBaiId(), Collectors.toSet())));

        List<String> notCompletedNames = new ArrayList<>();
        if (!distributed.isEmpty()) {
            for (HoSoHocSinh s : students) {
                Set<Integer> done = completedByStudent.getOrDefault(s.getHocSinhId(), Set.of());
                boolean missingAny = distributed.stream()
                        .anyMatch(d -> !done.contains(d.getDangBai().getDangBaiId()));
                if (missingAny) notCompletedNames.add(s.getHoTen());
            }
        }

        List<BaiNop> submissions = submissionRepository.findByHocSinh_HocSinhIdIn(studentIds);
        List<BaiNop> recentSubmissions = submissions.stream()
                .filter(sub -> sub.getThoiDiemNop() != null && sub.getThoiDiemNop().isAfter(since))
                .collect(Collectors.toList());
        long lateCount = recentSubmissions.stream().filter(sub -> Boolean.TRUE.equals(sub.getLaNopTre())).count();
        List<BigDecimal> scores = recentSubmissions.stream()
                .map(BaiNop::getDiemTuDong)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        Double avgScore = scores.isEmpty() ? null
                : scores.stream().mapToDouble(BigDecimal::doubleValue).average().orElse(0);

        analysis.put("activeYesterday", studentsActiveYesterday.size());
        analysis.put("completedSomethingYesterday", studentsCompletedSomething.size());
        analysis.put("notCompletedAssignedContent", notCompletedNames);
        analysis.put("submissionsYesterday", recentSubmissions.size());
        analysis.put("lateSubmissionsYesterday", lateCount);
        analysis.put("avgAutoScoreYesterday", avgScore);

        String summary = callGemmaForSummary(classRoom, analysis, notCompletedNames);
        return persist(teacher, classRoom, today, summary, analysis);
    }

    // Persona riêng cho báo cáo buổi sáng — khác AI-02 (không xưng "cô/thầy" vì
    // báo cáo này là số liệu hiển thị CHO giáo viên xem, không phải lời nhắn gửi ai).
    private static final String ANALYST_PERSONA = """
            Bạn là trợ lý phân tích dữ liệu học tập, viết báo cáo tóm tắt ngắn gọn cho giáo viên xem trên trang chủ mỗi sáng.
            Chỉ trình bày số liệu và nhận định khách quan bằng tiếng Việt, không xưng hô "cô/thầy", không chào hỏi, không thêm tiêu đề, không dùng markdown.
            Bắt buộc: toàn bộ câu trả lời phải 100% tiếng Việt, tuyệt đối không chèn bất kỳ từ hay cụm từ tiếng Anh nào vào giữa câu.
            """;

    private String callGemmaForSummary(LopHoc classRoom, Map<String, Object> analysis, List<String> notCompletedNames) {
        String prompt = buildPrompt(classRoom, analysis, notCompletedNames);
        return ollamaClient.generate(ANALYST_PERSONA, prompt)
                .map(this::cleanOutput)
                .filter(s -> !s.isBlank())
                .orElseGet(() -> buildFallbackSummary(classRoom, analysis, notCompletedNames));
    }

    private String buildPrompt(LopHoc classRoom, Map<String, Object> analysis, List<String> notCompletedNames) {
        StringBuilder sb = new StringBuilder();
        sb.append("Viết 1 đoạn tóm tắt ngắn (2-4 câu) cho giáo viên xem đầu ngày, dựa trên số liệu tiến độ học tập của lớp ")
                .append(classRoom.getTenLop()).append(" trong ngày hôm qua. Nêu số liệu cụ thể, giọng ngắn gọn chuyên nghiệp.\n\n");
        sb.append("Số liệu:\n");
        sb.append("- Tổng số học sinh: ").append(analysis.get("totalStudents")).append("\n");
        sb.append("- Số học sinh có hoạt động học tập hôm qua: ").append(analysis.get("activeYesterday")).append("\n");
        sb.append("- Số học sinh hoàn thành ít nhất 1 nội dung hôm qua: ").append(analysis.get("completedSomethingYesterday")).append("\n");
        sb.append("- Số bài tập đã nộp hôm qua: ").append(analysis.get("submissionsYesterday"))
                .append(" (trong đó nộp trễ: ").append(analysis.get("lateSubmissionsYesterday")).append(")\n");
        if (analysis.get("avgAutoScoreYesterday") != null) {
            sb.append("- Điểm tự động trung bình các bài H5P nộp hôm qua: ")
                    .append(String.format("%.1f", (Double) analysis.get("avgAutoScoreYesterday"))).append("/10\n");
        }
        if (!notCompletedNames.isEmpty()) {
            sb.append("- Học sinh CHƯA hoàn thành hết nội dung GV đã giao (cần lưu ý, liệt kê tối đa vài em): ")
                    .append(String.join(", ", notCompletedNames.subList(0, Math.min(5, notCompletedNames.size())))).append("\n");
        }
        return sb.toString();
    }

    private String buildFallbackSummary(LopHoc classRoom, Map<String, Object> analysis, List<String> notCompletedNames) {
        StringBuilder sb = new StringBuilder();
        sb.append("Lớp ").append(classRoom.getTenLop()).append(": ")
                .append(analysis.get("activeYesterday")).append("/").append(analysis.get("totalStudents"))
                .append(" học sinh có hoạt động học tập hôm qua, ")
                .append(analysis.get("submissionsYesterday")).append(" bài tập đã nộp");
        Object late = analysis.get("lateSubmissionsYesterday");
        if (late instanceof Long l && l > 0) {
            sb.append(" (").append(l).append(" bài nộp trễ)");
        }
        sb.append(". ");
        if (!notCompletedNames.isEmpty()) {
            sb.append("Cần lưu ý ").append(notCompletedNames.size()).append(" em chưa hoàn thành hết nội dung đã giao.");
        } else {
            sb.append("Không có cảnh báo bất thường nào.");
        }
        return sb.toString();
    }

    private String cleanOutput(String raw) {
        String cleaned = raw.strip();
        if (cleaned.startsWith("\"") && cleaned.endsWith("\"") && cleaned.length() > 1) {
            cleaned = cleaned.substring(1, cleaned.length() - 1).strip();
        }
        return cleaned;
    }

    private BaoCaoAiBuoiSang persist(HoSoGiaoVien teacher, LopHoc classRoom, LocalDate today, String summary, Map<String, Object> analysis) {
        BaoCaoAiBuoiSang report = new BaoCaoAiBuoiSang();
        report.setTeacher(teacher);
        report.setClassRoom(classRoom);
        report.setNgayBaoCao(today);
        report.setNoiDungTomTat(summary);
        try {
            report.setDuLieuPhanTich(objectMapper.writeValueAsString(analysis));
        } catch (Exception e) {
            report.setDuLieuPhanTich("{}");
        }
        try {
            return morningReportRepository.save(report);
        } catch (DataIntegrityViolationException e) {
            // Race: 2 request cùng lúc cho cùng GV/lớp/ngày — đọc lại bản request kia vừa lưu.
            return morningReportRepository
                    .findByTeacher_GiaoVienIdAndClassRoom_LopHocIdAndNgayBaoCao(teacher.getGiaoVienId(), classRoom.getLopHocId(), today)
                    .orElseThrow(() -> e);
        }
    }

    private Map<String, Object> toDto(BaoCaoAiBuoiSang report, LopHoc classRoom) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", report.getBaoCaoId());
        dto.put("classId", classRoom.getLopHocId());
        dto.put("className", classRoom.getTenLop());
        dto.put("reportDate", report.getNgayBaoCao().toString());
        dto.put("summary", report.getNoiDungTomTat());
        dto.put("generatedAt", report.getThoiDiemTao().toString());
        return dto;
    }
}
