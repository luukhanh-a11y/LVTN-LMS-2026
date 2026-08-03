package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.DanhGiaBaiLamRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.DanhGiaBaiLamResponse;
import com.LMS.LVTN.service.DanhGiaBaiLamService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/danh-gia-bai-lam")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DanhGiaBaiLamController {

    DanhGiaBaiLamService danhGiaBaiLamService;

    @PostMapping
    public ApiResponse<DanhGiaBaiLamResponse> create(@RequestBody DanhGiaBaiLamRequest request) {
        return ApiResponse.<DanhGiaBaiLamResponse>builder()
                .data(danhGiaBaiLamService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<DanhGiaBaiLamResponse>> getAll() {
        return ApiResponse.<List<DanhGiaBaiLamResponse>>builder()
                .data(danhGiaBaiLamService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<DanhGiaBaiLamResponse> getById(@PathVariable Long id) {
        return ApiResponse.<DanhGiaBaiLamResponse>builder()
                .data(danhGiaBaiLamService.getById(id))
                .build();
    }

    @GetMapping("/bai-nop/{baiNopId}")
    public ApiResponse<DanhGiaBaiLamResponse> getByBaiNopId(@PathVariable Long baiNopId) {
        return ApiResponse.<DanhGiaBaiLamResponse>builder()
                .data(danhGiaBaiLamService.getByBaiNopId(baiNopId))
                .build();
    }

    @GetMapping("/giao-vien/{giaoVienId}")
    public ApiResponse<List<DanhGiaBaiLamResponse>> getByGiaoVienId(@PathVariable Long giaoVienId) {
        return ApiResponse.<List<DanhGiaBaiLamResponse>>builder()
                .data(danhGiaBaiLamService.getByGiaoVienId(giaoVienId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<DanhGiaBaiLamResponse> update(@PathVariable Long id, @RequestBody DanhGiaBaiLamRequest request) {
        return ApiResponse.<DanhGiaBaiLamResponse>builder()
                .data(danhGiaBaiLamService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        danhGiaBaiLamService.delete(id);
        return ApiResponse.<String>builder()
                .data("Đánh giá bài làm đã được xóa thành công")
                .build();
    }
}
