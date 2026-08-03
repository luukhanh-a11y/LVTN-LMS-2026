//package com.LMS.LVTN.controller;
//
//import com.LMS.LVTN.dto.request.BaoCaoAiBuoiSangRequest;
//import com.LMS.LVTN.dto.response.ApiResponse;
//import com.LMS.LVTN.dto.response.BaoCaoAiBuoiSangResponse;
//import com.LMS.LVTN.service.BaoCaoAiBuoiSangService;
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/bao-cao-ai-buoi-sang")
//@RequiredArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//public class BaoCaoAiBuoiSangController {
//
//    BaoCaoAiBuoiSangService baoCaoAiBuoiSangService;
//
//    @PostMapping
//    public ApiResponse<BaoCaoAiBuoiSangResponse> create(@RequestBody BaoCaoAiBuoiSangRequest request) {
//        return ApiResponse.<BaoCaoAiBuoiSangResponse>builder()
//                .data(baoCaoAiBuoiSangService.create(request))
//                .build();
//    }
//
//    @GetMapping
//    public ApiResponse<List<BaoCaoAiBuoiSangResponse>> getAll() {
//        return ApiResponse.<List<BaoCaoAiBuoiSangResponse>>builder()
//                .data(baoCaoAiBuoiSangService.getAll())
//                .build();
//    }
//
//    @GetMapping("/{id}")
//    public ApiResponse<BaoCaoAiBuoiSangResponse> getById(@PathVariable Long id) {
//        return ApiResponse.<BaoCaoAiBuoiSangResponse>builder()
//                .data(baoCaoAiBuoiSangService.getById(id))
//                .build();
//    }
//
//    @PutMapping("/{id}")
//    public ApiResponse<BaoCaoAiBuoiSangResponse> update(@PathVariable Long id, @RequestBody BaoCaoAiBuoiSangRequest request) {
//        return ApiResponse.<BaoCaoAiBuoiSangResponse>builder()
//                .data(baoCaoAiBuoiSangService.update(id, request))
//                .build();
//    }
//
//    @DeleteMapping("/{id}")
//    public ApiResponse<String> delete(@PathVariable Long id) {
//        baoCaoAiBuoiSangService.delete(id);
//        return ApiResponse.<String>builder()
//                .data("Báo cáo AI buổi sáng đã được xóa thành công")
//                .build();
//    }
//}
