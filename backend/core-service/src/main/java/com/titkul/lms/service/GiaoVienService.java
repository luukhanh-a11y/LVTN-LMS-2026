package com.titkul.lms.service;

import com.titkul.lms.dto.ThongBaoRequest;
import com.titkul.lms.dto.TraoHuyHieuRequest;
import com.titkul.lms.dto.GiaoVienDashboardResponse;
import com.titkul.lms.entity.BaiTap;
import com.titkul.lms.entity.HuyHieu;
import com.titkul.lms.entity.LopHoc;
import com.titkul.lms.entity.DanhGiaBaiLam;
import com.titkul.lms.entity.XepLoai;
import com.titkul.lms.entity.ThongBao;
import com.titkul.lms.entity.DoiTuongNhanThongBao;
import com.titkul.lms.entity.LoaiThongBao;
import com.titkul.lms.entity.HoSoHocSinh;
import com.titkul.lms.entity.KhenThuongHocSinh;
import com.titkul.lms.entity.NguonCap;
import com.titkul.lms.entity.MonHoc;
import com.titkul.lms.entity.HoSoGiaoVien;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.repository.BaiTapRepository;
import com.titkul.lms.repository.HuyHieuRepository;
import com.titkul.lms.repository.LopHocRepository;
import com.titkul.lms.repository.DanhGiaBaiLamRepository;
import com.titkul.lms.repository.ThongBaoRepository;
import com.titkul.lms.repository.KhenThuongHocSinhRepository;
import com.titkul.lms.repository.MonHocRepository;
import com.titkul.lms.repository.HoSoGiaoVienRepository;
import com.titkul.lms.repository.NguoiDungRepository;
import com.titkul.lms.repository.HoSoHocSinhRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GiaoVienService {

    private final NguoiDungRepository userRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final LopHocRepository classRoomRepository;
    private final BaiTapRepository assignmentRepository;
    private final HoSoHocSinhRepository studentProfileRepository;
    private final DanhGiaBaiLamRepository evaluationRepository;
    private final MonHocRepository subjectRepository;
    private final ThongBaoRepository notificationRepository;
    private final HuyHieuRepository huyHieuRepository;
    private final KhenThuongHocSinhRepository khenThuongHocSinhRepository;
    private final EmailService emailService;
    private final com.titkul.lms.repository.StudentProgressRepository studentProgressRepository;
    private final com.titkul.lms.repository.BaiNopRepository submissionRepository;

    public GiaoVienDashboardResponse getDashboard(String username) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        HoSoGiaoVien profile = teacherProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));

        List<LopHoc> homeroomClasses = classRoomRepository.findByGiaoVienChuNhiem_GiaoVienId(profile.getGiaoVienId());
        String homeroomClassStr = homeroomClasses.isEmpty() ? "Không có" : homeroomClasses.get(0).getTenLop();
        long totalAssignments = assignmentRepository.countByGiaoVien_GiaoVienId(profile.getGiaoVienId());

        return GiaoVienDashboardResponse.builder()
                .fullName(profile.getHoTen())
                .classesCount(1)
                .homeroomClass(homeroomClassStr)
                .department(profile.getBoMon())
                .totalAssignments(totalAssignments)
                .build();
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> getClasses(String username) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        HoSoGiaoVien profile = teacherProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));

        List<LopHoc> homeroomClasses = classRoomRepository.findByGiaoVienChuNhiem_GiaoVienId(profile.getGiaoVienId());

        return homeroomClasses.stream().map(c -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", c.getLopHocId());
            map.put("name", c.getTenLop());
            map.put("role", "GV Chủ Nhiệm");
            map.put("students", studentProfileRepository.countByLopHoc_LopHocId(c.getLopHocId()));
            map.put("grade", c.getKhoiLop());
            map.put("academicYear", c.getNamHoc() != null ? c.getNamHoc().getTenNamHoc() : null);
            return map;
        }).collect(java.util.stream.Collectors.toList());
    }

    public java.util.Map<String, Object> getClassDetails(String username, Long classId) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        return java.util.Map.of(
            "classInfo", java.util.Map.of("id", classId, "name", "Lớp 5A", "role", "GV Chủ Nhiệm", "students", 35),
            "students", List.of(
                java.util.Map.of("id", 1, "code", "HS001", "name", "Nguyễn Văn An", "dob", "15/03/2015", "parentName", "Nguyễn Văn Bình", "phone", "0901234567", "evaluation", "Hoàn thành Tốt", "attendance", 100, "badges", 5),
                java.util.Map.of("id", 2, "code", "HS002", "name", "Trần Thị Bình", "dob", "22/07/2015", "parentName", "Trần Văn Cường", "phone", "0912345678", "evaluation", "Hoàn thành", "attendance", 95, "badges", 2),
                java.util.Map.of("id", 3, "code", "HS003", "name", "Lê Hoàng Cường", "dob", "10/01/2015", "parentName", "Lê Văn Dũng", "phone", "0987654321", "evaluation", "Chưa hoàn thành", "attendance", 85, "badges", 0),
                java.util.Map.of("id", 4, "code", "HS004", "name", "Phạm Thị Dung", "dob", "05/11/2015", "parentName", "Phạm Văn Em", "phone", "0909876543", "evaluation", "Hoàn thành Tốt", "attendance", 98, "badges", 4),
                java.util.Map.of("id", 5, "code", "HS005", "name", "Hoàng Văn Em", "dob", "30/08/2015", "parentName", "Hoàng Văn Phát", "phone", "0933456789", "evaluation", "Hoàn thành", "attendance", 90, "badges", 1)
            )
        );
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Map<String, Object> getReports(String username, Long classId, Integer semesterId) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoGiaoVien profile = teacherProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));

        Long targetClassId = classId;
        if (targetClassId == null) {
            List<LopHoc> homeroomClasses = classRoomRepository.findByGiaoVienChuNhiem_GiaoVienId(profile.getGiaoVienId());
            if (homeroomClasses.isEmpty()) {
                return Map.of("students", List.of());
            }
            targetClassId = homeroomClasses.get(0).getLopHocId();
        }

        List<HoSoHocSinh> students = studentProfileRepository.findByLopHoc_LopHocId(targetClassId);
        if (students.isEmpty()) {
            return Map.of("students", List.of());
        }
        List<Long> studentIds = students.stream().map(HoSoHocSinh::getHocSinhId).collect(java.util.stream.Collectors.toList());

        List<DanhGiaBaiLam> evaluations = evaluationRepository.findByBaiNop_HocSinh_HocSinhIdInOrderByThoiDiemChamDesc(studentIds);
        MonHoc mathSubject = subjectRepository.findByTenMon("Toán").orElse(null);
        MonHoc vietSubject = subjectRepository.findByTenMon("Tiếng Việt").orElse(null);

        List<Map<String, Object>> result = students.stream().map(s -> {
            XepLoai mathGrade = latestGradeForSubject(evaluations, s.getHocSinhId(), mathSubject, semesterId);
            XepLoai vietGrade = latestGradeForSubject(evaluations, s.getHocSinhId(), vietSubject, semesterId);
            XepLoai overall = worstGrade(mathGrade, vietGrade);

            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", s.getHocSinhId());
            map.put("name", s.getHoTen());
            map.put("math", gradeLabel(mathGrade));
            map.put("viet", gradeLabel(vietGrade));
            map.put("avg", gradeLabel(overall));
            map.put("isExcellent", overall == XepLoai.HOAN_THANH_TOT);
            return map;
        }).collect(java.util.stream.Collectors.toList());

        return Map.of("students", result);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStudentProgress(String username, Long studentId) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoGiaoVien profile = teacherProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));

        HoSoHocSinh student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh"));

        List<LopHoc> homeroomClasses = classRoomRepository.findByGiaoVienChuNhiem_GiaoVienId(profile.getGiaoVienId());
        boolean ownsStudent = student.getLopHoc() != null && homeroomClasses.stream()
                .anyMatch(c -> c.getLopHocId().equals(student.getLopHoc().getLopHocId()));
        if (!ownsStudent) {
            throw new RuntimeException("Học sinh không thuộc lớp bạn phụ trách");
        }

        List<com.titkul.lms.entity.StudentProgress> progressList = studentProgressRepository.findByStudent_HocSinhId(studentId);
        Map<Integer, List<com.titkul.lms.entity.StudentProgress>> bySubject = progressList.stream()
                .filter(p -> p.getContentNode() != null && p.getContentNode().getMonHoc() != null)
                .collect(Collectors.groupingBy(p -> p.getContentNode().getMonHoc().getMonHocId()));

        List<Map<String, Object>> subjectProgress = bySubject.values().stream().map(list -> {
            MonHoc subject = list.get(0).getContentNode().getMonHoc();
            long completed = list.stream().filter(p -> Boolean.TRUE.equals(p.getCompleted())).count();
            int percent = list.isEmpty() ? 0 : (int) Math.round(completed * 100.0 / list.size());
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("subject", subject.getTenMon());
            map.put("percent", percent);
            map.put("completed", completed);
            map.put("total", list.size());
            return map;
        }).collect(Collectors.toList());

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        List<Map<String, Object>> recentSubmissions = submissionRepository.findByHocSinh_HocSinhId(studentId).stream()
                .filter(s -> s.getThoiDiemNop() != null)
                .sorted((a, b) -> b.getThoiDiemNop().compareTo(a.getThoiDiemNop()))
                .limit(5)
                .map(s -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("title", s.getBaiTap().getTieuDe());
                    map.put("late", Boolean.TRUE.equals(s.getLaNopTre()));
                    map.put("date", s.getThoiDiemNop().format(fmt));
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("studentCode", student.getMaHocSinh());
        result.put("className", student.getLopHoc() != null ? student.getLopHoc().getTenLop() : "");
        result.put("subjectProgress", subjectProgress);
        result.put("recentSubmissions", recentSubmissions);
        return result;
    }

    // Ưu tiên hocLieu.subject (Kho Học Liệu GV tự soạn), fallback contentNode.subject (cây SGK).
    private MonHoc resolveAssignmentSubject(BaiTap assignment) {
        if (assignment.getHocLieu() != null && assignment.getHocLieu().getSubject() != null) {
            return assignment.getHocLieu().getSubject();
        }
        return assignment.getDangBai() != null ? assignment.getDangBai().getMonHoc() : null;
    }

    private XepLoai latestGradeForSubject(List<DanhGiaBaiLam> evaluations, Long studentId, MonHoc subject, Integer semesterId) {
        if (subject == null) return null;
        return evaluations.stream()
                .filter(e -> e.getBaiNop().getHocSinh().getHocSinhId().equals(studentId))
                .filter(e -> {
                    BaiTap a = e.getBaiNop().getBaiTap();
                    MonHoc assignmentSubject = resolveAssignmentSubject(a);
                    if (assignmentSubject == null || !assignmentSubject.getMonHocId().equals(subject.getMonHocId())) return false;
                    if (semesterId != null) {
                        return a.getHocKy() != null && semesterId.equals(a.getHocKy().getHocKyId());
                    }
                    return true;
                })
                .map(DanhGiaBaiLam::getXepLoai)
                .filter(java.util.Objects::nonNull)
                .findFirst() // list đã sắp evaluatedAt desc nên phần tử đầu là mới nhất
                .orElse(null);
    }

    private XepLoai worstGrade(XepLoai... grades) {
        XepLoai worst = null;
        for (XepLoai g : grades) {
            if (g == null) continue;
            if (worst == null || rank(g) < rank(worst)) worst = g;
        }
        return worst;
    }

    private int rank(XepLoai g) {
        return switch (g) {
            case CHUA_HOAN_THANH -> 0;
            case HOAN_THANH -> 1;
            case HOAN_THANH_TOT -> 2;
        };
    }

    private String gradeLabel(XepLoai g) {
        if (g == null) return "Chưa có";
        return switch (g) {
            case HOAN_THANH_TOT -> "Tốt";
            case HOAN_THANH -> "Đạt";
            case CHUA_HOAN_THANH -> "Chưa đạt";
        };
    }

    public List<HoSoGiaoVien> getAllTeachers() {
        return teacherProfileRepository.findAll();
    }

    @Transactional
    public ThongBao createAnnouncement(String username, ThongBaoRequest dto) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoGiaoVien profile = teacherProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));

        LopHoc classRoom;
        if (dto.getClassId() != null) {
            classRoom = classRoomRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        } else {
            List<LopHoc> homeroomClasses = classRoomRepository.findByGiaoVienChuNhiem_GiaoVienId(profile.getGiaoVienId());
            if (homeroomClasses.isEmpty()) {
                throw new RuntimeException("Bạn chưa là giáo viên chủ nhiệm của lớp nào để đăng thông báo.");
            }
            classRoom = homeroomClasses.get(0);
        }

        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("Tiêu đề thông báo không được để trống.");
        }

        ThongBao notification = new ThongBao();
        notification.setSender(user);
        notification.setClassRoom(classRoom);
        notification.setTieuDe(dto.getTitle());
        notification.setNoiDung(dto.getContent());
        notification.setLoaiThongBao(LoaiThongBao.NOI_BO);
        notification.setLaGhim(Boolean.TRUE.equals(dto.getPinned()));
        notification.setDoiTuongNhan(dto.getAudience() != null
                ? DoiTuongNhanThongBao.valueOf(dto.getAudience())
                : DoiTuongNhanThongBao.TAT_CA);

        return notificationRepository.save(notification);
    }

    public List<Map<String, Object>> getMyAnnouncements(String username) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return notificationRepository.findBySender_NguoiDungIdOrderByNgayDangDesc(user.getNguoiDungId()).stream()
                .map(n -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", n.getThongBaoId());
                    map.put("title", n.getTieuDe());
                    map.put("content", n.getNoiDung());
                    map.put("date", n.getNgayDang().format(fmt));
                    map.put("pinned", n.isLaGhim());
                    map.put("audience", n.getDoiTuongNhan().name());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public KhenThuongHocSinh awardBadge(String username, Long studentId, TraoHuyHieuRequest dto) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoGiaoVien teacher = teacherProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));
        HoSoHocSinh student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh"));
        if (dto.getHuyHieuId() == null) {
            throw new IllegalArgumentException("Vui lòng chọn huy hiệu để trao.");
        }
        HuyHieu huyHieu = huyHieuRepository.findById(dto.getHuyHieuId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy huy hiệu"));

        boolean emailSent = false;
        if (student.getPhuHuynh() != null && student.getPhuHuynh().getEmailNhanThongBao() != null
                && !student.getPhuHuynh().getEmailNhanThongBao().isBlank()) {
            try {
                String body = "Con " + student.getHoTen() + " vừa được trao huy hiệu \"" + huyHieu.getTenHuyHieu() + "\"!\n\n"
                        + (dto.getThuKhen() != null && !dto.getThuKhen().isBlank()
                                ? "Lời nhắn từ giáo viên: " + dto.getThuKhen()
                                : huyHieu.getMoTa() != null ? huyHieu.getMoTa() : "");
                emailService.sendSimpleEmail(student.getPhuHuynh().getEmailNhanThongBao(),
                        "Titkul LMS - Con bạn vừa nhận được huy hiệu mới!", body);
                emailSent = true;
            } catch (Exception e) {
                // Không chặn việc trao thưởng nếu gửi email thất bại (VD: SMTP tạm lỗi), nhưng vẫn phải log để chẩn đoán được
                log.warn("Gửi email thông báo huy hiệu '{}' cho học sinh {} thất bại: {}",
                        huyHieu.getTenHuyHieu(), student.getHocSinhId(), e.getMessage());
            }
        }

        KhenThuongHocSinh khenThuong = KhenThuongHocSinh.builder()
                .hocSinh(student)
                .huyHieu(huyHieu)
                .giaoVien(teacher)
                .thuKhen(dto.getThuKhen())
                .nguonCap(NguonCap.THU_CONG)
                .daGuiEmail(emailSent)
                .build();
        return khenThuongHocSinhRepository.save(khenThuong);
    }
}
