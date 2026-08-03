package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.ThongBaoRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.ThongBaoResponse;
import com.LMS.LVTN.service.ThongBaoService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/thongbao")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ThongBaoController {

    ThongBaoService thongBaoService;

    @PostMapping
    public ApiResponse<ThongBaoResponse> create(@RequestBody ThongBaoRequest request) {
        return ApiResponse.<ThongBaoResponse>builder()
                .data(thongBaoService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ThongBaoResponse>> getAll() {
        return ApiResponse.<List<ThongBaoResponse>>builder()
                .data(thongBaoService.getAll())
                .build();
    }

    @GetMapping("/nguoi-dung/{idNguoiDung}")
    public ApiResponse<List<ThongBaoResponse>> getAllByid(@PathVariable String idNguoiDung) {
        return ApiResponse.<List<ThongBaoResponse>>builder()
                .data(thongBaoService.getAllByid(idNguoiDung))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ThongBaoResponse> getById(@PathVariable Long id) {
        return ApiResponse.<ThongBaoResponse>builder()
                .data(thongBaoService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ThongBaoResponse> update(@PathVariable Long id, @RequestBody ThongBaoRequest request) {
        return ApiResponse.<ThongBaoResponse>builder()
                .data(thongBaoService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        thongBaoService.delete(id);
        return ApiResponse.<String>builder()
                .data("Thông báo đã được xóa thành công")
                .build();
    }
}
