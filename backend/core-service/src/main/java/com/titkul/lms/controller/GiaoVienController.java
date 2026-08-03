package com.titkul.lms.controller;

import com.titkul.lms.dto.GiaoVienDashboardResponse;
import com.titkul.lms.dto.KetQuaCuoiNamRequest;
import com.titkul.lms.service.BaoCaoAiBuoiSangService;
import com.titkul.lms.service.GiaoVienService;
import com.titkul.lms.service.KetQuaCuoiNamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
public class GiaoVienController {

    private final GiaoVienService teacherService;
    private final BaoCaoAiBuoiSangService morningReportService;
    private final KetQuaCuoiNamService ketQuaCuoiNamService;

    @GetMapping("/me/morning-report")
    public ResponseEntity<?> getMorningReport(@org.springframework.web.bind.annotation.RequestParam(required = false) Long classId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(morningReportService.getOrGenerate(authentication.getName(), classId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/dashboard")
    public ResponseEntity<?> getDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }

        try {
            GiaoVienDashboardResponse dashboard = teacherService.getDashboard(authentication.getName());
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
    @GetMapping
    public ResponseEntity<?> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/me/classes")
    public ResponseEntity<?> getClasses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(teacherService.getClasses(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/classes/{classId}")
    public ResponseEntity<?> getClassDetails(@org.springframework.web.bind.annotation.PathVariable Long classId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(teacherService.getClassDetails(authentication.getName(), classId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/reports")
    public ResponseEntity<?> getReports(
            @org.springframework.web.bind.annotation.RequestParam(required = false) Long classId,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Integer semesterId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(teacherService.getReports(authentication.getName(), classId, semesterId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/classes/{classId}/ket-qua-cuoi-nam")
    public ResponseEntity<?> getDanhSachXetLopHoc(@org.springframework.web.bind.annotation.PathVariable Long classId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(ketQuaCuoiNamService.getDanhSachXetLopHoc(authentication.getName(), classId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @org.springframework.web.bind.annotation.PutMapping("/me/classes/{classId}/students/{hocSinhId}/ket-qua-cuoi-nam")
    public ResponseEntity<?> luuKetQuaCuoiNam(
            @org.springframework.web.bind.annotation.PathVariable Long classId,
            @org.springframework.web.bind.annotation.PathVariable Long hocSinhId,
            @org.springframework.web.bind.annotation.RequestBody KetQuaCuoiNamRequest dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            ketQuaCuoiNamService.luuKetQua(authentication.getName(), classId, hocSinhId, dto);
            return ResponseEntity.ok(java.util.Map.of("message", "Đã lưu kết quả cuối năm"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/students/{studentId}/progress")
    public ResponseEntity<?> getStudentProgress(@org.springframework.web.bind.annotation.PathVariable Long studentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(teacherService.getStudentProgress(authentication.getName(), studentId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @org.springframework.web.bind.annotation.PostMapping("/me/announcements")
    public ResponseEntity<?> createAnnouncement(@org.springframework.web.bind.annotation.RequestBody com.titkul.lms.dto.ThongBaoRequest dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(teacherService.createAnnouncement(authentication.getName(), dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/announcements")
    public ResponseEntity<?> getMyAnnouncements() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(teacherService.getMyAnnouncements(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @org.springframework.web.bind.annotation.PostMapping("/me/students/{studentId}/rewards")
    public ResponseEntity<?> awardBadge(
            @PathVariable Long studentId,
            @org.springframework.web.bind.annotation.RequestBody com.titkul.lms.dto.TraoHuyHieuRequest dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(teacherService.awardBadge(authentication.getName(), studentId, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
