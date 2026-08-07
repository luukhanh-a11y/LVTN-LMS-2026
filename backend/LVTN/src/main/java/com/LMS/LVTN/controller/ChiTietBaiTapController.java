package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.ChiTietBaiTapRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.ChiTietBaiTapResponse;
import com.LMS.LVTN.service.ChiTietBaiTapService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chitietbaitap")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChiTietBaiTapController {

    ChiTietBaiTapService chiTietBaiTapService;

    @PostMapping
    public ApiResponse<ChiTietBaiTapResponse> create(@RequestBody ChiTietBaiTapRequest request) {
        return ApiResponse.<ChiTietBaiTapResponse>builder()
                .data(chiTietBaiTapService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ChiTietBaiTapResponse>> getAll() {
        return ApiResponse.<List<ChiTietBaiTapResponse>>builder()
                .data(chiTietBaiTapService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ChiTietBaiTapResponse> getById(@PathVariable Long id) {
        return ApiResponse.<ChiTietBaiTapResponse>builder()
                .data(chiTietBaiTapService.getById(id))
                .build();
    }

    @GetMapping("/baitap/{baiTapId}")
    public ApiResponse<List<ChiTietBaiTapResponse>> getByBaiTapId(@PathVariable Long baiTapId) {
        return ApiResponse.<List<ChiTietBaiTapResponse>>builder()
                .data(chiTietBaiTapService.getByBaiTapId(baiTapId))
                .build();
    }

    @GetMapping("/dangbai/{dangBaiId}")
    public ApiResponse<List<ChiTietBaiTapResponse>> getByDangBaiId(@PathVariable Integer dangBaiId) {
        return ApiResponse.<List<ChiTietBaiTapResponse>>builder()
                .data(chiTietBaiTapService.getByDangBaiId(dangBaiId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ChiTietBaiTapResponse> update(@PathVariable Long id, @RequestBody ChiTietBaiTapRequest request) {
        return ApiResponse.<ChiTietBaiTapResponse>builder()
                .data(chiTietBaiTapService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        chiTietBaiTapService.delete(id);
        return ApiResponse.<String>builder()
                .data("Chi tiết bài tập đã được xóa thành công")
                .build();
    }
}
