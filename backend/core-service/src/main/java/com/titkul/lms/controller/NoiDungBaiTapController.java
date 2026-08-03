package com.titkul.lms.controller;

import com.titkul.lms.dto.NoiDungBaiTapRequest;
import com.titkul.lms.service.NoiDungBaiTapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// Soạn thảo nội dung quiz cho bài tập bộ sách (AI-03 / dang_bai kiểu JSON_TEXT).
// Chỉ Admin/GV được vào — luôn trả về cả cauHinh lẫn dapAnChuan để soạn/sửa.
@RestController
@RequestMapping("/api/v1/dang-bai")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GIAO_VIEN') or hasRole('ADMIN')")
public class NoiDungBaiTapController {

    private final NoiDungBaiTapService noiDungBaiTapService;

    @GetMapping("/thu-vien-goc")
    public ResponseEntity<?> getThuVienGocLibrary() {
        return ResponseEntity.ok(noiDungBaiTapService.getThuVienGocLibrary());
    }

    @GetMapping("/bai-hoc/{baiHocId}")
    public ResponseEntity<?> getBaiHocDetail(@PathVariable Integer baiHocId) {
        try {
            return ResponseEntity.ok(noiDungBaiTapService.getBaiHocDetail(baiHocId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/quiz-slots")
    public ResponseEntity<?> getQuizSlots(@RequestParam Integer subjectId, @RequestParam Integer grade) {
        try {
            return ResponseEntity.ok(noiDungBaiTapService.getQuizSlots(subjectId, grade));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/noi-dung")
    public ResponseEntity<?> getNoiDung(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(noiDungBaiTapService.getNoiDung(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/noi-dung")
    public ResponseEntity<?> luuNoiDung(@PathVariable Integer id, @RequestBody NoiDungBaiTapRequest dto) {
        try {
            noiDungBaiTapService.luuNoiDung(id, dto);
            return ResponseEntity.ok(Map.of("message", "Đã lưu nội dung"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
