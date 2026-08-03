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
    public ApiResponse<List<LopHocResponse>> getAll() {
        return ApiResponse.<List<LopHocResponse>>builder()
                .data(lopHocService.getAll())
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
