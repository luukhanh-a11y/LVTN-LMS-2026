package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.BaiNopRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.BaiNopResponse;
import com.LMS.LVTN.service.BaiNopService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bai-nop")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BaiNopController {

    BaiNopService baiNopService;

    @PostMapping
    public ApiResponse<BaiNopResponse> create(@RequestBody BaiNopRequest request) {
        return ApiResponse.<BaiNopResponse>builder()
                .data(baiNopService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<BaiNopResponse>> getAll() {
        return ApiResponse.<List<BaiNopResponse>>builder()
                .data(baiNopService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<BaiNopResponse> getById(@PathVariable Long id) {
        return ApiResponse.<BaiNopResponse>builder()
                .data(baiNopService.getById(id))
                .build();
    }

    @GetMapping("/bai-tap/{baiTapId}")
    public ApiResponse<List<BaiNopResponse>> getByBaiTapId(@PathVariable Long baiTapId) {
        return ApiResponse.<List<BaiNopResponse>>builder()
                .data(baiNopService.getByBaiTapId(baiTapId))
                .build();
    }

    @GetMapping("/hoc-sinh/{hocSinhId}")
    public ApiResponse<List<BaiNopResponse>> getByHocSinhId(@PathVariable Long hocSinhId) {
        return ApiResponse.<List<BaiNopResponse>>builder()
                .data(baiNopService.getByHocSinhId(hocSinhId))
                .build();
    }

    @GetMapping("/bai-tap/{baiTapId}/lop-hoc/{lopId}")
    public ApiResponse<List<BaiNopResponse>> getAllBaiNopByBaiTapIdAndLopId(@PathVariable Long baiTapId, @PathVariable Long lopId) {
        return ApiResponse.<List<BaiNopResponse>>builder()
                .data(baiNopService.getAllBaiNopByBaiTapIdAndLopId(baiTapId, lopId))
                .build();
    }

    // Số bài nộp (tự luận/H5P) đang chờ giáo viên đang đăng nhập chấm, dùng cho thẻ "Bài tập chờ chấm" ở dashboard.
    @GetMapping("/dem-cho-cham")
    public ApiResponse<Long> demBaiChoCham() {
        String nguoiDungId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.<Long>builder()
                .data(baiNopService.demBaiChoCham(nguoiDungId))
                .build();
    }

    // Số bài chờ chấm, gộp theo từng lớp GV đang dạy (lopHocId -> số lượng), dùng cho badge trên trang Chấm bài.
    @GetMapping("/dem-cho-cham-theo-lop")
    public ApiResponse<Map<Long, Long>> demBaiChoChamTheoLop() {
        String nguoiDungId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.<Map<Long, Long>>builder()
                .data(baiNopService.demBaiChoChamTheoLop(nguoiDungId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<BaiNopResponse> update(@PathVariable Long id, @RequestBody BaiNopRequest request) {
        return ApiResponse.<BaiNopResponse>builder()
                .data(baiNopService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        baiNopService.delete(id);
        return ApiResponse.<String>builder()
                .data("Bài nộp đã được xóa thành công")
                .build();
    }
}
