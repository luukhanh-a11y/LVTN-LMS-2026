// Force recompile
package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.DangBaiRequest;
import com.LMS.LVTN.dto.response.DangBaiResponse;
import com.LMS.LVTN.dto.response.DangBaiStudentResponse;
import com.LMS.LVTN.service.DangBaiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/he-thong/dang-bai")
@RequiredArgsConstructor
public class DangBaiController {

    private final DangBaiService dangBaiService;

    @GetMapping
    public ResponseEntity<List<DangBaiResponse>> getAllDangBaiHeThong() {
        return ResponseEntity.ok(dangBaiService.getAllDangBaiHeThong());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DangBaiResponse> getDangBaiById(@PathVariable Integer id) {
        return ResponseEntity.ok(dangBaiService.getDangBaiById(id));
    }

    @GetMapping("/{id}/hoc-sinh")
    public ResponseEntity<DangBaiStudentResponse> getDangBaiByIdForStudent(@PathVariable Integer id) {
        return ResponseEntity.ok(dangBaiService.getDangBaiByIdForStudent(id));
    }

    @GetMapping("/bai-hoc/{baiHocId}")
    public ResponseEntity<List<DangBaiResponse>> getByBaiHocId(@PathVariable Integer baiHocId) {
        return ResponseEntity.ok(dangBaiService.getByBaiHocId(baiHocId));
    }

    @GetMapping("/bai-hoc/{baiHocId}/hoc-sinh")
    public ResponseEntity<List<DangBaiStudentResponse>> getByBaiHocIdForStudent(@PathVariable Integer baiHocId) {
        return ResponseEntity.ok(dangBaiService.getByBaiHocIdForStudent(baiHocId));
    }

    @GetMapping("/bai-tap/{baiTapId}/hoc-sinh")
    public ResponseEntity<List<DangBaiStudentResponse>> getByBaiTapIdForStudent(
            @PathVariable Long baiTapId,
            @RequestParam(required = false) Long hocSinhId) {
        return ResponseEntity.ok(dangBaiService.getByBaiTapIdForStudent(baiTapId, hocSinhId));
    }

    @PostMapping
    public ResponseEntity<DangBaiResponse> createDangBaiHeThong(@RequestBody DangBaiRequest request) {
        return new ResponseEntity<>(dangBaiService.createDangBaiHeThong(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DangBaiResponse> updateDangBaiHeThong(
            @PathVariable Integer id,
            @RequestBody DangBaiRequest request) {
        return ResponseEntity.ok(dangBaiService.updateDangBaiHeThong(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDangBai(@PathVariable Integer id) {
        dangBaiService.deleteDangBai(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/nhan-ban")
    public ResponseEntity<List<DangBaiResponse>> nhanBanDangBai(
            @RequestParam("baiHocCuId") Integer baiHocCuId,
            @RequestParam("baiHocMoiId") Integer baiHocMoiId) {
        return ResponseEntity.ok(dangBaiService.nhanBanDangBai(baiHocCuId, baiHocMoiId));
    }
}
