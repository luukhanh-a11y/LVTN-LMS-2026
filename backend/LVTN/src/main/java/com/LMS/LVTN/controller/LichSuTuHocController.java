package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.LichSuTuHocRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.LichSuTuHocResponse;
import com.LMS.LVTN.service.LichSuTuHocService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lich-su-tu-hoc")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LichSuTuHocController {

    LichSuTuHocService lichSuTuHocService;

    @PostMapping("/nop-bai")
    public ApiResponse<LichSuTuHocResponse> nopBai(@RequestBody LichSuTuHocRequest request) {
        return ApiResponse.<LichSuTuHocResponse>builder()
                .data(lichSuTuHocService.nopBai(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<LichSuTuHocResponse>> getAll() {
        return ApiResponse.<List<LichSuTuHocResponse>>builder()
                .data(lichSuTuHocService.getAll())
                .build();
    }

    @GetMapping("/hoc-sinh/{idHocSinh}")
    public ApiResponse<List<LichSuTuHocResponse>> getAllByHocSinhId(@PathVariable Long idHocSinh) {
        return ApiResponse.<List<LichSuTuHocResponse>>builder()
                .data(lichSuTuHocService.getAllByHocSinhId(idHocSinh))
                .build();
    }

    @GetMapping("/hoc-sinh/ma/{maHocSinh}")
    public ApiResponse<List<LichSuTuHocResponse>> getAllByMaHocSinh(@PathVariable String maHocSinh) {
        return ApiResponse.<List<LichSuTuHocResponse>>builder()
                .data(lichSuTuHocService.getAllByMaHocSinh(maHocSinh))
                .build();
    }

    @GetMapping("/dang-bai/{maDangBai}")
    public ApiResponse<List<LichSuTuHocResponse>> getByDangBaiId(@PathVariable Integer maDangBai, 
                                                                 @RequestParam(required = false) Long maHocSinh) {
        if (maHocSinh != null) {
            return ApiResponse.<List<LichSuTuHocResponse>>builder()
                    .data(lichSuTuHocService.getByDangBaiId(maDangBai, maHocSinh))
                    .build();
        }
        return ApiResponse.<List<LichSuTuHocResponse>>builder()
                .data(lichSuTuHocService.getByDangBaiId(maDangBai))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<LichSuTuHocResponse> update(@PathVariable Long id, @RequestBody LichSuTuHocRequest request) {
        return ApiResponse.<LichSuTuHocResponse>builder()
                .data(lichSuTuHocService.udpate(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        lichSuTuHocService.delete(id);
        return ApiResponse.<String>builder()
                .data("Lịch sử tự học đã được xóa thành công")
                .build();
    }
}
