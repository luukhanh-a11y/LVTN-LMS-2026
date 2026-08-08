package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.GoiYAiNhanXetResponse;
import com.LMS.LVTN.service.GoiYAiNhanXetService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goi-y-ai-nhan-xet")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GoiYAiNhanXetController {

    GoiYAiNhanXetService goiYAiNhanXetService;

    @PostMapping("/bai-nop/{baiNopId}")
    public ApiResponse<GoiYAiNhanXetResponse> generate(@PathVariable Long baiNopId) {
        return ApiResponse.<GoiYAiNhanXetResponse>builder()
                .data(goiYAiNhanXetService.generateCommentSuggestions(baiNopId))
                .build();
    }

    @PostMapping("/{goiYId}/chon")
    public ApiResponse<String> choose(@PathVariable Long goiYId) {
        goiYAiNhanXetService.chooseSuggestion(goiYId);
        return ApiResponse.<String>builder()
                .data("Đã chọn gợi ý nhận xét")
                .build();
    }
}
