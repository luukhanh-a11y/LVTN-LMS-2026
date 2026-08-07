package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.LopHocRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.LopHocResponse;
import com.LMS.LVTN.service.LopHocService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/lophoc")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LopHocController {

    LopHocService lopHocService;

    @PostMapping
    public ApiResponse<LopHocResponse> create(@RequestBody LopHocRequest request) {
        return ApiResponse.<LopHocResponse>builder()
                .data(lopHocService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<Page<LopHocResponse>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long namHocId,
            @RequestParam(required = false) Integer khoiLop,
            @PageableDefault(size = 15) Pageable pageable) {
        return ApiResponse.<Page<LopHocResponse>>builder()
                .data(lopHocService.searchLopHoc(keyword, namHocId, khoiLop, pageable))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<LopHocResponse> getById(@PathVariable Long id) {
        return ApiResponse.<LopHocResponse>builder()
                .data(lopHocService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<LopHocResponse> update(@PathVariable Long id, @RequestBody LopHocRequest request) {
        return ApiResponse.<LopHocResponse>builder()
                .data(lopHocService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        lopHocService.delete(id);
        return ApiResponse.<String>builder()
                .data("Lớp học đã được xóa thành công")
                .build();
    }
}
