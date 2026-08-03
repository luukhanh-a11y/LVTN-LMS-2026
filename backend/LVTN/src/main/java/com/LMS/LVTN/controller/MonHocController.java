package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.MonHocRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.MonHocResponse;
import com.LMS.LVTN.service.MonHocService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monhoc")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MonHocController {

    MonHocService monHocService;

    @PostMapping
    public ApiResponse<MonHocResponse> create(@RequestBody MonHocRequest request) {
        return ApiResponse.<MonHocResponse>builder()
                .data(monHocService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<MonHocResponse>> getAll() {
        return ApiResponse.<List<MonHocResponse>>builder()
                .data(monHocService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<MonHocResponse> getById(@PathVariable Short id) {
        return ApiResponse.<MonHocResponse>builder()
                .data(monHocService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<MonHocResponse> update(@PathVariable Short id, @RequestBody MonHocRequest request) {
        return ApiResponse.<MonHocResponse>builder()
                .data(monHocService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Short id) {
        monHocService.delete(id);
        return ApiResponse.<String>builder()
                .data("Môn học đã được xóa thành công")
                .build();
    }
}
