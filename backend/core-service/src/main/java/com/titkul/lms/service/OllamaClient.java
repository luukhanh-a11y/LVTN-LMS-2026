package com.titkul.lms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

// Gọi model Gemma3 thật đang chạy local qua Ollama (http://localhost:11434).
// Không throw exception ra ngoài — nếu Ollama chưa bật/chưa cài model, service gọi
// nơi này phải tự fallback (rule-based) thay vì làm sập request của giáo viên.
@Slf4j
@Service
@RequiredArgsConstructor
public class OllamaClient {

    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";
    public static final String DEFAULT_MODEL = "gemma3:4b";

    // Văn phong dùng chung cho mọi tính năng AI trong hệ thống: giáo viên tiểu học
    // Việt Nam, khích lệ, không chê nặng nề, trả lời đúng trọng tâm không lan man.
    // Câu cấm chèn tiếng Anh được nói rõ 2 lần (cuối văn bản model hay "nghe" kỹ
    // hơn) vì gemma3:4b (bản 4B tham số, quantize) thỉnh thoảng dính từ tiếng Anh
    // giữa câu tiếng Việt dù đã dặn 1 lần — đây là hạn chế của model nhỏ, không có
    // cách "huấn luyện lại" thực sự trên phần cứng hiện tại, chỉ có thể giảm tần
    // suất bằng prompt chặt hơn + nhiệt độ thấp hơn + tự động thử lại (xem generate()).
    public static final String TEACHER_PERSONA = """
            Bạn là trợ lý hỗ trợ giáo viên tiểu học tại Việt Nam.
            Văn phong bắt buộc: gọi học sinh là "con", xưng "cô/thầy", nhẹ nhàng, khích lệ, mang tính xây dựng, không chê trách nặng nề.
            Chỉ trả lời đúng nội dung được yêu cầu bằng tiếng Việt, ngắn gọn, không thêm lời chào, không thêm tiêu đề, không dùng markdown, không giải thích thêm ngoài nội dung được yêu cầu.
            Bắt buộc: toàn bộ câu trả lời phải 100% tiếng Việt, tuyệt đối không chèn bất kỳ từ hay cụm từ tiếng Anh nào vào giữa câu.
            """;

    // Bắt lỗi model dính chữ ("điềuLovely"): 1 chữ cái thường (kể cả có dấu) đứng
    // ngay sát 1 chữ hoa không qua khoảng trắng — không bao giờ xảy ra trong tiếng
    // Việt viết đúng, nên đây là tín hiệu đáng tin để phát hiện lỗi và thử lại.
    private static final Pattern GLUED_WORD_PATTERN = Pattern.compile("\\p{Ll}\\p{Lu}");

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    public Optional<String> generate(String systemPrompt, String userPrompt) {
        return generate(DEFAULT_MODEL, systemPrompt, userPrompt);
    }

    public Optional<String> generate(String model, String systemPrompt, String userPrompt) {
        return generate(model, systemPrompt, userPrompt, true);
    }

    private Optional<String> generate(String model, String systemPrompt, String userPrompt, boolean allowRetryOnGlitch) {
        try {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", model);
            body.put("system", systemPrompt);
            body.put("prompt", userPrompt);
            body.put("stream", false);
            body.put("keep_alive", "30m");
            // Nhiệt độ thấp hơn (0.4) giúp model bám sát yêu cầu hơn, giảm tần suất
            // lú/chèn tiếng Anh so với 0.7 — đánh đổi là câu trả lời ít đa dạng hơn
            // 1 chút, chấp nhận được vì đây là nhận xét/báo cáo cần chính xác hơn sáng tạo.
            body.put("options", Map.of("temperature", 0.4));

            String json = objectMapper.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OLLAMA_URL))
                    .timeout(Duration.ofSeconds(60))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() != 200) {
                log.warn("Ollama trả về status {}: {}", response.statusCode(), response.body());
                return Optional.empty();
            }

            JsonNode node = objectMapper.readTree(response.body());
            String text = node.path("response").asText(null);
            if (text == null || text.isBlank()) {
                return Optional.empty();
            }
            String result = text.strip();

            if (allowRetryOnGlitch && GLUED_WORD_PATTERN.matcher(result).find()) {
                log.info("Phát hiện khả năng dính chữ Việt-Anh trong câu trả lời, thử gọi lại 1 lần...");
                Optional<String> retried = generate(model, systemPrompt, userPrompt, false);
                if (retried.isPresent() && !GLUED_WORD_PATTERN.matcher(retried.get()).find()) {
                    return retried;
                }
                // Lần thử lại vẫn lỗi hoặc thất bại — trả kết quả ban đầu thay vì
                // chặn hẳn tính năng, vì lỗi này thường chỉ 1 từ, không tệ tới mức
                // phải chuyển sang rule-based.
            }
            return Optional.of(result);
        } catch (Exception e) {
            log.warn("Không gọi được Ollama (model có thể chưa bật): {}", e.getMessage());
            return Optional.empty();
        }
    }
}
