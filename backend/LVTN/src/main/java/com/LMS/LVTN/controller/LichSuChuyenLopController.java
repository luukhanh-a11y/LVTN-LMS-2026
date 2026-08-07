package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.LichSuChuyenLopRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.LichSuChuyenLopResponse;
import com.LMS.LVTN.service.LichSuChuyenLopService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lich-su-chuyen-lop")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LichSuChuyenLopController {

    LichSuChuyenLopService lichSuChuyenLopService;

    @PostMapping
    public ApiResponse<LichSuChuyenLopResponse> create(@RequestBody LichSuChuyenLopRequest request) {
        return ApiResponse.<LichSuChuyenLopResponse>builder()
                .data(lichSuChuyenLopService.create(request))
                .build();
    }

    @PostMapping("/chuyen-lop")
    public ApiResponse<List<LichSuChuyenLopResponse>> chuyenLopHangLoat(@RequestBody List<LichSuChuyenLopRequest> requests) {
        return ApiResponse.<List<LichSuChuyenLopResponse>>builder()
                .data(lichSuChuyenLopService.chuyenLopHangLoat(requests))
                .build();
    }

    @PostMapping("/bulk-chuyen-lop")
    public ApiResponse<String> bulkThucHienChuyenLop(
            @RequestHeader("Authorization") String token,
            @RequestBody com.LMS.LVTN.dto.request.BulkChuyenLopRequest request) {
        lichSuChuyenLopService.bulkThucHienChuyenLop(token, request);
        return ApiResponse.<String>builder()
                .data("Chuyển lớp hàng loạt thành công!")
                .build();
    }

    @GetMapping
    public ApiResponse<List<LichSuChuyenLopResponse>> getAll() {
        return ApiResponse.<List<LichSuChuyenLopResponse>>builder()
                .data(lichSuChuyenLopService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<LichSuChuyenLopResponse> getById(@PathVariable Long id) {
        return ApiResponse.<LichSuChuyenLopResponse>builder()
                .data(lichSuChuyenLopService.getById(id))
                .build();
    }

    @GetMapping("/hoc-sinh/{hocSinhId}")
    public ApiResponse<List<LichSuChuyenLopResponse>> getByHocSinhId(@PathVariable Long hocSinhId) {
        return ApiResponse.<List<LichSuChuyenLopResponse>>builder()
                .data(lichSuChuyenLopService.getByHocSinhId(hocSinhId))
                .build();
    }

    @GetMapping("/nguoi-thuc-hien/{nguoiThucHienId}")
    public ApiResponse<List<LichSuChuyenLopResponse>> getAllByNguoiThucHienId(@PathVariable String nguoiThucHienId) {
        return ApiResponse.<List<LichSuChuyenLopResponse>>builder()
                .data(lichSuChuyenLopService.getAllByNguoiThucHienId(nguoiThucHienId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<LichSuChuyenLopResponse> update(@PathVariable Long id, @RequestBody LichSuChuyenLopRequest request) {
        return ApiResponse.<LichSuChuyenLopResponse>builder()
                .data(lichSuChuyenLopService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        lichSuChuyenLopService.delete(id);
        return ApiResponse.<String>builder()
                .data("Lịch sử chuyển lớp đã được xóa thành công")
                .build();
    }
}
