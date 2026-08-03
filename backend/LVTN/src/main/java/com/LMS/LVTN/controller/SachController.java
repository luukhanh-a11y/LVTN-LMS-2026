package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.SachRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.SachResponse;
import com.LMS.LVTN.service.SachService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sach")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SachController {

    SachService sachService;

    @PostMapping
    public ApiResponse<SachResponse> create(@RequestBody SachRequest request) {
        return ApiResponse.<SachResponse>builder()
                .data(sachService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<SachResponse>> getAll() {
        return ApiResponse.<List<SachResponse>>builder()
                .data(sachService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<SachResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<SachResponse>builder()
                .data(sachService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<SachResponse> update(@PathVariable Integer id, @RequestBody SachRequest request) {
        return ApiResponse.<SachResponse>builder()
                .data(sachService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Integer id) {
        sachService.delete(id);
        return ApiResponse.<String>builder()
                .data("Sách đã được xóa thành công")
                .build();
    }
}
