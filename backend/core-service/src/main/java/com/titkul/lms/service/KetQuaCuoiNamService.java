package com.titkul.lms.service;

import com.titkul.lms.dto.KetQuaCuoiNamRequest;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// Xét kết quả cuối năm (ket_qua_cuoi_nam, theo TT27/2020) — GVCN xét cho học sinh lớp mình
// chủ nhiệm, PH xem kết quả con, Admin xem tổng hợp toàn trường. Gợi ý ketQuaHocTap dựa trên
// cùng logic xếp loại Toán+Tiếng Việt đã có ở GiaoVienService.getReports, nhưng gộp cả năm học
// (cả 2 học kỳ) thay vì 1 học kỳ — chỉ là gợi ý, GVCN vẫn tự chọn/sửa được.
@Service
@RequiredArgsConstructor
public class KetQuaCuoiNamService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final NguoiDungRepository userRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final HoSoHocSinhRepository studentProfileRepository;
    private final HoSoPhuHuynhRepository parentProfileRepository;
    private final LopHocRepository classRoomRepository;
    private final DanhGiaBaiLamRepository evaluationRepository;
    private final MonHocRepository subjectRepository;
    private final KetQuaCuoiNamRepository ketQuaCuoiNamRepository;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getDanhSachXetLopHoc(String username, Long classId) {
        HoSoGiaoVien teacher = resolveTeacherOwningClass(username, classId);
        LopHoc lopHoc = classRoomRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        String namHoc = lopHoc.getNamHoc().getTenNamHoc();

        List<HoSoHocSinh> students = studentProfileRepository.findByLopHoc_LopHocId(classId);
        if (students.isEmpty()) return List.of();

        List<Long> studentIds = students.stream().map(HoSoHocSinh::getHocSinhId).collect(Collectors.toList());
        List<DanhGiaBaiLam> evaluations = evaluationRepository.findByBaiNop_HocSinh_HocSinhIdInOrderByThoiDiemChamDesc(studentIds);
        MonHoc mathSubject = subjectRepository.findByTenMon("Toán").orElse(null);
        MonHoc vietSubject = subjectRepository.findByTenMon("Tiếng Việt").orElse(null);

        List<KetQuaCuoiNam> existingList = ketQuaCuoiNamRepository.findByLopHoc_LopHocId(classId);
        Map<Long, KetQuaCuoiNam> existingByStudentId = existingList.stream()
                .collect(Collectors.toMap(k -> k.getHocSinh().getHocSinhId(), k -> k, (a, b) -> a));

        return students.stream().map(s -> {
            XepLoai mathGrade = latestGradeForSubjectInYear(evaluations, s.getHocSinhId(), mathSubject, namHoc);
            XepLoai vietGrade = latestGradeForSubjectInYear(evaluations, s.getHocSinhId(), vietSubject, namHoc);
            XepLoai suggestedOverall = worstGrade(mathGrade, vietGrade);

            KetQuaCuoiNam existing = existingByStudentId.get(s.getHocSinhId());

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("hocSinhId", s.getHocSinhId());
            map.put("hoTen", s.getHoTen());
            map.put("maHocSinh", s.getMaHocSinh());
            map.put("goiYKetQuaHocTap", suggestedOverall);
            map.put("daXet", existing != null);
            if (existing != null) {
                map.put("ketQuaId", existing.getKetQuaId());
                map.put("ketQuaHocTap", existing.getKetQuaHocTap());
                map.put("ketQuaRenLuyen", existing.getKetQuaRenLuyen());
                map.put("quyetDinh", existing.getQuyetDinh());
                map.put("duocXetDacCach", existing.getDuocXetDacCach());
                map.put("lyDoDacCach", existing.getLyDoDacCach());
                map.put("ngayXet", existing.getNgayXet().format(DATE_FMT));
                map.put("ghiChu", existing.getGhiChu());
            }
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void luuKetQua(String username, Long classId, Long hocSinhId, KetQuaCuoiNamRequest dto) {
        HoSoGiaoVien teacher = resolveTeacherOwningClass(username, classId);
        LopHoc lopHoc = classRoomRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        HoSoHocSinh student = studentProfileRepository.findById(hocSinhId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh"));
        if (student.getLopHoc() == null || !student.getLopHoc().getLopHocId().equals(classId)) {
            throw new RuntimeException("Học sinh không thuộc lớp này");
        }
        if (dto.getKetQuaHocTap() == null || dto.getKetQuaRenLuyen() == null || dto.getQuyetDinh() == null) {
            throw new IllegalArgumentException("Vui lòng chọn đủ kết quả học tập, rèn luyện và quyết định");
        }

        String namHoc = lopHoc.getNamHoc().getTenNamHoc();
        KetQuaCuoiNam ketQua = ketQuaCuoiNamRepository
                .findByHocSinh_HocSinhIdAndLopHoc_LopHocIdAndNamHoc(hocSinhId, classId, namHoc)
                .orElseGet(KetQuaCuoiNam::new);

        ketQua.setHocSinh(student);
        ketQua.setLopHoc(lopHoc);
        ketQua.setNamHoc(namHoc);
        ketQua.setKetQuaHocTap(dto.getKetQuaHocTap());
        ketQua.setKetQuaRenLuyen(dto.getKetQuaRenLuyen());
        ketQua.setQuyetDinh(dto.getQuyetDinh());
        ketQua.setDuocXetDacCach(Boolean.TRUE.equals(dto.getDuocXetDacCach()));
        ketQua.setLyDoDacCach(dto.getLyDoDacCach());
        ketQua.setGiaoVienXet(teacher);
        ketQua.setNgayXet(dto.getNgayXet() != null ? dto.getNgayXet() : LocalDate.now());
        ketQua.setGhiChu(dto.getGhiChu());

        ketQuaCuoiNamRepository.save(ketQua);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getKetQuaTheoConChoPhuHuynh(String username, Long childId) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoPhuHuynh profile = parentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ phụ huynh"));
        boolean isMyChild = profile.getDanhSachHocSinh() != null && profile.getDanhSachHocSinh().stream()
                .anyMatch(c -> c.getHocSinhId().equals(childId));
        if (!isMyChild) {
            throw new RuntimeException("Học sinh không thuộc phụ huynh này");
        }

        return ketQuaCuoiNamRepository.findByHocSinh_HocSinhIdOrderByNgayXetDesc(childId).stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTongHopToanTruong(String namHoc, Short khoiLop) {
        List<KetQuaCuoiNam> list;
        if (namHoc != null && khoiLop != null) {
            list = ketQuaCuoiNamRepository.findByNamHocAndLopHoc_KhoiLop(namHoc, khoiLop);
        } else if (namHoc != null) {
            list = ketQuaCuoiNamRepository.findByNamHoc(namHoc);
        } else {
            list = ketQuaCuoiNamRepository.findAll();
        }
        return list.stream().map(this::toMap).collect(Collectors.toList());
    }

    private Map<String, Object> toMap(KetQuaCuoiNam k) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("ketQuaId", k.getKetQuaId());
        map.put("hocSinhId", k.getHocSinh().getHocSinhId());
        map.put("hoTenHocSinh", k.getHocSinh().getHoTen());
        map.put("maHocSinh", k.getHocSinh().getMaHocSinh());
        map.put("lopHocId", k.getLopHoc().getLopHocId());
        map.put("tenLop", k.getLopHoc().getTenLop());
        map.put("namHoc", k.getNamHoc());
        map.put("ketQuaHocTap", k.getKetQuaHocTap());
        map.put("ketQuaRenLuyen", k.getKetQuaRenLuyen());
        map.put("quyetDinh", k.getQuyetDinh());
        map.put("duocXetDacCach", k.getDuocXetDacCach());
        map.put("lyDoDacCach", k.getLyDoDacCach());
        map.put("tenGiaoVienXet", k.getGiaoVienXet().getHoTen());
        map.put("ngayXet", k.getNgayXet().format(DATE_FMT));
        map.put("ghiChu", k.getGhiChu());
        return map;
    }

    private HoSoGiaoVien resolveTeacherOwningClass(String username, Long classId) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoGiaoVien teacher = teacherProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giáo viên"));
        List<LopHoc> homeroomClasses = classRoomRepository.findByGiaoVienChuNhiem_GiaoVienId(teacher.getGiaoVienId());
        boolean ownsClass = homeroomClasses.stream().anyMatch(c -> c.getLopHocId().equals(classId));
        if (!ownsClass) {
            throw new RuntimeException("Bạn không phải là GVCN của lớp này");
        }
        return teacher;
    }

    private XepLoai latestGradeForSubjectInYear(List<DanhGiaBaiLam> evaluations, Long studentId, MonHoc subject, String namHoc) {
        if (subject == null) return null;
        return evaluations.stream()
                .filter(e -> e.getBaiNop().getHocSinh().getHocSinhId().equals(studentId))
                .filter(e -> {
                    BaiTap a = e.getBaiNop().getBaiTap();
                    MonHoc assignmentSubject = resolveAssignmentSubject(a);
                    if (assignmentSubject == null || !assignmentSubject.getMonHocId().equals(subject.getMonHocId())) return false;
                    return a.getHocKy() != null && a.getHocKy().getNamHoc() != null
                            && namHoc.equals(a.getHocKy().getNamHoc().getTenNamHoc());
                })
                .map(DanhGiaBaiLam::getXepLoai)
                .filter(java.util.Objects::nonNull)
                .findFirst() // list đã sắp theo thoiDiemCham desc nên phần tử đầu là mới nhất
                .orElse(null);
    }

    private MonHoc resolveAssignmentSubject(BaiTap assignment) {
        if (assignment.getHocLieu() != null && assignment.getHocLieu().getSubject() != null) {
            return assignment.getHocLieu().getSubject();
        }
        return assignment.getDangBai() != null ? assignment.getDangBai().getMonHoc() : null;
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
}
