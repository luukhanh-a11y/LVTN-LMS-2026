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
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @PostMapping
    public ApiResponse<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ApiResponse.<String>builder()
                    .code(400)
                    .message("File is empty")
                    .build();
        }

        try {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
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
