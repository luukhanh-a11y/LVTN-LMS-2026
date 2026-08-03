package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.HocKyRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.HocKyResponse;
import com.LMS.LVTN.service.HocKyService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hoc-ky")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HocKyController {

    HocKyService hocKyService;

    @PostMapping
    public ApiResponse<HocKyResponse> create(@RequestBody HocKyRequest request) {
        return ApiResponse.<HocKyResponse>builder()
                .data(hocKyService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<HocKyResponse>> getAll() {
        return ApiResponse.<List<HocKyResponse>>builder()
                .data(hocKyService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<HocKyResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<HocKyResponse>builder()
                .data(hocKyService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<HocKyResponse> update(@PathVariable Integer id, @RequestBody HocKyRequest request) {
        return ApiResponse.<HocKyResponse>builder()
                .data(hocKyService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Integer id) {
        hocKyService.delete(id);
        return ApiResponse.<String>builder()
                .data("Học kỳ đã được xóa thành công")
                .build();
    }
}
