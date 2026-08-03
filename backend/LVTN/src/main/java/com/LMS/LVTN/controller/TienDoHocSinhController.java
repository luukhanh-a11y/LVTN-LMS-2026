package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.TienDoHocSinhResponse;
import com.LMS.LVTN.service.TienDoHocSinhService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tien-do-hoc-sinh")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TienDoHocSinhController {

    TienDoHocSinhService tienDoHocSinhService;

    @GetMapping
    public ApiResponse<List<TienDoHocSinhResponse>> getAll() {
        return ApiResponse.<List<TienDoHocSinhResponse>>builder()
                .data(tienDoHocSinhService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<TienDoHocSinhResponse> getById(@PathVariable Long id) {
        return ApiResponse.<TienDoHocSinhResponse>builder()
                .data(tienDoHocSinhService.getById(id))
                .build();
    }

    @PostMapping("/update-progress")
    public ApiResponse<String> updateProgress(@RequestParam Long hocSinhId, @RequestParam Integer baiHocId) {
        tienDoHocSinhService.updateProgress(hocSinhId, baiHocId);
        return ApiResponse.<String>builder()
                .data("Cập nhật tiến độ thành công")
                .build();
    }

    @PostMapping("/unmark-progress")
    public ApiResponse<String> unmarkProgress(@RequestParam Long hocSinhId, @RequestParam Integer baiHocId) {
        tienDoHocSinhService.unmarkProgress(hocSinhId, baiHocId);
        return ApiResponse.<String>builder()
                .data("Bỏ đánh dấu tiến độ thành công")
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        tienDoHocSinhService.delete(id);
        return ApiResponse.<String>builder()
                .data("Tiến độ đã được xóa thành công")
                .build();
    }
}
