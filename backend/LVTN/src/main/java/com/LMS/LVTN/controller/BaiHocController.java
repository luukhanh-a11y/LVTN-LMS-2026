package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.BaiHocRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.BaiHocResponse;
import com.LMS.LVTN.service.BaiHocService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bai-hoc")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BaiHocController {

    BaiHocService baiHocService;

    @PostMapping
    public ApiResponse<BaiHocResponse> create(@RequestBody BaiHocRequest request) {
        return ApiResponse.<BaiHocResponse>builder()
                .data(baiHocService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<BaiHocResponse>> getAll() {
        return ApiResponse.<List<BaiHocResponse>>builder()
                .data(baiHocService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<BaiHocResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<BaiHocResponse>builder()
                .data(baiHocService.getById(id))
                .build();
    }

    @GetMapping("/chu-de/{chuDeId}")
    public ApiResponse<List<BaiHocResponse>> getByChuDeId(@PathVariable Integer chuDeId) {
        return ApiResponse.<List<BaiHocResponse>>builder()
                .data(baiHocService.getByChuDeId(chuDeId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<BaiHocResponse> update(@PathVariable Integer id, @RequestBody BaiHocRequest request) {
        return ApiResponse.<BaiHocResponse>builder()
                .data(baiHocService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Integer id) {
        baiHocService.delete(id);
        return ApiResponse.<String>builder()
                .data("Bài học đã được xóa thành công")
                .build();
    }
}
