package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.CauHinhHeThongRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.CauHinhHeThongResponse;
import com.LMS.LVTN.service.CauHinhHeThongService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cau-hinh-he-thong")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CauHinhHeThongController {

    CauHinhHeThongService cauHinhHeThongService;

    @PostMapping
    public ApiResponse<CauHinhHeThongResponse> create(@RequestBody CauHinhHeThongRequest request) {
        return ApiResponse.<CauHinhHeThongResponse>builder()
                .data(cauHinhHeThongService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<CauHinhHeThongResponse>> getAll() {
        return ApiResponse.<List<CauHinhHeThongResponse>>builder()
                .data(cauHinhHeThongService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CauHinhHeThongResponse> getById(@PathVariable Short id) {
        return ApiResponse.<CauHinhHeThongResponse>builder()
                .data(cauHinhHeThongService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CauHinhHeThongResponse> update(@PathVariable Short id, @RequestBody CauHinhHeThongRequest request) {
        return ApiResponse.<CauHinhHeThongResponse>builder()
                .data(cauHinhHeThongService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Short id) {
        cauHinhHeThongService.delete(id);
        return ApiResponse.<String>builder()
                .data("Cấu hình hệ thống đã được xóa thành công")
                .build();
    }

    @PutMapping("/{id}/dot-danh-gia")
    public ApiResponse<CauHinhHeThongResponse> setDotDanhGia(
            @PathVariable Short id,
            @RequestParam boolean dangMo,
            @RequestParam(required = false) String namHoc) {
        return ApiResponse.<CauHinhHeThongResponse>builder()
                .data(cauHinhHeThongService.setDotDanhGia(id, dangMo, namHoc))
                .build();
    }
}
