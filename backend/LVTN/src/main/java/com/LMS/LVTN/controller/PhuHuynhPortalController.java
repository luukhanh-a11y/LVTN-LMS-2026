package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.response.ParentDashboardResponse;
import com.LMS.LVTN.dto.response.ChildItemDTO;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.PhuHuynhHocSinh;
import com.LMS.LVTN.repository.NguoiDungRepository;
import com.LMS.LVTN.repository.PhuHuynhHocSinhRepository;
import com.LMS.LVTN.service.TienDoHocSinhService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/parents/me")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PhuHuynhPortalController {

    TienDoHocSinhService tienDoHocSinhService;
    NguoiDungRepository nguoiDungRepository;
    PhuHuynhHocSinhRepository phuHuynhHocSinhRepository;

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
}
