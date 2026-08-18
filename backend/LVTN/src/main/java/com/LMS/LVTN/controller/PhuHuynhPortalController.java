package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.PhieuHoTroRequest;
import com.LMS.LVTN.dto.response.ParentChildProfileDTO;
import com.LMS.LVTN.dto.response.ParentDashboardResponse;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.ChildItemDTO;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.PhuHuynhHocSinh;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.repository.NguoiDungRepository;
import com.LMS.LVTN.repository.PhuHuynhHocSinhRepository;
import com.LMS.LVTN.service.PhieuHoTroService;
import com.LMS.LVTN.service.TienDoHocSinhService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/parents/me")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PhuHuynhPortalController {

    TienDoHocSinhService tienDoHocSinhService;
    NguoiDungRepository nguoiDungRepository;
    PhuHuynhHocSinhRepository phuHuynhHocSinhRepository;
    PhieuHoTroService phieuHoTroService;

    // Dùng lại ở nhiều endpoint bên dưới để xác thực + tìm quan hệ phụ huynh-con,
    // tránh lặp lại logic tìm NguoiDung + kiểm tra sở hữu con ở mỗi hàm.
    private PhuHuynhHocSinh getOwnedRelation(Long childId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        NguoiDung phuHuynh = nguoiDungRepository.findById(userId).orElse(null);
        if (phuHuynh == null || phuHuynh.getHoSoPhuHuynh() == null) {
            return null;
        }
        return phuHuynhHocSinhRepository.findByPhuHuynh_PhuHuynhId(phuHuynh.getHoSoPhuHuynh().getPhuHuynhId())
                .stream()
                .filter(rel -> rel.getHocSinh() != null && rel.getHocSinh().getHocSinhId().equals(childId))
                .findFirst()
                .orElse(null);
    }

    @GetMapping("/dashboard")
    public ParentDashboardResponse getDashboard(@RequestParam(required = false) Long childId) {
        if (childId == null) {
            // For now, if no childId is passed, just return an empty dashboard
            return ParentDashboardResponse.builder().build();
        }
        return tienDoHocSinhService.getDashboardForStudent(childId);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @GetMapping("/children")
    public List<ChildItemDTO> getChildren() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        NguoiDung phuHuynh = nguoiDungRepository.findById(userId).orElse(null);
        if (phuHuynh == null || phuHuynh.getHoSoPhuHuynh() == null) {
            return Collections.emptyList();
        }

        List<PhuHuynhHocSinh> relations = phuHuynhHocSinhRepository.findByPhuHuynh_PhuHuynhId(phuHuynh.getHoSoPhuHuynh().getPhuHuynhId());
        
        if (relations == null) {
            return Collections.emptyList();
        }

        return relations.stream().map(rel -> {
            String className = "N/A";
            if (rel.getHocSinh() != null && rel.getHocSinh().getLopHoc() != null) {
                className = rel.getHocSinh().getLopHoc().getTenLop();
            }
            String name = "N/A";
            String avatar = null;
            if (rel.getHocSinh() != null) {
                name = rel.getHocSinh().getHoTen();
            }
            return ChildItemDTO.builder()
                    .id(rel.getHocSinh() != null ? rel.getHocSinh().getHocSinhId() : null)
                    .name(name)
                    .className(className)
                    .avatar(avatar)
                    .build();
        }).collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @GetMapping("/children/{childId}/rewards")
    public List<com.LMS.LVTN.dto.response.AchievementBadgeDTO> getRewards(@PathVariable Long childId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        NguoiDung phuHuynh = nguoiDungRepository.findById(userId).orElse(null);
        if (phuHuynh == null || phuHuynh.getHoSoPhuHuynh() == null) {
            return Collections.emptyList();
        }

        // Verify that this child belongs to this parent
        boolean ownsChild = phuHuynhHocSinhRepository.findByPhuHuynh_PhuHuynhId(phuHuynh.getHoSoPhuHuynh().getPhuHuynhId())
            .stream().anyMatch(rel -> rel.getHocSinh() != null && rel.getHocSinh().getHocSinhId().equals(childId));
            
        if (!ownsChild) {
            return Collections.emptyList();
        }

        // Fetch rewards from service
        return tienDoHocSinhService.getAchievementBadges(childId);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @GetMapping("/children/{childId}/assignments")
    public List<com.LMS.LVTN.dto.response.ParentAssignmentDTO> getAssignments(@PathVariable Long childId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        NguoiDung phuHuynh = nguoiDungRepository.findById(userId).orElse(null);
        if (phuHuynh == null || phuHuynh.getHoSoPhuHuynh() == null) {
            return Collections.emptyList();
        }

        // Verify that this child belongs to this parent
        boolean ownsChild = phuHuynhHocSinhRepository.findByPhuHuynh_PhuHuynhId(phuHuynh.getHoSoPhuHuynh().getPhuHuynhId())
            .stream().anyMatch(rel -> rel.getHocSinh() != null && rel.getHocSinh().getHocSinhId().equals(childId));
            
        if (!ownsChild) {
            return Collections.emptyList();
        }

        // Fetch assignments from service
        return tienDoHocSinhService.getAssignmentsForStudent(childId);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @GetMapping("/children/{childId}/profile")
    public ApiResponse<ParentChildProfileDTO> getChildProfile(@PathVariable Long childId) {
        PhuHuynhHocSinh relation = getOwnedRelation(childId);
        if (relation == null || relation.getHocSinh() == null) {
            throw new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND);
        }

        HoSoHocSinh hocSinh = relation.getHocSinh();
        ParentChildProfileDTO.ParentChildProfileDTOBuilder dto = ParentChildProfileDTO.builder()
                .id(hocSinh.getHocSinhId())
                .maHocSinh(hocSinh.getMaHocSinh())
                .hoTen(hocSinh.getHoTen())
                .ngaySinh(hocSinh.getNgaySinh())
                .gioiTinh(hocSinh.getGioiTinh() != null ? hocSinh.getGioiTinh().name() : null)
                .tongXp(hocSinh.getTongXp());

        if (hocSinh.getLopHoc() != null) {
            dto.className(hocSinh.getLopHoc().getTenLop());
            if (hocSinh.getLopHoc().getGiaoVienChuNhiem() != null) {
                dto.tenGiaoVienChuNhiem(hocSinh.getLopHoc().getGiaoVienChuNhiem().getHoTen());
                if (hocSinh.getLopHoc().getGiaoVienChuNhiem().getNguoiDung() != null) {
                    dto.sdtGiaoVienChuNhiem(hocSinh.getLopHoc().getGiaoVienChuNhiem().getNguoiDung().getSoDienThoai());
                }
            }
        }

        return ApiResponse.<ParentChildProfileDTO>builder().data(dto.build()).build();
    }

    // Endpoint chung cho phụ huynh gửi phiếu hỗ trợ liên quan tới con (bao gồm cả yêu cầu
    // cấp lại mật khẩu) — KHÔNG dùng thẳng POST /api/phieuhotro từ client vì id con phụ
    // huynh có (hocSinhId) khác hoàn toàn với nguoiDungId (khóa của bảng nguoi_dung, kiểu
    // UUID) mà PhieuHoTro cần cho nguoiDungLienQuanId; gửi nhầm sẽ luôn bị lỗi USER_NOT_FOUND.
    // Endpoint này tra đúng NguoiDung của con ở phía server rồi mới tạo phiếu.
    @PostMapping("/children/{childId}/tickets")
    public ApiResponse<String> createChildTicket(@PathVariable Long childId, @RequestBody Map<String, String> body) {
        PhuHuynhHocSinh relation = getOwnedRelation(childId);
        if (relation == null || relation.getHocSinh() == null) {
            throw new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND);
        }

        HoSoHocSinh hocSinh = relation.getHocSinh();
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
