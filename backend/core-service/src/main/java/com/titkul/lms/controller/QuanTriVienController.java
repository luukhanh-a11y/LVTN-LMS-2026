package com.titkul.lms.controller;

import com.titkul.lms.dto.KetQuaImportResponse;
import com.titkul.lms.service.QuanTriVienService;
import com.titkul.lms.service.QuanTriVienDashboardService;
import com.titkul.lms.service.CauHinhHeThongService;
import com.titkul.lms.service.QuanLyNguoiDungService;
import com.titkul.lms.service.KetQuaCuoiNamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.jdbc.core.JdbcTemplate;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class QuanTriVienController {

    private final QuanTriVienService adminService;
    private final QuanLyNguoiDungService userManagementService;
    private final CauHinhHeThongService systemConfigService;
    private final QuanTriVienDashboardService adminDashboardService;
    private final JdbcTemplate jdbcTemplate;
    private final KetQuaCuoiNamService ketQuaCuoiNamService;

    @GetMapping("/db-debug")
    public ResponseEntity<?> getDbDebug() {
        return ResponseEntity.ok(jdbcTemplate.queryForList("SHOW TRIGGERS LIKE 'phieu_ho_tro'"));
    }

    @PostMapping("/import/users")
    public ResponseEntity<?> importUsers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        KetQuaImportResponse result = adminService.importStudentsAndParents(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/import/teachers")
    public ResponseEntity<?> importTeachers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        KetQuaImportResponse result = adminService.importTeachers(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody com.titkul.lms.dto.TaoNguoiDungRequest dto) {
        try {
            return ResponseEntity.ok(userManagementService.createUser(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userManagementService.toggleUserStatus(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody com.titkul.lms.entity.NguoiDung updateDto) {
        try {
            return ResponseEntity.ok(userManagementService.updateUser(id, updateDto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/transfer-class")
    public ResponseEntity<?> transferClass(
            @PathVariable Long id,
            @RequestParam Long newClassId,
            @RequestParam(required = false) String reason,
            @RequestParam(required = false) String note) {
        org.springframework.security.core.Authentication authentication =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            com.titkul.lms.entity.LyDoChuyenLop transferReason = reason != null
                    ? com.titkul.lms.entity.LyDoChuyenLop.valueOf(reason)
                    : null;
            userManagementService.transferClass(id, newClassId, authentication.getName(), transferReason, note);
            return ResponseEntity.ok(java.util.Map.of("message", "Chuyển lớp thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/ket-qua-cuoi-nam")
    public ResponseEntity<?> getTongHopKetQuaCuoiNam(
            @RequestParam(required = false) String namHoc,
            @RequestParam(required = false) Short khoiLop) {
        try {
            return ResponseEntity.ok(ketQuaCuoiNamService.getTongHopToanTruong(namHoc, khoiLop));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/users/{id}/class-transfer-history")
    public ResponseEntity<?> getClassTransferHistory(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userManagementService.getClassTransferHistory(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/config")
    public ResponseEntity<?> getSystemConfig() {
        return ResponseEntity.ok(systemConfigService.getSystemConfig());
    }

    @PutMapping("/config")
    public ResponseEntity<?> updateSystemConfig(@RequestBody com.titkul.lms.entity.CauHinhHeThong config) {
        return ResponseEntity.ok(systemConfigService.updateSystemConfig(config));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(adminDashboardService.getDashboardStats());
    }
}
