package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.LoImportResponse;
import com.LMS.LVTN.enums.LoaiImport;
import com.LMS.LVTN.service.LoImportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lo-import")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LoImportController {

    LoImportService loImportService;

    @GetMapping
    public ApiResponse<List<LoImportResponse>> getAll() {
        return ApiResponse.<List<LoImportResponse>>builder()
                .data(loImportService.getAll())
                .build();
    }

    @GetMapping("/loai-import/{loaiImport}")
    public ApiResponse<List<LoImportResponse>> getByLoaiImport(@PathVariable LoaiImport loaiImport) {
        return ApiResponse.<List<LoImportResponse>>builder()
                .data(loImportService.getByLoaiImport(loaiImport))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<LoImportResponse> getById(@PathVariable Long id) {
        return ApiResponse.<LoImportResponse>builder()
                .data(loImportService.getById(id))
                .build();
    }
}
