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
    public ApiResponse<List<SachResponse>> getAll(
            @RequestParam(value = "hocKyId", required = false) Integer hocKyId,
            @RequestParam(value = "maMon", required = false) String maMon,
            @RequestParam(value = "namHocId", required = false) Integer namHocId) {
        return ApiResponse.<List<SachResponse>>builder()
                .data(sachService.getAll(hocKyId, maMon, namHocId))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<SachResponse> getById(@PathVariable Integer id) {
        return ApiResponse.<SachResponse>builder()
                .data(sachService.getById(id))
                .build();
    }

    @GetMapping("/sach-giao-khoa/hoc-sinh/{hocSinhId}/hoc-ky/{hocKyId}")
    public ApiResponse<List<SachResponse>> getSachGiaoKhoaForStudent(@PathVariable Long hocSinhId, @PathVariable Integer hocKyId) {
        return ApiResponse.<List<SachResponse>>builder()
                .data(sachService.getSachGiaoKhoaForStudent(hocSinhId, hocKyId))
                .build();
    }

    @GetMapping("/sach-bai-tap/phan-cong")
    public ApiResponse<List<SachResponse>> getSachBaiTapByPhanCong(
            @RequestParam("giaoVienId") Long giaoVienId,
            @RequestParam("lopHocId") Long lopHocId,
            @RequestParam("maMon") String maMon,
            @RequestParam("hocKyId") Integer hocKyId) {
        return ApiResponse.<List<SachResponse>>builder()
                .data(sachService.getSachBaiTapByPhanCong(giaoVienId, lopHocId, maMon, hocKyId))
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

    @PostMapping("/nhan-ban-khong-chu-de")
    public ApiResponse<List<SachResponse>> nhanBanSachKhongChuDe(
            @RequestParam("maMon") String maMon,
            @RequestParam("khoiLop") Short khoiLop,
            @RequestParam("hocKyCuId") Integer hocKyCuId,
            @RequestParam("hocKyMoiId") Integer hocKyMoiId) {
        return ApiResponse.<List<SachResponse>>builder()
                .data(sachService.nhanBanSachKhongChuDe(maMon, khoiLop, hocKyCuId, hocKyMoiId))
                .build();
    }

    @PostMapping("/nhan-ban-kem-chu-de")
    public ApiResponse<List<SachResponse>> nhanBanSachKemChuDe(
            @RequestParam("maMon") String maMon,
            @RequestParam("khoiLop") Short khoiLop,
            @RequestParam("hocKyCuId") Integer hocKyCuId,
            @RequestParam("hocKyMoiId") Integer hocKyMoiId) {
        return ApiResponse.<List<SachResponse>>builder()
                .data(sachService.nhanBanSachKemChuDe(maMon, khoiLop, hocKyCuId, hocKyMoiId))
                .build();
    }

    @PostMapping("/nhan-ban")
    public ApiResponse<List<SachResponse>> nhanBanSachTheoHocKy(
            @RequestParam("maMon") String maMon,
            @RequestParam("khoiLop") Short khoiLop,
            @RequestParam("hocKyCuId") Integer hocKyCuId,
            @RequestParam("hocKyMoiId") Integer hocKyMoiId) {
        return ApiResponse.<List<SachResponse>>builder()
                .data(sachService.nhanBanSachTheoHocKy(maMon, khoiLop, hocKyCuId, hocKyMoiId))
                .build();
    }
}

