package com.titkul.lms.controller;

import com.titkul.lms.dto.PhuHuynhDashboardResponse;
import com.titkul.lms.dto.ResetChildPasswordRequest;
import com.titkul.lms.service.PhuHuynhService;
import com.titkul.lms.service.KetQuaCuoiNamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/parents")
@RequiredArgsConstructor
public class PhuHuynhController {

    private final PhuHuynhService parentService;
    private final KetQuaCuoiNamService ketQuaCuoiNamService;

    @GetMapping("/me/dashboard")
    public ResponseEntity<?> getDashboard(@org.springframework.web.bind.annotation.RequestParam(required = false) Long childId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }

        try {
            PhuHuynhDashboardResponse dashboard = parentService.getDashboard(authentication.getName(), childId);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/children")
    public ResponseEntity<?> getChildren() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(parentService.getChildren(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/grades")
    public ResponseEntity<?> getGrades(@org.springframework.web.bind.annotation.RequestParam(required = false) Long childId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(parentService.getGrades(authentication.getName(), childId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/children/{childId}/assignments")
    public ResponseEntity<?> getAssignments(@PathVariable Long childId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(parentService.getAssignments(authentication.getName(), childId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/notifications")
    public ResponseEntity<?> getNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(parentService.getNotifications(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/me/notifications/{notificationId}/read")
    public ResponseEntity<?> markNotificationRead(@PathVariable Long notificationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            parentService.markNotificationRead(authentication.getName(), notificationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/me/notifications/read-all")
    public ResponseEntity<?> markAllNotificationsRead() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            parentService.markAllNotificationsRead(authentication.getName());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/children/{childId}/rewards")
    public ResponseEntity<?> getRewards(@PathVariable Long childId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(parentService.getRewards(authentication.getName(), childId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/me/children/{childId}/reset-password")
    public ResponseEntity<?> resetChildPassword(@PathVariable Long childId, @Valid @RequestBody ResetChildPasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            parentService.resetChildPassword(authentication.getName(), childId, request.getNewPassword());
            return ResponseEntity.ok(java.util.Map.of("message", "Đã cấp lại mật khẩu cho con. Con sẽ phải đổi mật khẩu ở lần đăng nhập tiếp theo."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/children/{childId}/ket-qua-cuoi-nam")
    public ResponseEntity<?> getKetQuaCuoiNam(@PathVariable Long childId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(ketQuaCuoiNamService.getKetQuaTheoConChoPhuHuynh(authentication.getName(), childId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me/children/{childId}/subject-tree")
    public ResponseEntity<?> getSubjectTree(@PathVariable Long childId,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Integer subjectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Vui lòng đăng nhập"));
        }
        try {
            return ResponseEntity.ok(parentService.getSubjectTree(authentication.getName(), childId, subjectId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
