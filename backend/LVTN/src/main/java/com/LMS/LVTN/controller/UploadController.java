package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.response.ApiResponse;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    // Whitelist đuôi file được phép — chặn .html/.svg/.js/.exe... vì file được
    // lưu và serve lại nguyên bản qua URL tĩnh /uploads/**, không tự thực thi được.
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "webp",
            "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt",
            "mp3", "mp4", "wav"
    );

    @PostMapping
    public ApiResponse<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ApiResponse.<String>builder()
                    .code(400)
                    .message("File is empty")
                    .build();
        }

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";
        int dotIdx = fileName.lastIndexOf('.');
        if (dotIdx >= 0 && dotIdx < fileName.length() - 1) {
            extension = fileName.substring(dotIdx + 1).toLowerCase(Locale.ROOT);
        }
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            return ApiResponse.<String>builder()
                    .code(400)
                    .message("Loại file không được hỗ trợ: ." + extension)
                    .build();
        }

        try {
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path uploadPath = Paths.get("uploads");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            try (InputStream inputStream = file.getInputStream()) {
                Path filePath = uploadPath.resolve(uniqueFileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            String fileUrl = "/uploads/" + uniqueFileName;
            return ApiResponse.<String>builder()
                    .data(fileUrl)
                    .build();

        } catch (IOException e) {
            return ApiResponse.<String>builder()
                    .code(500)
                    .message("Could not save the file: " + e.getMessage())
                    .build();
        }
    }
}
