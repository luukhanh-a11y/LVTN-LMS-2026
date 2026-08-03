package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.KetQuaCuoiNamRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.KetQuaCuoiNamResponse;
import com.LMS.LVTN.service.KetQuaCuoiNamService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ket-qua-cuoi-nam")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KetQuaCuoiNamController {

    KetQuaCuoiNamService ketQuaCuoiNamService;

    @PostMapping
    public ApiResponse<KetQuaCuoiNamResponse> create(@RequestBody KetQuaCuoiNamRequest request) {
        return ApiResponse.<KetQuaCuoiNamResponse>builder()
                .data(ketQuaCuoiNamService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<KetQuaCuoiNamResponse>> getAll() {
        return ApiResponse.<List<KetQuaCuoiNamResponse>>builder()
                .data(ketQuaCuoiNamService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<KetQuaCuoiNamResponse> getById(@PathVariable Long id) {
        return ApiResponse.<KetQuaCuoiNamResponse>builder()
                .data(ketQuaCuoiNamService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<KetQuaCuoiNamResponse> update(@PathVariable Long id, @RequestBody KetQuaCuoiNamRequest request) {
        return ApiResponse.<KetQuaCuoiNamResponse>builder()
                .data(ketQuaCuoiNamService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        ketQuaCuoiNamService.delete(id);
        return ApiResponse.<String>builder()
                .data("Kết quả cuối năm đã được xóa thành công")
                .build();
    }
}
