package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.HoSoPhuHuynhRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.HoSoPhuHuynhResponse;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.service.AuthenticationService;
import com.LMS.LVTN.service.HoSoPhuHuynhService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/hoso-phuhuynh")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HoSoPhuHuynhController {

    HoSoPhuHuynhService hoSoPhuHuynhService;

    @GetMapping
    public ApiResponse<List<HoSoPhuHuynhResponse>> getAll() {
        return ApiResponse.<List<HoSoPhuHuynhResponse>>builder()
                .data(hoSoPhuHuynhService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<HoSoPhuHuynhResponse> getById(@PathVariable Long id) {
        return ApiResponse.<HoSoPhuHuynhResponse>builder()
                .data(hoSoPhuHuynhService.getById(id))
                .build();
    }

    @GetMapping("/my-profile")
    public ApiResponse<HoSoPhuHuynhResponse> getMyProfile(@RequestHeader("Authorization") String token) {
        return ApiResponse.<HoSoPhuHuynhResponse>builder()
                .data(hoSoPhuHuynhService.getMyProfile(token))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<HoSoPhuHuynhResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody HoSoPhuHuynhRequest request) {
        return ApiResponse.<HoSoPhuHuynhResponse>builder()
                .data(hoSoPhuHuynhService.update(id, request))
                .build();
    }

    @PutMapping("/my-profile")
    public ApiResponse<HoSoPhuHuynhResponse> updateMyProfile(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody HoSoPhuHuynhRequest request) {
        return ApiResponse.<HoSoPhuHuynhResponse>builder()
                .data(hoSoPhuHuynhService.updateMyProfile(token, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        hoSoPhuHuynhService.delete(id);
        return ApiResponse.<String>builder()
                .data("Hồ sơ phụ huynh đã được xóa thành công")
                .build();
    }
}
