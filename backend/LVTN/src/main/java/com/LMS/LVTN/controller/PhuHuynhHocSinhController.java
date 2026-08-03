package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.PhuHuynhHocSinhRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.PhuHuynhHocSinhResponse;
import com.LMS.LVTN.service.PhuHuynhHocSinhService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phu-huynh-hoc-sinh")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PhuHuynhHocSinhController {

    PhuHuynhHocSinhService phuHuynhHocSinhService;

    @GetMapping("/hoc-sinh/phu-huynh/{idUser}")
    public ApiResponse<List<PhuHuynhHocSinhResponse>> getDSHocSinhByPhuHuynhId(@PathVariable String idUser) {
        return ApiResponse.<List<PhuHuynhHocSinhResponse>>builder()
                .data(phuHuynhHocSinhService.getDSHocSinhByPhuHuynhId(idUser))
                .build();
    }

    @GetMapping("/phu-huynh/hoc-sinh/{idUser}")
    public ApiResponse<List<PhuHuynhHocSinhResponse>> getDSPhuHuynhByHocSinhId(@PathVariable String idUser) {
        return ApiResponse.<List<PhuHuynhHocSinhResponse>>builder()
                .data(phuHuynhHocSinhService.getDSPhuHuynhByHocSinhId(idUser))
                .build();
    }

    @GetMapping("/phu-huynh/hoc-sinh/ma/{maHocSinh}")
    public ApiResponse<List<PhuHuynhHocSinhResponse>> getDSPhuHuynhByMaHocSinh(@PathVariable String maHocSinh) {
        return ApiResponse.<List<PhuHuynhHocSinhResponse>>builder()
                .data(phuHuynhHocSinhService.getDSPhuHuynhByMaHocSinh(maHocSinh))
                .build();
    }

    @PostMapping
    public ApiResponse<String> createQuanHe(@RequestBody PhuHuynhHocSinhRequest request) {
        phuHuynhHocSinhService.createQuanHe(request);
        return ApiResponse.<String>builder()
                .data("Tạo quan hệ thành công")
                .build();
    }

    @DeleteMapping("/{idMoiQuanHe}")
    public ApiResponse<String> deleteQuanHe(@PathVariable Long idMoiQuanHe) {
        phuHuynhHocSinhService.deleteQuanHe(idMoiQuanHe);
        return ApiResponse.<String>builder()
                .data("Xóa quan hệ thành công")
                .build();
    }
}
