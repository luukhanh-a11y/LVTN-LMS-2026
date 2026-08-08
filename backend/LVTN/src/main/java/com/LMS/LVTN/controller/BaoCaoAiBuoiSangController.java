package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.BaoCaoAiBuoiSangResponse;
import com.LMS.LVTN.service.BaoCaoAiBuoiSangService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bao-cao-ai-buoi-sang")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BaoCaoAiBuoiSangController {

    BaoCaoAiBuoiSangService baoCaoAiBuoiSangService;

    @GetMapping
    public ApiResponse<BaoCaoAiBuoiSangResponse> getOrGenerate(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) Long lopHocId) {
        return ApiResponse.<BaoCaoAiBuoiSangResponse>builder()
                .data(baoCaoAiBuoiSangService.getOrGenerate(token, lopHocId))
                .build();
    }
}
