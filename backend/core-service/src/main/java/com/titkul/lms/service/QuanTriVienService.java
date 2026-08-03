package com.titkul.lms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.titkul.lms.constant.AppConstants;
import com.titkul.lms.dto.BanGhiImportResponse;
import com.titkul.lms.dto.KetQuaImportResponse;
import com.titkul.lms.dto.ParsedHocSinhExcelRow;
import com.titkul.lms.dto.ParsedGiaoVienExcelRow;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuanTriVienService {

    private final ExcelImportService excelImportService;
    private final NguoiDungRepository userRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final HoSoHocSinhRepository studentProfileRepository;
    private final HoSoPhuHuynhRepository parentProfileRepository;
    private final LopHocRepository classRoomRepository;
    private final LoImportRepository importBatchRepository;
    private final NamHocRepository academicYearRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Transactional
    public KetQuaImportResponse importStudentsAndParents(MultipartFile file) {
        List<ParsedHocSinhExcelRow> parsedRows = excelImportService.parseStudentImportFile(file);

        String defaultPasswordHash = passwordEncoder.encode(AppConstants.DEFAULT_PASSWORD);
        Map<String, LopHoc> classCache = new HashMap<>();
        Map<String, HoSoPhuHuynh> parentCache = new HashMap<>();

        List<BanGhiImportResponse> failures = new ArrayList<>();
        int successCount = 0;

        for (ParsedHocSinhExcelRow row : parsedRows) {
            if (!row.isValid()) {
                failures.add(toFailRecord(row.getRowNumber(), row.getStudentCode(), row.getStudentName(), row.getErrorMsg()));
                continue;
            }
            try {
                LopHoc classRoom = resolveClassRoom(row.getClassName(), classCache);

                if (userRepository.existsByTenDangNhap(row.getStudentCode())) {
                    throw new RuntimeException("Mã học sinh (Username) đã tồn tại trong hệ thống.");
                }

                HoSoPhuHuynh parentProfile = resolveOrCreateParent(row, parentCache, defaultPasswordHash);
                createStudent(row, classRoom, parentProfile, defaultPasswordHash);
                successCount++;
            } catch (Exception e) {
                failures.add(toFailRecord(row.getRowNumber(), row.getStudentCode(), row.getStudentName(), e.getMessage()));
            }
        }

        KetQuaImportResponse result = buildResult(parsedRows.size(), successCount, failures);
        saveImportBatch("TAI_KHOAN", file.getOriginalFilename(), result, failures);
        return result;
    }

    public KetQuaImportResponse importTeachers(MultipartFile file) {
        List<ParsedGiaoVienExcelRow> parsedRows = excelImportService.parseTeacherImportFile(file);
        String defaultPasswordHash = passwordEncoder.encode(AppConstants.DEFAULT_PASSWORD);

        List<BanGhiImportResponse> failures = new ArrayList<>();
        int successCount = 0;

        for (ParsedGiaoVienExcelRow row : parsedRows) {
            if (!row.isValid()) {
                failures.add(toFailRecord(row.getRowNumber(), row.getTeacherCode(), row.getFullName(), row.getErrorMsg()));
                continue;
            }
            try {
                if (userRepository.existsByTenDangNhap(row.getTeacherCode())) {
                    throw new RuntimeException("Mã giáo viên đã tồn tại.");
                }
                createTeacher(row, defaultPasswordHash);
                successCount++;
            } catch (Exception e) {
                failures.add(toFailRecord(row.getRowNumber(), row.getTeacherCode(), row.getFullName(), e.getMessage()));
            }
        }

        return buildResult(parsedRows.size(), successCount, failures);
    }

    // ── Private helpers ───────────────────────────────────────────────────────────

    private LopHoc resolveClassRoom(String rawName, Map<String, LopHoc> cache) {
        return cache.computeIfAbsent(rawName.trim(), name -> {
            LopHoc found = classRoomRepository.findByTenLop(name).orElse(null);
            if (found == null && !name.toLowerCase().startsWith("lớp ")) {
                found = classRoomRepository.findByTenLop("Lớp " + name).orElse(null);
            }
            if (found == null && name.toLowerCase().startsWith("lớp ")) {
                found = classRoomRepository.findByTenLop(name.substring(4).trim()).orElse(null);
            }
            return found != null ? found : createClassRoom(name);
        });
    }

    private LopHoc createClassRoom(String name) {
        LopHoc cls = new LopHoc();
        cls.setTenLop(name);
        cls.setKhoiLop(extractGrade(name));
        cls.setNamHoc(resolveCurrentAcademicYear());
        cls.setSiSoToiDa((short) 40);
        cls.setTrangThai(TrangThaiLopHoc.ACTIVE);
        return classRoomRepository.save(cls);
    }

    private short extractGrade(String className) {
        for (char c : className.toCharArray()) {
            if (Character.isDigit(c)) return (short) Character.getNumericValue(c);
        }
        return 1;
    }

    private NamHoc resolveCurrentAcademicYear() {
        return academicYearRepository.findByTenNamHoc("2026-2027").orElseGet(() -> {
            NamHoc y = new NamHoc();
            y.setTenNamHoc("2026-2027");
            y.setNgayBatDau(java.time.LocalDate.of(2026, 9, 5));
            y.setNgayKetThuc(java.time.LocalDate.of(2027, 5, 31));
            return academicYearRepository.save(y);
        });
    }

    private HoSoPhuHuynh resolveOrCreateParent(ParsedHocSinhExcelRow row, Map<String, HoSoPhuHuynh> cache, String passwordHash) {
        String phone = row.getParentPhone();
        if (cache.containsKey(phone)) return cache.get(phone);

        Optional<NguoiDung> existingUser = userRepository.findByTenDangNhap(phone);
        HoSoPhuHuynh profile;

        if (existingUser.isPresent()) {
            profile = parentProfileRepository.findByNguoiDung_NguoiDungId(existingUser.get().getNguoiDungId())
                    .orElseThrow(() -> new RuntimeException("Dữ liệu lỗi: SĐT đã tồn tại nhưng không phải phụ huynh."));
        } else {
            NguoiDung pUser = new NguoiDung();
            pUser.setTenDangNhap(phone);
            pUser.setSoDienThoai(phone);
            pUser.setMatKhauHash(passwordHash);
            pUser.setVaiTro(VaiTro.PHU_HUYNH);
            pUser.setTrangThai(TrangThaiNguoiDung.ACTIVE);
            pUser.setBatBuocDoiMk(true);
            String email = row.getParentEmail();
            if (email != null && !email.trim().isEmpty()) pUser.setEmail(email.trim());
            pUser = userRepository.save(pUser);

            profile = new HoSoPhuHuynh();
            profile.setNguoiDung(pUser);
            profile.setHoTen(row.getParentName());
            profile.setEmailNhanThongBao(row.getParentEmail());
            profile = parentProfileRepository.save(profile);
        }

        cache.put(phone, profile);
        return profile;
    }

    private void createStudent(ParsedHocSinhExcelRow row, LopHoc cls, HoSoPhuHuynh parent, String passwordHash) {
        NguoiDung sUser = new NguoiDung();
        sUser.setTenDangNhap(row.getStudentCode());
        sUser.setMatKhauHash(passwordHash);
        sUser.setVaiTro(VaiTro.HOC_SINH);
        sUser.setTrangThai(TrangThaiNguoiDung.ACTIVE);
        sUser.setBatBuocDoiMk(true);
        sUser.setEmail("hs" + row.getStudentCode().toLowerCase() + "@titkul.edu.vn");
        sUser = userRepository.save(sUser);

        HoSoHocSinh student = new HoSoHocSinh();
        student.setNguoiDung(sUser);
        student.setMaHocSinh(row.getStudentCode());
        student.setHoTen(row.getStudentName());
        student.setNgaySinh(row.getStudentDob());
        student.setLopHoc(cls);
        student.setPhuHuynh(parent);
        studentProfileRepository.save(student);
    }

    private void createTeacher(ParsedGiaoVienExcelRow row, String passwordHash) {
        NguoiDung user = new NguoiDung();
        user.setTenDangNhap(row.getTeacherCode());
        user.setMatKhauHash(passwordHash);
        user.setVaiTro(VaiTro.GIAO_VIEN);
        user.setTrangThai(TrangThaiNguoiDung.ACTIVE);
        user.setBatBuocDoiMk(true);
        if (row.getPhone() != null && !row.getPhone().trim().isEmpty()) user.setSoDienThoai(row.getPhone());
        user = userRepository.save(user);

        HoSoGiaoVien profile = new HoSoGiaoVien();
        profile.setNguoiDung(user);
        profile.setMaGiaoVien(row.getTeacherCode());
        profile.setHoTen(row.getFullName());
        profile.setBoMon(row.getDepartment());
        profile.setNgaySinh(row.getDateOfBirth());
        teacherProfileRepository.save(profile);
    }

    private KetQuaImportResponse buildResult(int total, int successCount, List<BanGhiImportResponse> failures) {
        KetQuaImportResponse result = new KetQuaImportResponse();
        result.setTotalRows(total);
        result.setSuccessCount(successCount);
        result.setFailureCount(failures.size());
        result.setFailures(failures);
        return result;
    }

    private BanGhiImportResponse toFailRecord(int row, String code, String name, String msg) {
        return new BanGhiImportResponse(row, code, name, msg);
    }

    private void saveImportBatch(String type, String fileName, KetQuaImportResponse result, List<BanGhiImportResponse> failures) {
        try {
            LoImport batch = new LoImport();
            batch.setLoaiImport(type);
            batch.setTenFile(fileName);
            batch.setSoThanhCong(result.getSuccessCount());
            batch.setTrangThai(resolveStatus(result.getSuccessCount(), result.getFailureCount()));
            batch.setChiTietLoi(objectMapper.writeValueAsString(failures));
            batch.setTomTatKetQua(objectMapper.writeValueAsString(Map.of(
                    "total", result.getTotalRows(),
                    "success", result.getSuccessCount(),
                    "failure", result.getFailureCount()
            )));
            userRepository.findByTenDangNhap("AD001").ifPresent(batch::setNguoiThucHien);
            importBatchRepository.save(batch);
        } catch (Exception ex) {
            log.warn("Failed to save import batch log", ex);
        }
    }

    private String resolveStatus(int success, int failure) {
        if (failure == 0) return "THANH_CONG";
        if (success == 0) return "THAT_BAI";
        return "DANG_XU_LY";
    }
}
