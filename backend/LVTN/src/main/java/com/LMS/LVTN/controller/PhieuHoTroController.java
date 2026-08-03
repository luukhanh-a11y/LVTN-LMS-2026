package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.PhieuHoTroRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.PhieuHoTroResponse;
import com.LMS.LVTN.service.PhieuHoTroService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phieuhotro")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PhieuHoTroController {

    PhieuHoTroService phieuHoTroService;

    @PostMapping
    public ApiResponse<PhieuHoTroResponse> create(@RequestBody PhieuHoTroRequest request) {
        return ApiResponse.<PhieuHoTroResponse>builder()
                .data(phieuHoTroService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PhieuHoTroResponse>> getAll() {
        return ApiResponse.<List<PhieuHoTroResponse>>builder()
                .data(phieuHoTroService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<PhieuHoTroResponse> getById(@PathVariable Long id) {
        return ApiResponse.<PhieuHoTroResponse>builder()
                .data(phieuHoTroService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<PhieuHoTroResponse> update(@PathVariable Long id, @RequestBody PhieuHoTroRequest request) {
        return ApiResponse.<PhieuHoTroResponse>builder()
                .data(phieuHoTroService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        phieuHoTroService.delete(id);
        return ApiResponse.<String>builder()
                .data("Phiếu hỗ trợ đã được xóa thành công")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<List<PhieuHoTroResponse>> getAllByIdUserReceive(@PathVariable String id){
        return ApiResponse.<List<PhieuHoTroResponse>>builder()

                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<List<PhieuHoTroResponse>> getAllByIdUserSend(@PathVariable String id){
        return ApiResponse.<List<PhieuHoTroResponse>>builder()

                .build();
    }
}
