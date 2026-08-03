package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.HuyHieuRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.HuyHieuResponse;
import com.LMS.LVTN.service.HuyHieuService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/huy-hieu")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HuyHieuController {

    HuyHieuService huyHieuService;

    @PostMapping
    public ApiResponse<HuyHieuResponse> create(@RequestBody HuyHieuRequest request) {
        return ApiResponse.<HuyHieuResponse>builder()
                .data(huyHieuService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<HuyHieuResponse>> getAll() {
        return ApiResponse.<List<HuyHieuResponse>>builder()
                .data(huyHieuService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<HuyHieuResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<HuyHieuResponse>builder()
                .data(huyHieuService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<HuyHieuResponse> update(@PathVariable Integer id, @RequestBody HuyHieuRequest request) {
        return ApiResponse.<HuyHieuResponse>builder()
                .data(huyHieuService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Integer id) {
        huyHieuService.delete(id);
        return ApiResponse.<String>builder()
                .data("Huy hiệu đã được xóa thành công")
                .build();
    }
}
