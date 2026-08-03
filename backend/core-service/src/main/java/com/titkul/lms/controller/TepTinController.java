package com.titkul.lms.controller;

import com.titkul.lms.service.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

// Lưu file đính kèm (bài tự luận, v.v.) lên Supabase Storage thật. Nếu Supabase
// chưa cấu hình hoặc lỗi mạng, tự fallback lưu đĩa cục bộ của core-service để
// không chặn người dùng — contract API (trả về "url") không đổi ở cả 2 trường hợp.
@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
public class TepTinController {

    private final SupabaseStorageService supabaseStorageService;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Value("${app.base-url}")
    private String baseUrl;

    private static final long MAX_FILE_SIZE = 20L * 1024 * 1024;

    @PostMapping
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File rỗng, vui lòng chọn lại."));
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(Map.of("message", "File vượt quá 20MB."));
        }

        String original = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        // Chỉ lấy phần đuôi file (sau dấu chấm cuối) để ghép vào tên UUID tự sinh —
        // loại bỏ hoàn toàn khả năng path traversal từ tên file gốc do người dùng đặt.
        String ext = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
        String storedName = UUID.randomUUID() + ext;

        try {
            byte[] bytes = file.getBytes();

            Optional<String> cloudUrl = supabaseStorageService.upload(bytes, storedName, file.getContentType());
            if (cloudUrl.isPresent()) {
                return ResponseEntity.ok(Map.of("url", cloudUrl.get(), "fileName", original));
            }

            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            Path target = dir.resolve(storedName);
            Files.write(target, bytes);

            String url = baseUrl + "/uploads/" + storedName;
            return ResponseEntity.ok(Map.of("url", url, "fileName", original));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lưu file thất bại: " + e.getMessage()));
        }
    }
}
