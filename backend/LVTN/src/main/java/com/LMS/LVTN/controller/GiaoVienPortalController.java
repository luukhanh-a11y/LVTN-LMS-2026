package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.PhieuHoTroRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.LopHocRepository;
import com.LMS.LVTN.repository.NguoiDungRepository;
import com.LMS.LVTN.service.PhieuHoTroService;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// Các API "của tôi" dành cho giáo viên đang đăng nhập — tương tự PhuHuynhPortalController,
// dùng để tra cứu đúng phạm vi (lớp chủ nhiệm) mà không cần client tự truyền giaoVienId.
@RestController
@RequestMapping("/api/teachers/me")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GiaoVienPortalController {

    NguoiDungRepository nguoiDungRepository;
    LopHocRepository lopHocRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    PhieuHoTroService phieuHoTroService;

    @Getter
    @Builder
    public static class HomeroomStudentDTO {
        private Long id;
        private String maHocSinh;
        private String hoTen;
        private String className;
    }

    private HoSoGiaoVien getCurrentTeacherProfile() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        NguoiDung nguoiDung = nguoiDungRepository.findById(userId).orElse(null);
        return nguoiDung != null ? nguoiDung.getHoSoGiaoVien() : null;
    }

    // Danh sách học sinh thuộc (các) lớp mà giáo viên đang đăng nhập làm chủ nhiệm —
    // dùng để chọn học sinh khi gửi phiếu hỗ trợ (VD: cấp lại mật khẩu cho học sinh).
    @GetMapping("/homeroom-students")
    public ApiResponse<List<HomeroomStudentDTO>> getHomeroomStudents() {
        HoSoGiaoVien giaoVien = getCurrentTeacherProfile();
        if (giaoVien == null) {
            return ApiResponse.<List<HomeroomStudentDTO>>builder().data(Collections.emptyList()).build();
        }

        List<LopHoc> lopChuNhiem = lopHocRepository.findByGiaoVienChuNhiem_GiaoVienId(giaoVien.getGiaoVienId());

        List<HomeroomStudentDTO> result = lopChuNhiem.stream()
                .flatMap(lop -> hoSoHocSinhRepository.findByLopHoc_LopHocId(lop.getLopHocId()).stream()
                        .map(hs -> HomeroomStudentDTO.builder()
                                .id(hs.getHocSinhId())
                                .maHocSinh(hs.getMaHocSinh())
                                .hoTen(hs.getHoTen())
                                .className(lop.getTenLop())
                                .build()))
                .collect(Collectors.toList());

        return ApiResponse.<List<HomeroomStudentDTO>>builder().data(result).build();
    }

    // Endpoint gửi phiếu hỗ trợ liên quan tới một học sinh chủ nhiệm (bao gồm cấp lại mật
    // khẩu) — tương tự /parents/me/children/{childId}/tickets: client chỉ biết hocSinhId,
    // server tự tra đúng NguoiDung của học sinh và xác thực học sinh thuộc lớp chủ nhiệm
    // của giáo viên trước khi tạo phiếu, tránh giáo viên gửi phiếu cho học sinh ngoài lớp mình.
    @PostMapping("/students/{hocSinhId}/tickets")
    public ApiResponse<String> createStudentTicket(@PathVariable Long hocSinhId, @RequestBody Map<String, String> body) {
        HoSoGiaoVien giaoVien = getCurrentTeacherProfile();
        if (giaoVien == null) {
            throw new AppExceptions(Errorcode.UNAUTHORIZED);
        }

        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(hocSinhId)
                .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND));

        boolean isHomeroomStudent = hocSinh.getLopHoc() != null
                && hocSinh.getLopHoc().getGiaoVienChuNhiem() != null
                && hocSinh.getLopHoc().getGiaoVienChuNhiem().getGiaoVienId().equals(giaoVien.getGiaoVienId());
        if (!isHomeroomStudent) {
            throw new AppExceptions(Errorcode.UNAUTHORIZED);
        }

        NguoiDung childUser = hocSinh.getNguoiDung();
        if (childUser == null) {
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);
        }

        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        PhieuHoTroRequest request = new PhieuHoTroRequest();
        request.setNguoiDungTaoId(userId);
        request.setNguoiDungLienQuanId(childUser.getNguoiDungId());
        request.setLoaiYeuCau(body.getOrDefault("loaiYeuCau", "HO_TRO_KY_THUAT"));
        request.setMoTa(body.get("moTa"));

        phieuHoTroService.create(request);
        return ApiResponse.<String>builder().data("Đã gửi yêu cầu, vui lòng chờ nhà trường xử lý").build();
    }
}
