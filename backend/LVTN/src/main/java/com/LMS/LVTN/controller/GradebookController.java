package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.GradebookResponse;
import com.LMS.LVTN.service.GradebookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gradebook")
@RequiredArgsConstructor
public class GradebookController {

    private final GradebookService gradebookService;

    @GetMapping("/classes")
    public ResponseEntity<ApiResponse<GradebookResponse>> getGradebook(
            @RequestParam("giaoVienId") Long giaoVienId,
            @RequestParam("classId") Long classId,
            @RequestParam("semesterId") Integer semesterId) {
        
        GradebookResponse response = gradebookService.getGradebook(giaoVienId, classId, semesterId);
        
        ApiResponse<GradebookResponse> apiResponse = ApiResponse.<GradebookResponse>builder()
                .code(200)
                .message("Lấy dữ liệu bảng điểm thành công")
                .data(response)
                .build();
                
        return ResponseEntity.ok(apiResponse);
    }
}
