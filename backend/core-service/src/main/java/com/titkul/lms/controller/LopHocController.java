package com.titkul.lms.controller;

import com.titkul.lms.entity.LopHoc;
import com.titkul.lms.service.LopHocService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
public class LopHocController {

    private final LopHocService classRoomService;

    @GetMapping
    public ResponseEntity<List<LopHoc>> getAllClasses() {
        return ResponseEntity.ok(classRoomService.getAllClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LopHoc> getClassById(@PathVariable Long id) {
        return ResponseEntity.ok(classRoomService.getClassById(id));
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<com.titkul.lms.dto.HocSinhLopResponse>> getStudentsByClass(@PathVariable Long id) {
        return ResponseEntity.ok(classRoomService.getStudentsByClassId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createClass(@jakarta.validation.Valid @RequestBody com.titkul.lms.dto.LopHocRequest dto) {
        try {
            LopHoc classRoom = classRoomService.createClass(dto);
            return ResponseEntity.ok(classRoom);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateClass(@PathVariable Long id, @jakarta.validation.Valid @RequestBody com.titkul.lms.dto.LopHocRequest dto) {
        try {
            LopHoc classRoom = classRoomService.updateClass(id, dto);
            return ResponseEntity.ok(classRoom);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleStatus(@PathVariable Long id) {
        try {
            LopHoc classRoom = classRoomService.toggleStatus(id);
            return ResponseEntity.ok(classRoom);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
