package com.titkul.lms.controller;

import com.titkul.lms.entity.BaiTap;
import com.titkul.lms.service.BaiTapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class BaiTapController {

    private final BaiTapService assignmentService;

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('GIAO_VIEN') or hasRole('QUAN_TRI_VIEN')")
    @PostMapping
    public ResponseEntity<BaiTap> createAssignment(@RequestBody com.titkul.lms.dto.BaiTapRequest dto) {
        return ResponseEntity.ok(assignmentService.createAssignment(dto));
    }

    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<BaiTap>> getAssignments(
            @RequestParam Long classId,
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByClassId(classId, pageable));
    }
}
