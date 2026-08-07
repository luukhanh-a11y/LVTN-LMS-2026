package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.DiemTrungBinhMonResponse;
import com.LMS.LVTN.service.ThongKeDiemService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/thong-ke-diem")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ThongKeDiemController {

    ThongKeDiemService thongKeDiemService;

    @GetMapping("/hoc-sinh/{hocSinhId}/hoc-ky/{hocKyId}")
    public ApiResponse<List<DiemTrungBinhMonResponse>> getDanhSachDiemTrungBinhMon(
            @PathVariable Long hocSinhId,
            @PathVariable Integer hocKyId) {
        return ApiResponse.<List<DiemTrungBinhMonResponse>>builder()
                .data(thongKeDiemService.getDanhSachDiemTrungBinhMon(hocSinhId, hocKyId))
                .build();
    }

    @GetMapping("/hoc-sinh/{hocSinhId}/hoc-ky/{hocKyId}/mon-hoc/{monHocId}")
    public ApiResponse<DiemTrungBinhMonResponse> getDiemTrungBinhChiTietMon(
            @PathVariable Long hocSinhId,
            @PathVariable Integer hocKyId,
            @PathVariable Short monHocId) {
        return ApiResponse.<DiemTrungBinhMonResponse>builder()
                .data(thongKeDiemService.getDiemTrungBinhChiTietMon(hocSinhId, hocKyId, monHocId))
                .build();
    }
}
