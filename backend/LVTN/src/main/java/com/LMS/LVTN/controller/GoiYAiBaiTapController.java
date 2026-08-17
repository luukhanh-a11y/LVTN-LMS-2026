package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.GoiYAiBaiTapRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.GoiYAiBaiTapResponse;
import com.LMS.LVTN.service.GoiYAiBaiTapService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goi-y-ai-bai-tap")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GoiYAiBaiTapController {

    GoiYAiBaiTapService goiYAiBaiTapService;

    @PostMapping
    public ApiResponse<GoiYAiBaiTapResponse> generate(@RequestBody GoiYAiBaiTapRequest request) {
        List<String> suggestions = goiYAiBaiTapService.generateExerciseSuggestions(
                request.getGrade(), request.getSubjectId(), request.getTopicHint(), request.getLessonHint());
        return ApiResponse.<GoiYAiBaiTapResponse>builder()
                .data(new GoiYAiBaiTapResponse(suggestions))
                .build();
    }
}
