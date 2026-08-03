package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.HoSoHocSinhRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.HoSoHocSinhResponse;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.service.AuthenticationService;
import com.LMS.LVTN.service.HoSoHocSinhService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/hoso-hocsinh")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HoSoHocSinhController {

    HoSoHocSinhService hoSoHocSinhService;

    @PostMapping
    public ApiResponse<HoSoHocSinhResponse> create(@RequestBody HoSoHocSinhRequest request) {
        return ApiResponse.<HoSoHocSinhResponse>builder()
                .data(hoSoHocSinhService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<HoSoHocSinhResponse>> getAll() {
        return ApiResponse.<List<HoSoHocSinhResponse>>builder()
                .data(hoSoHocSinhService.getAll())
                .build();
    }

    @GetMapping("/ma/{maHocSinh}")
    public ApiResponse<HoSoHocSinhResponse> getByMaHocSinh(@PathVariable String maHocSinh) {
        return ApiResponse.<HoSoHocSinhResponse>builder()
                .data(hoSoHocSinhService.getByMaHocSinh(maHocSinh))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<HoSoHocSinhResponse> getById(@PathVariable Long id) {
        return ApiResponse.<HoSoHocSinhResponse>builder()
                .data(hoSoHocSinhService.getById(id))
                .build();
    }

    @GetMapping("/my-profile")
    public ApiResponse<HoSoHocSinhResponse> getMyProfile(@RequestHeader("Authorization") String token) {
        return ApiResponse.<HoSoHocSinhResponse>builder()
                .data(hoSoHocSinhService.getMyProfile(token))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<HoSoHocSinhResponse> update(
            @PathVariable Long id, 
            @RequestBody HoSoHocSinhRequest request) {
        return ApiResponse.<HoSoHocSinhResponse>builder()
                .data(hoSoHocSinhService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        hoSoHocSinhService.delete(id);
        return ApiResponse.<String>builder()
                .data("Hồ sơ học sinh đã được xóa thành công")
                .build();
    }
}
