package com.LMS.LVTN.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.LMS.LVTN.dto.response.BaoCaoAiBuoiSangResponse;
import com.LMS.LVTN.entity.*;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

// QT14.1 (AI-01): tóm tắt tiến độ lớp buổi sáng, gọi Gemma3 thật 1 lần/ngày/lớp
// rồi cache vào bao_cao_ai_buoi_sang (UNIQUE giao_vien_id, lop_hoc_id, ngay_bao_cao).
//
// Khác với bản gốc (core-service): dự án này không có khái niệm "phân phối nội
// dung theo lớp" (PhanPhoiDangBai) — DangBai chỉ gắn với BaiHoc/giáo viên tạo,
// không gắn trực tiếp với 1 lớp cụ thể — nên không thể tính chính xác "học sinh
// nào chưa hoàn thành nội dung GV đã giao cho lớp". Số liệu này được bỏ qua thay
// vì suy diễn sai; các số liệu còn lại (hoạt động học tập, bài nộp, điểm) dùng
// TienDoHocSinh/BaiNop thật của dự án.
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BaoCaoAiBuoiSangService {

    AuthenticationService authenticationService;
    NguoiDungRepository nguoiDungRepository;
    LopHocRepository lopHocRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    TienDoHocSinhRepository tienDoHocSinhRepository;
    BaiNopRepository baiNopRepository;
    BaoCaoAiBuoiSangRepository baoCaoAiBuoiSangRepository;
    OllamaClient ollamaClient;
    ObjectMapper objectMapper;

    @Transactional
    public BaoCaoAiBuoiSangResponse getOrGenerate(String token, Long lopHocId) {
        String nguoiDungId;
        try {
            nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
        NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
        if (nguoiDung.getHoSoGiaoVien() == null) {
            throw new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND);
        }
        HoSoGiaoVien giaoVien = nguoiDung.getHoSoGiaoVien();

        LopHoc lopHoc = resolveClass(giaoVien, lopHocId);
        LocalDate today = LocalDate.now();

        Optional<BaoCaoAiBuoiSang> cached = baoCaoAiBuoiSangRepository
                .findByGiaoVien_GiaoVienIdAndLopHoc_LopHocIdAndNgayBaoCao(giaoVien.getGiaoVienId(), lopHoc.getLopHocId(), today);
        if (cached.isPresent()) {
            return toDto(cached.get(), lopHoc);
        }

        BaoCaoAiBuoiSang generated = generate(giaoVien, lopHoc, today);
        return toDto(generated, lopHoc);
    }

    private LopHoc resolveClass(HoSoGiaoVien giaoVien, Long lopHocId) {
        if (lopHocId != null) {
            return lopHocRepository.findById(lopHocId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
        }
        List<LopHoc> homeroom = lopHocRepository.findByGiaoVienChuNhiem_GiaoVienId(giaoVien.getGiaoVienId());
        if (homeroom.isEmpty()) {
            throw new AppExceptions(Errorcode.LOP_HOC_CHU_NHIEM_NOT_FOUND);
        }
        return homeroom.get(0);
    }

    private BaoCaoAiBuoiSang generate(HoSoGiaoVien giaoVien, LopHoc lopHoc, LocalDate today) {
        List<HoSoHocSinh> students = hoSoHocSinhRepository.findByLopHoc_LopHocId(lopHoc.getLopHocId());
        int totalStudents = students.size();

        Map<String, Object> analysis = new LinkedHashMap<>();
        analysis.put("totalStudents", totalStudents);

        if (totalStudents == 0) {
            String summary = "Lớp " + lopHoc.getTenLop() + " hiện chưa có học sinh nào để phân tích tiến độ.";
            return persist(giaoVien, lopHoc, today, summary, analysis);
        }

        List<Long> studentIds = students.stream().map(HoSoHocSinh::getHocSinhId).collect(Collectors.toList());
        LocalDateTime since = today.minusDays(1).atStartOfDay();

        List<TienDoHocSinh> progressList = tienDoHocSinhRepository.findByHocSinh_HocSinhIdIn(studentIds);
        List<TienDoHocSinh> recentProgress = progressList.stream()
                .filter(p -> p.getLanXemCuoi() != null && p.getLanXemCuoi().isAfter(since))
                .collect(Collectors.toList());

        Set<Long> studentsActiveYesterday = recentProgress.stream()
                .map(p -> p.getHocSinh().getHocSinhId())
                .collect(Collectors.toSet());
        Set<Long> studentsCompletedSomething = recentProgress.stream()
                .filter(p -> Boolean.TRUE.equals(p.getDaHoanThanh()))
                .map(p -> p.getHocSinh().getHocSinhId())
                .collect(Collectors.toSet());

        List<BaiNop> submissions = baiNopRepository.findByHocSinh_HocSinhIdIn(studentIds);
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
        analysis.put("submissionsYesterday", recentSubmissions.size());
        analysis.put("lateSubmissionsYesterday", lateCount);
        analysis.put("avgAutoScoreYesterday", avgScore);

        String summary = callGemmaForSummary(lopHoc, analysis);
        return persist(giaoVien, lopHoc, today, summary, analysis);
    }

    // Persona riêng cho báo cáo buổi sáng — khác AI-02 (không xưng "cô/thầy" vì
    // báo cáo này là số liệu hiển thị CHO giáo viên xem, không phải lời nhắn gửi ai).
    private static final String ANALYST_PERSONA = """
            Bạn là trợ lý phân tích dữ liệu học tập, viết báo cáo tóm tắt ngắn gọn cho giáo viên xem trên trang chủ mỗi sáng.
            Chỉ trình bày số liệu và nhận định khách quan bằng tiếng Việt, không xưng hô "cô/thầy", không chào hỏi, không thêm tiêu đề, không dùng markdown.
            Bắt buộc: toàn bộ câu trả lời phải 100% tiếng Việt, tuyệt đối không chèn bất kỳ từ hay cụm từ tiếng Anh nào vào giữa câu.
            """;

    private String callGemmaForSummary(LopHoc lopHoc, Map<String, Object> analysis) {
        String prompt = buildPrompt(lopHoc, analysis);
        return ollamaClient.generate(ANALYST_PERSONA, prompt)
                .map(this::cleanOutput)
                .filter(s -> !s.isBlank())
                .orElseGet(() -> buildFallbackSummary(lopHoc, analysis));
    }

    private String buildPrompt(LopHoc lopHoc, Map<String, Object> analysis) {
        StringBuilder sb = new StringBuilder();
        sb.append("Viết 1 đoạn tóm tắt ngắn (2-4 câu) cho giáo viên xem đầu ngày, dựa trên số liệu tiến độ học tập của lớp ")
                .append(lopHoc.getTenLop()).append(" trong ngày hôm qua. Nêu số liệu cụ thể, giọng ngắn gọn chuyên nghiệp.\n\n");
        sb.append("Số liệu:\n");
        sb.append("- Tổng số học sinh: ").append(analysis.get("totalStudents")).append("\n");
        sb.append("- Số học sinh có hoạt động học tập hôm qua: ").append(analysis.get("activeYesterday")).append("\n");
        sb.append("- Số học sinh hoàn thành ít nhất 1 nội dung hôm qua: ").append(analysis.get("completedSomethingYesterday")).append("\n");
        sb.append("- Số bài tập đã nộp hôm qua: ").append(analysis.get("submissionsYesterday"))
                .append(" (trong đó nộp trễ: ").append(analysis.get("lateSubmissionsYesterday")).append(")\n");
        if (analysis.get("avgAutoScoreYesterday") != null) {
            sb.append("- Điểm tự động trung bình các bài nộp hôm qua: ")
                    .append(String.format("%.1f", (Double) analysis.get("avgAutoScoreYesterday"))).append("/10\n");
        }
        return sb.toString();
    }

    private String buildFallbackSummary(LopHoc lopHoc, Map<String, Object> analysis) {
        StringBuilder sb = new StringBuilder();
        sb.append("Lớp ").append(lopHoc.getTenLop()).append(": ")
                .append(analysis.get("activeYesterday")).append("/").append(analysis.get("totalStudents"))
                .append(" học sinh có hoạt động học tập hôm qua, ")
                .append(analysis.get("submissionsYesterday")).append(" bài tập đã nộp");
        Object late = analysis.get("lateSubmissionsYesterday");
        if (late instanceof Long l && l > 0) {
            sb.append(" (").append(l).append(" bài nộp trễ)");
        }
        sb.append(". Không có cảnh báo bất thường nào.");
        return sb.toString();
    }

    private String cleanOutput(String raw) {
        String cleaned = raw.strip();
        if (cleaned.startsWith("\"") && cleaned.endsWith("\"") && cleaned.length() > 1) {
            cleaned = cleaned.substring(1, cleaned.length() - 1).strip();
        }
        return cleaned;
    }

    private BaoCaoAiBuoiSang persist(HoSoGiaoVien giaoVien, LopHoc lopHoc, LocalDate today, String summary, Map<String, Object> analysis) {
        BaoCaoAiBuoiSang report = new BaoCaoAiBuoiSang();
        report.setGiaoVien(giaoVien);
        report.setLopHoc(lopHoc);
        report.setNgayBaoCao(today);
        report.setNoiDungTomTat(summary);
        try {
            report.setDuLieuPhanTich(objectMapper.writeValueAsString(analysis));
        } catch (Exception e) {
            report.setDuLieuPhanTich("{}");
        }
        try {
            return baoCaoAiBuoiSangRepository.save(report);
        } catch (DataIntegrityViolationException e) {
            // Race: 2 request cùng lúc cho cùng GV/lớp/ngày — đọc lại bản request kia vừa lưu.
            return baoCaoAiBuoiSangRepository
                    .findByGiaoVien_GiaoVienIdAndLopHoc_LopHocIdAndNgayBaoCao(giaoVien.getGiaoVienId(), lopHoc.getLopHocId(), today)
                    .orElseThrow(() -> e);
        }
    }

    private BaoCaoAiBuoiSangResponse toDto(BaoCaoAiBuoiSang report, LopHoc lopHoc) {
        return BaoCaoAiBuoiSangResponse.builder()
                .id(report.getBaoCaoId())
                .classId(lopHoc.getLopHocId())
                .className(lopHoc.getTenLop())
                .reportDate(report.getNgayBaoCao().toString())
                .summary(report.getNoiDungTomTat())
                .generatedAt(report.getThoiDiemTao().toString())
                .build();
    }
}
