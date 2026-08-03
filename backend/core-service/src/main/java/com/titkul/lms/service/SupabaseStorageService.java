package com.titkul.lms.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Optional;

// Upload file thật lên Supabase Storage (bucket public) qua REST API — thay thế
// lưu đĩa cục bộ. Nếu chưa cấu hình supabase.url/service-role-key (hoặc lỗi mạng),
// trả về Optional.empty() để nơi gọi tự fallback lưu đĩa, không chặn người dùng.
@Slf4j
@Service
public class SupabaseStorageService {

    @Value("${supabase.url:}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key:}")
    private String serviceRoleKey;

    @Value("${supabase.bucket:titkul-media}")
    private String bucket;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public boolean isConfigured() {
        return supabaseUrl != null && !supabaseUrl.isBlank()
                && serviceRoleKey != null && !serviceRoleKey.isBlank();
    }

    public Optional<String> upload(byte[] content, String objectPath, String contentType) {
        if (!isConfigured()) {
            return Optional.empty();
        }
        try {
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + objectPath;
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl))
                    .timeout(Duration.ofSeconds(60))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apikey", serviceRoleKey)
                    .header("Content-Type", contentType != null && !contentType.isBlank() ? contentType : "application/octet-stream")
                    .header("x-upsert", "true")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(content))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200 && response.statusCode() != 201) {
                log.warn("Supabase Storage trả về status {}: {}", response.statusCode(), response.body());
                return Optional.empty();
            }
            return Optional.of(supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + objectPath);
        } catch (Exception e) {
            log.warn("Không upload được lên Supabase Storage (fallback lưu đĩa cục bộ): {}", e.getMessage());
            return Optional.empty();
        }
    }
}
