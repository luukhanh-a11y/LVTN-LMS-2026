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
import com.LMS.LVTN.service.NguoiDungExcelService;
import com.LMS.LVTN.service.NguoiDungService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/nguoi-dung")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NguoiDungController {

    NguoiDungService nguoiDungService;
    NguoiDungExcelService nguoiDungExcelService;

    @GetMapping
    public ApiResponse<Page<NguoiDungResponse>> getAllNguoiDung(
            @RequestHeader("Authorization") String token,
            @PageableDefault(size = 15) Pageable pageable) {
        return ApiResponse.<Page<NguoiDungResponse>>builder()
                .data(nguoiDungService.getAllNguoiDung(token, pageable))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<NguoiDungResponse>> searchNguoiDung(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Integer grade,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) Integer namHocId,
            @PageableDefault(size = 15) Pageable pageable) {
        return ApiResponse.<Page<NguoiDungResponse>>builder()
                .data(nguoiDungService.searchNguoiDung(token, role, keyword, status, classId, grade, subject, namHocId, pageable))
                .build();
    }

    @GetMapping("/trang-thai/{trangThai}")
    public ApiResponse<Page<NguoiDungResponse>> getNguoiDungByTrangThai(
            @RequestHeader("Authorization") String token, 
            @PathVariable com.LMS.LVTN.enums.TrangThaiNguoiDung trangThai,
            @PageableDefault(size = 15) Pageable pageable) {
        return ApiResponse.<Page<NguoiDungResponse>>builder()
                .data(nguoiDungService.getNguoiDungByTrangThai(token, trangThai, pageable))
                .build();
    }

    @GetMapping("/vai-tro/{vaiTro}")
    public ApiResponse<Page<NguoiDungResponse>> getNguoiDungByVaiTro(
            @RequestHeader("Authorization") String token, 
            @PathVariable com.LMS.LVTN.enums.VaiTro vaiTro,
            @PageableDefault(size = 15) Pageable pageable) {
        return ApiResponse.<Page<NguoiDungResponse>>builder()
                .data(nguoiDungService.getNguoiDungByVaiTro(token, vaiTro, pageable))
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

    @GetMapping("/export-template")
    public void exportTemplate(jakarta.servlet.http.HttpServletResponse response) {
        nguoiDungExcelService.exportTemplate(response);
    }

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<String> importUsersFromExcel(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.<String>builder()
                .data(nguoiDungExcelService.importUsersFromExcel(token, file))
                .build();
    }
}
