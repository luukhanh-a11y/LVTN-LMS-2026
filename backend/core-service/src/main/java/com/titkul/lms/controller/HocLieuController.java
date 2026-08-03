package com.titkul.lms.controller;

import com.titkul.lms.dto.HocLieuPhanLoaiRequest;
import com.titkul.lms.dto.HocLieuNoiBoRequest;
import com.titkul.lms.dto.GoiYAiBaiTapRequest;
import com.titkul.lms.entity.HocLieu;
import com.titkul.lms.service.HocLieuService;
import com.titkul.lms.service.GoiYAiBaiTapService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
public class HocLieuController {

    private final HocLieuService hocLieuService;
    private final GoiYAiBaiTapService goiYAiBaiTapService;

    // Xác thực nội bộ NestJS bằng shared secret, không qua JWT người dùng.
    @Value("${jwt.secret}")
    private String internalSecret;

    @PostMapping("/api/v1/internal/hoc-lieu")
    public ResponseEntity<?> receiveFromH5pService(
            @RequestBody HocLieuNoiBoRequest dto,
            @RequestHeader(value = "X-Internal-Secret", required = false) String secret) {
        if (!Objects.equals(secret, internalSecret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(hocLieuService.createOrUpdateFromH5p(dto));
    }

    @GetMapping("/api/v1/hoc-lieu")
    public ResponseEntity<List<HocLieu>> list(@RequestParam(required = false) Long giaoVienId) {
        if (giaoVienId != null) {
            return ResponseEntity.ok(hocLieuService.listByTeacherUserId(giaoVienId));
        }
        return ResponseEntity.ok(hocLieuService.listAll());
    }

    @GetMapping("/api/v1/hoc-lieu/{id}")
    public ResponseEntity<HocLieu> getById(@PathVariable Long id) {
        return ResponseEntity.ok(hocLieuService.getById(id));
    }

    @DeleteMapping("/api/v1/hoc-lieu/{id}")
    @PreAuthorize("hasRole('GIAO_VIEN') or hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        hocLieuService.delete(id, authentication.getName(), isAdmin);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/v1/hoc-lieu/ai-goi-y-bai-tap")
    @PreAuthorize("hasRole('GIAO_VIEN') or hasRole('ADMIN')")
    public ResponseEntity<?> generateExerciseSuggestions(@RequestBody GoiYAiBaiTapRequest dto) {
        List<String> suggestions = goiYAiBaiTapService.generateExerciseSuggestions(dto.getGrade(), dto.getSubjectId(), dto.getTopicHint());
        return ResponseEntity.ok(java.util.Map.of("suggestions", suggestions));
    }

    @PatchMapping("/api/v1/hoc-lieu/{id}/classification")
    @PreAuthorize("hasRole('GIAO_VIEN')")
    public ResponseEntity<HocLieu> updateClassification(
            @PathVariable Long id,
            @RequestBody HocLieuPhanLoaiRequest dto,
            Authentication authentication) {
        return ResponseEntity.ok(hocLieuService.updateClassification(id, dto, authentication.getName()));
    }
}
