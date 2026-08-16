package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.KetQuaCuoiNamRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.KetQuaCuoiNamResponse;
import com.LMS.LVTN.service.KetQuaCuoiNamService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ket-qua-cuoi-nam")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KetQuaCuoiNamController {

    KetQuaCuoiNamService ketQuaCuoiNamService;

    @PostMapping
    public ApiResponse<KetQuaCuoiNamResponse> create(@RequestBody KetQuaCuoiNamRequest request) {
        return ApiResponse.<KetQuaCuoiNamResponse>builder()
                .data(ketQuaCuoiNamService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<KetQuaCuoiNamResponse>> getAll(@RequestParam(required = false) String namHoc) {
        return ApiResponse.<List<KetQuaCuoiNamResponse>>builder()
                .data(ketQuaCuoiNamService.getAll(namHoc))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<KetQuaCuoiNamResponse> getById(@PathVariable Long id) {
        return ApiResponse.<KetQuaCuoiNamResponse>builder()
                .data(ketQuaCuoiNamService.getById(id))
                .build();
    }

    @GetMapping("/hoc-sinh/{hocSinhId}/nam-hoc")
    public ApiResponse<KetQuaCuoiNamResponse> getByHocSinhIdAndNamHoc(@PathVariable Long hocSinhId, @RequestParam(value = "namHoc", required = false) String namHoc) {
        return ApiResponse.<KetQuaCuoiNamResponse>builder()
                .data(ketQuaCuoiNamService.getByHocSinhIdAndNamHoc(hocSinhId, namHoc))
                .build();
    }

    @GetMapping("/hoc-sinh/{hocSinhId}")
    public ApiResponse<KetQuaCuoiNamResponse> getByHocSinhId(@PathVariable Long hocSinhId, @RequestParam(value = "namHoc", required = false) String namHoc) {
        return ApiResponse.<KetQuaCuoiNamResponse>builder()
                .data(ketQuaCuoiNamService.getByHocSinhIdAndNamHoc(hocSinhId, namHoc))
                .build();
    }

    @GetMapping("/lop-hoc/{lopHocId}")
    public ApiResponse<List<KetQuaCuoiNamResponse>> getByLopHocId(@PathVariable Long lopHocId) {
        return ApiResponse.<List<KetQuaCuoiNamResponse>>builder()
                .data(ketQuaCuoiNamService.getByLopHocId(lopHocId))
                .build();
    }

    @PutMapping("/lop-hoc/{lopHocId}/hoc-sinh/{hocSinhId}")
    public ApiResponse<KetQuaCuoiNamResponse> saveOrUpdateKetQuaCuoiNam(
            @PathVariable Long lopHocId,
            @PathVariable Long hocSinhId,
            @RequestBody KetQuaCuoiNamRequest request,
            @RequestHeader("Authorization") String token) {
        return ApiResponse.<KetQuaCuoiNamResponse>builder()
                .data(ketQuaCuoiNamService.saveOrUpdateKetQuaCuoiNam(lopHocId, hocSinhId, request, token))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<KetQuaCuoiNamResponse> update(@PathVariable Long id, @RequestBody KetQuaCuoiNamRequest request) {
        return ApiResponse.<KetQuaCuoiNamResponse>builder()
                .data(ketQuaCuoiNamService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        ketQuaCuoiNamService.delete(id);
        return ApiResponse.<String>builder()
                .data("Xóa kết quả cuối năm thành công!")
                .build();
    }

    @PostMapping("/thong-bao-mo-danh-gia")
    public ApiResponse<String> thongBaoMoDanhGia(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam String namHoc) {
        ketQuaCuoiNamService.thongBaoMoDanhGia(token, namHoc);
        return ApiResponse.<String>builder()
                .data("Đã gửi thông báo mở đợt đánh giá cho tất cả Giáo viên chủ nhiệm.")
                .build();
    }

    @PostMapping("/duyet-hang-loat")
    public ApiResponse<List<KetQuaCuoiNamResponse>> duyetHangLoat(
            @RequestHeader("Authorization") String token,
            @RequestBody List<com.LMS.LVTN.dto.request.KetQuaCuoiNamDuyetRequest> requests) {
        return ApiResponse.<List<KetQuaCuoiNamResponse>>builder()
                .data(ketQuaCuoiNamService.duyetHangLoat(token, requests))
                .build();
    }
}
