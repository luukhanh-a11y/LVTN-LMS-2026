package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.DangBaiRequest;
import com.LMS.LVTN.dto.response.DangBaiResponse;
import com.LMS.LVTN.service.DangBaiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Kho học liệu của giáo viên: dang_bai nguồn GIAO_VIEN_BO_SUNG, gắn vào 1 Bài học
// có sẵn (hoc_lieu cũ đã được sáp nhập vào dang_bai — xem soMoLo_db.sql).
@RestController
@RequestMapping("/api/giao-vien/dang-bai")
@RequiredArgsConstructor
public class GiaoVienDangBaiController {

    private final DangBaiService dangBaiService;

    @GetMapping
    public ResponseEntity<List<DangBaiResponse>> getMyMaterials(@RequestParam("giaoVienId") Long giaoVienId) {
        return ResponseEntity.ok(dangBaiService.getMyMaterials(giaoVienId));
    }

    @GetMapping("/by-h5p/{h5pNoiDungId}")
    public ResponseEntity<DangBaiResponse> getByH5pNoiDungId(@PathVariable String h5pNoiDungId) {
        DangBaiResponse response = dangBaiService.getByH5pNoiDungId(h5pNoiDungId);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<DangBaiResponse> createMaterial(@RequestBody DangBaiRequest request) {
        return new ResponseEntity<>(dangBaiService.createDangBaiGiaoVien(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DangBaiResponse> updateMaterial(
            @PathVariable Integer id,
            @RequestBody DangBaiRequest request) {
        return ResponseEntity.ok(dangBaiService.updateDangBaiGiaoVien(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(
            @PathVariable Integer id,
            @RequestParam("giaoVienId") Long giaoVienId) {
        dangBaiService.deleteDangBaiGiaoVien(id, giaoVienId);
        return ResponseEntity.noContent().build();
    }
}
