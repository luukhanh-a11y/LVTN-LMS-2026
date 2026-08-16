package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.KhenThuongHocSinhRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.KhenThuongHocSinhResponse;
import com.LMS.LVTN.service.KhenThuongHocSinhService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khen-thuong-hoc-sinh")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KhenThuongHocSinhController {

    KhenThuongHocSinhService khenThuongHocSinhService;

    @PostMapping("/tang-thu-cong")
    public ApiResponse<KhenThuongHocSinhResponse> tangHuyHieuThuCong(@RequestHeader("Authorization") String token, @RequestBody KhenThuongHocSinhRequest request) {
        return ApiResponse.<KhenThuongHocSinhResponse>builder()
                .data(khenThuongHocSinhService.tangHuyHieuThuCong(token, request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<KhenThuongHocSinhResponse>> getAll(@RequestParam(required = false) Long namHocId) {
        return ApiResponse.<List<KhenThuongHocSinhResponse>>builder()
                .data(khenThuongHocSinhService.getAllKhenThuong(namHocId))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<KhenThuongHocSinhResponse> getById(@PathVariable Long id) {
        return ApiResponse.<KhenThuongHocSinhResponse>builder()
                .data(khenThuongHocSinhService.getKhenThuongById(id))
                .build();
    }

    @GetMapping("/hoc-sinh/{hocSinhId}")
    public ApiResponse<List<KhenThuongHocSinhResponse>> getByHocSinhId(@PathVariable Long hocSinhId, @RequestParam(required = false) Long namHocId) {
        return ApiResponse.<List<KhenThuongHocSinhResponse>>builder()
                .data(khenThuongHocSinhService.getKhenThuongByHocSinh(hocSinhId, namHocId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<KhenThuongHocSinhResponse> update(@PathVariable Long id, @RequestBody KhenThuongHocSinhRequest request) {
        return ApiResponse.<KhenThuongHocSinhResponse>builder()
                .data(khenThuongHocSinhService.updateKhenThuong(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        khenThuongHocSinhService.deleteKhenThuong(id);
        return ApiResponse.<String>builder()
                .data("Khen thưởng đã được xóa thành công")
                .build();
    }
}
