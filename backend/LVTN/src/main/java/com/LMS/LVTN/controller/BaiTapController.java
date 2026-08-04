package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.BaiTapRequest;
import com.LMS.LVTN.dto.request.TaoBaiTapRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.BaiTapResponse;
import com.LMS.LVTN.service.BaiTapService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bai-tap")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BaiTapController {

    BaiTapService baiTapService;

    @PostMapping
    public ApiResponse<BaiTapResponse> create(@RequestBody TaoBaiTapRequest request) {
        return ApiResponse.<BaiTapResponse>builder()
                .data(baiTapService.create(request.getBaiTap(), request.getDanhSachChiTiet()))
                .build();
    }

    @GetMapping
    public ApiResponse<List<BaiTapResponse>> getAll() {
        return ApiResponse.<List<BaiTapResponse>>builder()
                .data(baiTapService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<BaiTapResponse> getById(@PathVariable Long id) {
        return ApiResponse.<BaiTapResponse>builder()
                .data(baiTapService.getById(id))
                .build();
    }

    @GetMapping("/lop-hoc/{lopHocId}")
    public ApiResponse<List<BaiTapResponse>> getByLopHocId(@PathVariable Long lopHocId) {
        return ApiResponse.<List<BaiTapResponse>>builder()
                .data(baiTapService.getByLopHocId(lopHocId))
                .build();
    }

    @GetMapping("/giao-vien/{giaoVienId}")
    public ApiResponse<List<BaiTapResponse>> getByGiaoVienId(@PathVariable Long giaoVienId) {
        return ApiResponse.<List<BaiTapResponse>>builder()
                .data(baiTapService.getByGiaoVienId(giaoVienId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<BaiTapResponse> update(@PathVariable Long id, @RequestBody BaiTapRequest request) {
        return ApiResponse.<BaiTapResponse>builder()
                .data(baiTapService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        baiTapService.delete(id);
        return ApiResponse.<String>builder()
                .data("Bài tập đã được xóa thành công")
                .build();
    }
}
