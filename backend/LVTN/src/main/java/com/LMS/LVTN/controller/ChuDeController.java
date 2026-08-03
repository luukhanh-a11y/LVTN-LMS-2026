package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.ChuDeRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.ChuDeResponse;
import com.LMS.LVTN.service.ChuDeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chude")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChuDeController {

    ChuDeService chuDeService;

    @PostMapping
    public ApiResponse<ChuDeResponse> create(@RequestBody ChuDeRequest request) {
        return ApiResponse.<ChuDeResponse>builder()
                .data(chuDeService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ChuDeResponse>> getAll() {
        return ApiResponse.<List<ChuDeResponse>>builder()
                .data(chuDeService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ChuDeResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<ChuDeResponse>builder()
                .data(chuDeService.getById(id))
                .build();
    }

    @GetMapping("/sach/{sachId}")
    public ApiResponse<List<ChuDeResponse>> getBySachId(@PathVariable Integer sachId) {
        return ApiResponse.<List<ChuDeResponse>>builder()
                .data(chuDeService.getBySachId(sachId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ChuDeResponse> update(@PathVariable Integer id, @RequestBody ChuDeRequest request) {
        return ApiResponse.<ChuDeResponse>builder()
                .data(chuDeService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Integer id) {
        chuDeService.delete(id);
        return ApiResponse.<String>builder()
                .data("Chủ đề đã được xóa thành công")
                .build();
    }
}
