//package com.LMS.LVTN.controller;
//
//import com.LMS.LVTN.dto.request.GoiYAiNhanXetRequest;
//import com.LMS.LVTN.dto.response.ApiResponse;
//import com.LMS.LVTN.dto.response.GoiYAiNhanXetResponse;
//import com.LMS.LVTN.service.GoiYAiNhanXetService;
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/goi-y-ai-nhan-xet")
//@RequiredArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//public class GoiYAiNhanXetController {
//
//    GoiYAiNhanXetService goiYAiNhanXetService;
//
//    @PostMapping
//    public ApiResponse<GoiYAiNhanXetResponse> create(@RequestBody GoiYAiNhanXetRequest request) {
//        return ApiResponse.<GoiYAiNhanXetResponse>builder()
//                .data(goiYAiNhanXetService.create(request))
//                .build();
//    }
//
//    @GetMapping
//    public ApiResponse<List<GoiYAiNhanXetResponse>> getAll() {
//        return ApiResponse.<List<GoiYAiNhanXetResponse>>builder()
//                .data(goiYAiNhanXetService.getAll())
//                .build();
//    }
//
//    @GetMapping("/{id}")
//    public ApiResponse<GoiYAiNhanXetResponse> getById(@PathVariable Long id) {
//        return ApiResponse.<GoiYAiNhanXetResponse>builder()
//                .data(goiYAiNhanXetService.getById(id))
//                .build();
//    }
//
//    @PutMapping("/{id}")
//    public ApiResponse<GoiYAiNhanXetResponse> update(@PathVariable Long id, @RequestBody GoiYAiNhanXetRequest request) {
//        return ApiResponse.<GoiYAiNhanXetResponse>builder()
//                .data(goiYAiNhanXetService.update(id, request))
//                .build();
//    }
//
//    @DeleteMapping("/{id}")
//    public ApiResponse<String> delete(@PathVariable Long id) {
//        goiYAiNhanXetService.delete(id);
//        return ApiResponse.<String>builder()
//                .data("Gợi ý AI nhận xét đã được xóa thành công")
//                .build();
//    }
//}
