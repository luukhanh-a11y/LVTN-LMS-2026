package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.HoSoGiaoVienRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.HoSoGiaoVienResponse;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.service.AuthenticationService;
import com.LMS.LVTN.service.HoSoGiaoVienService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/hoso-giaovien")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HoSoGiaoVienController {

    HoSoGiaoVienService hoSoGiaoVienService;

    @PostMapping
    public ApiResponse<HoSoGiaoVienResponse> create(@RequestBody HoSoGiaoVienRequest request) {
        return ApiResponse.<HoSoGiaoVienResponse>builder()
                .data(hoSoGiaoVienService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<HoSoGiaoVienResponse>> getAll() {
        return ApiResponse.<List<HoSoGiaoVienResponse>>builder()
                .data(hoSoGiaoVienService.getAll())
                .build();
    }

    @GetMapping("/ma/{maGiaoVien}")
    public ApiResponse<HoSoGiaoVienResponse> getByMaGiaoVien(@PathVariable String maGiaoVien) {
        return ApiResponse.<HoSoGiaoVienResponse>builder()
                .data(hoSoGiaoVienService.findByMaGiaoVien(maGiaoVien))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<HoSoGiaoVienResponse> getById(@PathVariable Long id) {
        return ApiResponse.<HoSoGiaoVienResponse>builder()
                .data(hoSoGiaoVienService.getById(id))
                .build();
    }

    @GetMapping("/my-profile")
    public ApiResponse<HoSoGiaoVienResponse> getMyProfile(@RequestHeader("Authorization") String token) {
        return ApiResponse.<HoSoGiaoVienResponse>builder()
                .data(hoSoGiaoVienService.getMyProfile(token))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<HoSoGiaoVienResponse> update(
            @PathVariable Long id, 
            @RequestBody HoSoGiaoVienRequest request) {
        return ApiResponse.<HoSoGiaoVienResponse>builder()
                .data(hoSoGiaoVienService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        hoSoGiaoVienService.delete(id);
        return ApiResponse.<String>builder()
                .data("Hồ sơ giáo viên đã được xóa thành công")
                .build();
    }
}
