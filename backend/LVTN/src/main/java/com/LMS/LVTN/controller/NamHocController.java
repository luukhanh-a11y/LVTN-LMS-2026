package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.NamHocRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.NamHocResponse;
import com.LMS.LVTN.service.NamHocService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/namhoc")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NamHocController {

    NamHocService namHocService;

    @PostMapping
    public ApiResponse<NamHocResponse> create(@RequestBody NamHocRequest request) {
        return ApiResponse.<NamHocResponse>builder()
                .data(namHocService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<NamHocResponse>> getAll() {
        return ApiResponse.<List<NamHocResponse>>builder()
                .data(namHocService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<NamHocResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<NamHocResponse>builder()
                .data(namHocService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<NamHocResponse> update(@PathVariable Integer id, @RequestBody NamHocRequest request) {
        return ApiResponse.<NamHocResponse>builder()
                .data(namHocService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Integer id) {
        namHocService.delete(id);
        return ApiResponse.<String>builder()
                .data("Năm học đã được xóa thành công")
                .build();
    }
}
