package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.HopThuThongBaoResponse;
import com.LMS.LVTN.service.HopThuThongBaoService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hop-thu-thong-bao")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HopThuThongBaoController {

    HopThuThongBaoService HopThuThongBaoService;

    @GetMapping("/nguoi-dung/{nguoiDungId}")
    public ApiResponse<List<HopThuThongBaoResponse>> getAllByNguoiDungId(@PathVariable String nguoiDungId) {
        return ApiResponse.<List<HopThuThongBaoResponse>>builder()
                .data(HopThuThongBaoService.getAllByNguoiDungId(nguoiDungId))
                .build();
    }

    @GetMapping("/nguoi-dung/{nguoiDungId}/ghim")
    public ApiResponse<List<HopThuThongBaoResponse>> getAllGhimByNguoiDungId(@PathVariable String nguoiDungId) {
        return ApiResponse.<List<HopThuThongBaoResponse>>builder()
                .data(HopThuThongBaoService.getAllGhimByNguoiDungId(nguoiDungId))
                .build();
    }

    @GetMapping("/nguoi-dung/{nguoiDungId}/khong-ghim")
    public ApiResponse<List<HopThuThongBaoResponse>> getAllNotGhimByNguoiDungId(@PathVariable String nguoiDungId) {
        return ApiResponse.<List<HopThuThongBaoResponse>>builder()
                .data(HopThuThongBaoService.getAllNotGhimByNguoiDungId(nguoiDungId))
                .build();
    }

    @PostMapping("/mark-as-read/{thongBaoId}")
    public ApiResponse<HopThuThongBaoResponse> markAsRead(
            @RequestHeader("Authorization") String token,
            @PathVariable Long thongBaoId) {
        
        return ApiResponse.<HopThuThongBaoResponse>builder()
                .data(HopThuThongBaoService.markAsRead(token, thongBaoId))
                .build();
    }
}

