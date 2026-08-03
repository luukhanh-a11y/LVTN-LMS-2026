package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.PhanCongGiangDayRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.PhanCongGiangDayResponse;
import com.LMS.LVTN.service.PhanCongGiangDayService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phan-cong-giang-day")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PhanCongGiangDayController {

    PhanCongGiangDayService phanCongGiangDayService;

    @PostMapping
    public ApiResponse<PhanCongGiangDayResponse> create(@RequestBody PhanCongGiangDayRequest request) {
        return ApiResponse.<PhanCongGiangDayResponse>builder()
                .data(phanCongGiangDayService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PhanCongGiangDayResponse>> getAll() {
        return ApiResponse.<List<PhanCongGiangDayResponse>>builder()
                .data(phanCongGiangDayService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<PhanCongGiangDayResponse> getById(@PathVariable Long id) {
        return ApiResponse.<PhanCongGiangDayResponse>builder()
                .data(phanCongGiangDayService.getById(id))
                .build();
    }

    @GetMapping("/giao-vien/{giaoVienId}")
    public ApiResponse<List<PhanCongGiangDayResponse>> getByGiaoVienId(@PathVariable Long giaoVienId) {
        return ApiResponse.<List<PhanCongGiangDayResponse>>builder()
                .data(phanCongGiangDayService.getByGiaoVienId(giaoVienId))
                .build();
    }

    @GetMapping("/lop-hoc/{lopHocId}")
    public ApiResponse<List<PhanCongGiangDayResponse>> getByLopHocId(@PathVariable Long lopHocId) {
        return ApiResponse.<List<PhanCongGiangDayResponse>>builder()
                .data(phanCongGiangDayService.getByLopHocId(lopHocId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<PhanCongGiangDayResponse> update(@PathVariable Long id, @RequestBody PhanCongGiangDayRequest request) {
        return ApiResponse.<PhanCongGiangDayResponse>builder()
                .data(phanCongGiangDayService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        phanCongGiangDayService.delete(id);
        return ApiResponse.<String>builder()
                .data("Phân công giảng dạy đã được xóa thành công")
                .build();
    }
}
