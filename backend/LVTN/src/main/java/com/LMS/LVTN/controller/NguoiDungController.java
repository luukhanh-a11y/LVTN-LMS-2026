package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.NguoiDungCreateRequest;
import com.LMS.LVTN.dto.request.NguoiDungRequest;
import com.LMS.LVTN.dto.request.UpDateRoleUserRequest;
import com.LMS.LVTN.dto.request.UpdateTrangThaiUser;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.NguoiDungResponse;
import com.LMS.LVTN.enums.VaiTro;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.service.AuthenticationService;
import com.LMS.LVTN.service.NguoiDungService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/nguoi-dung")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NguoiDungController {

    NguoiDungService nguoiDungService;

    @GetMapping
    public ApiResponse<List<NguoiDungResponse>> getAllNguoiDung(@RequestHeader("Authorization") String token) {
        return ApiResponse.<List<NguoiDungResponse>>builder()
                .data(nguoiDungService.getAllNguoiDung(token))
                .build();
    }

    @GetMapping("/trang-thai/{trangThai}")
    public ApiResponse<List<NguoiDungResponse>> getNguoiDungByTrangThai(
            @RequestHeader("Authorization") String token, 
            @PathVariable com.LMS.LVTN.enums.TrangThaiNguoiDung trangThai) {
        return ApiResponse.<List<NguoiDungResponse>>builder()
                .data(nguoiDungService.getNguoiDungByTrangThai(token, trangThai))
                .build();
    }

    @GetMapping("/vai-tro/{vaiTro}")
    public ApiResponse<List<NguoiDungResponse>> getNguoiDungByVaiTro(
            @RequestHeader("Authorization") String token, 
            @PathVariable com.LMS.LVTN.enums.VaiTro vaiTro) {
        return ApiResponse.<List<NguoiDungResponse>>builder()
                .data(nguoiDungService.getNguoiDungByVaiTro(token, vaiTro))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<NguoiDungResponse> getNguoiDungById(@PathVariable String id) {
        return ApiResponse.<NguoiDungResponse>builder()
                .data(nguoiDungService.getNguoiDungById(id))
                .build();
    }

    @GetMapping("/my-info")
    public ApiResponse<NguoiDungResponse> getMyInfo(@RequestHeader("Authorization") String token) {
        return ApiResponse.<NguoiDungResponse>builder()
                .data(nguoiDungService.getMyInfo(token))
                .build();
    }

    @PostMapping
    public ApiResponse<NguoiDungResponse> createNguoiDung(@RequestBody NguoiDungCreateRequest request) {
        return ApiResponse.<NguoiDungResponse>builder()
                .data(nguoiDungService.createNguoiDung(request))
                .build();
    }

    @PutMapping("/{id}/role")
    public ApiResponse<NguoiDungResponse> updateRole(
            @RequestHeader("Authorization") String token,
            @PathVariable String id, 
            @RequestBody UpDateRoleUserRequest request) {
        return ApiResponse.<NguoiDungResponse>builder()
                .data(nguoiDungService.updateRole(token, id, request))
                .build();
    }

    @PutMapping("/{id}/trang-thai")
    public ApiResponse<NguoiDungResponse> updateTrangThai(
            @RequestHeader("Authorization") String token,
            @PathVariable String id, 
            @RequestBody UpdateTrangThaiUser request) {
        return ApiResponse.<NguoiDungResponse>builder()
                .data(nguoiDungService.updateTrangThai(token, id, request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<NguoiDungResponse> updateThongTinNguoiDung(@PathVariable String id, @RequestBody NguoiDungRequest request) {
        return ApiResponse.<NguoiDungResponse>builder()
                .data(nguoiDungService.updateThongTinNguoiDung(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteNguoiDung(@PathVariable String id) {
        nguoiDungService.deleteNguoiDung(id);
        return ApiResponse.<String>builder()
                .data("Người dùng đã được xóa thành công")
                .build();
    }
}
