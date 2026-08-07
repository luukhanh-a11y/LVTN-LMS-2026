package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.response.AdminDashboardResponse;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.service.AdminService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {

    AdminService adminService;

    @GetMapping("/dashboard")
    public ApiResponse<AdminDashboardResponse> getDashboardStats() {
        return ApiResponse.<AdminDashboardResponse>builder()
                .data(adminService.getDashboardStats())
                .build();
    }
}
