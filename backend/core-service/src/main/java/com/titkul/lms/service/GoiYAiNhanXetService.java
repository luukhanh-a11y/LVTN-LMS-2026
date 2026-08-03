package com.titkul.lms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titkul.lms.entity.GoiYAiNhanXet;
import com.titkul.lms.entity.TrangThaiGoiY;
import com.titkul.lms.entity.BaiNop;
import com.titkul.lms.repository.GoiYAiNhanXetRepository;
import com.titkul.lms.repository.BaiNopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// Gợi ý nhận xét chấm bài (QT10.3) — gọi Gemma3 thật qua Ollama local (3 lời gọi
// đơn giản, mỗi lần 1 phương án) để tránh hiện tượng model lú khi bị yêu cầu sinh
// nhiều phương án cùng lúc. Nếu Ollama không phản hồi (chưa bật, máy yếu...), tự
// động rơi về rule-based dựa trên dữ liệu bài nộp thật để không chặn giáo viên.
@Slf4j
@Service
@RequiredArgsConstructor
public class GoiYAiNhanXetService {

    private final BaiNopRepository submissionRepository;
    private final GoiYAiNhanXetRepository suggestionRepository;
    private final ObjectMapper objectMapper;
    private final OllamaClient ollamaClient;

    private static final List<String> SUGGESTION_INSTRUCTIONS = List.of(
            "Viết 1 nhận xét ngắn (2-3 câu) tập trung khen ngợi điểm tốt trong bài làm của học sinh và khích lệ con tiếp tục phát huy.",
            "Viết 1 nhận xét ngắn (2-3 câu) nêu một điểm học sinh cần cải thiện, kèm gợi ý cụ thể để làm tốt hơn, giọng nhẹ nhàng xây dựng.",
            "Viết 1 nhận xét ngắn (2-3 câu) kết hợp khen một điểm tốt và một gợi ý nhỏ để học sinh tiến bộ hơn."
    );

    @Transactional
    public Map<String, Object> generateCommentSuggestions(Long submissionId) {
        BaiNop submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp"));

        String text = submission.getNoiDungText() != null ? submission.getNoiDungText().trim() : "";
        int length = text.length();
        boolean isLate = Boolean.TRUE.equals(submission.getLaNopTre());
        BigDecimal score = submission.getDiemTuDong();

        List<String> suggestions = generateWithGemma(text, isLate, score);
        if (suggestions.size() < 2) {
            log.info("Gemma không trả đủ gợi ý (nhận {}), dùng rule-based dự phòng", suggestions.size());
            suggestions = buildSuggestions(length, isLate, score);
        }

        Map<String, Object> input = new LinkedHashMap<>();
        input.put("textLength", length);
        input.put("isLate", isLate);
        input.put("autoScore", score);

        GoiYAiNhanXet entity = new GoiYAiNhanXet();
        entity.setBaiNop(submission);
        entity.setTrangThai(TrangThaiGoiY.NHAP);
        try {
            entity.setDuLieuDauVao(objectMapper.writeValueAsString(input));
            entity.setKetQuaGoiY(objectMapper.writeValueAsString(suggestions));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi tạo gợi ý nhận xét: " + e.getMessage());
        }
        GoiYAiNhanXet saved = suggestionRepository.save(entity);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", saved.getGoiYId());
        result.put("suggestions", suggestions);
        return result;
    }

    @Transactional
    public void chooseSuggestion(Long suggestionId) {
        GoiYAiNhanXet entity = suggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy gợi ý"));
        entity.setTrangThai(TrangThaiGoiY.DA_CHON);
        suggestionRepository.save(entity);
    }

    private List<String> generateWithGemma(String text, boolean isLate, BigDecimal score) {
        List<String> results = new ArrayList<>();
        for (String instruction : SUGGESTION_INSTRUCTIONS) {
            String prompt = buildGemmaPrompt(text, isLate, score, instruction);
            ollamaClient.generate(OllamaClient.TEACHER_PERSONA, prompt)
                    .map(this::cleanGemmaOutput)
                    .filter(s -> !s.isBlank())
                    .ifPresent(results::add);
        }
        return results;
    }

    private String buildGemmaPrompt(String text, boolean isLate, BigDecimal score, String instruction) {
        StringBuilder sb = new StringBuilder();
        sb.append(instruction).append("\n\n");
        sb.append("Dữ liệu bài làm của học sinh:\n");
        if (text.isBlank()) {
            sb.append("- Không có nội dung văn bản (có thể là bài H5P hoặc file đính kèm).\n");
        } else {
            String excerpt = text.length() > 600 ? text.substring(0, 600) + "..." : text;
            sb.append("- Nội dung bài làm: \"").append(excerpt).append("\"\n");
        }
        sb.append("- Nộp trễ hạn: ").append(isLate ? "Có" : "Không").append("\n");
        if (score != null) {
            sb.append("- Điểm tự động (nếu có): ").append(score).append("/10\n");
        }
        return sb.toString();
    }

    // Gemma đôi khi bọc câu trả lời trong dấu ngoặc kép hoặc thêm tiền tố kiểu
    // "Nhận xét:" dù đã cấm trong system prompt — dọn lại cho sạch trước khi hiển thị.
    private String cleanGemmaOutput(String raw) {
        String cleaned = raw.strip();
        if (cleaned.startsWith("\"") && cleaned.endsWith("\"") && cleaned.length() > 1) {
            cleaned = cleaned.substring(1, cleaned.length() - 1).strip();
        }
        cleaned = cleaned.replaceFirst("(?i)^(nhận xét|comment)\\s*:\\s*", "");
        return cleaned;
    }

    private List<String> buildSuggestions(int length, boolean isLate, BigDecimal score) {
        List<String> list = new ArrayList<>();
        if (length > 0 && length < 60) {
            list.add("Bài làm của con còn khá ngắn, chưa đủ ý. Con hãy viết thêm chi tiết miêu tả để bài văn sinh động hơn nhé.");
            list.add("Con đã nắm được ý chính nhưng cần triển khai thêm câu văn để bài làm đầy đủ hơn.");
        } else if (length >= 60 && length < 150) {
            list.add("Bài làm của con khá tốt, đủ ý chính. Con có thể thêm 1-2 câu miêu tả chi tiết để bài văn sinh động hơn nhé!");
            list.add("Con đã hoàn thành yêu cầu cơ bản của bài tập. Cố gắng phát huy con nhé!");
        } else {
            list.add("Bài làm của con rất tốt, miêu tả sinh động và giàu cảm xúc. Cô/thầy rất hài lòng!");
            list.add("Con viết bài rất chi tiết và đầy đủ ý. Tiếp tục phát huy nhé!");
        }

        if (isLate) {
            list.add("Bài làm có nội dung tốt, tuy nhiên con đã nộp trễ hạn. Lần sau con cố gắng nộp đúng hạn nhé!");
        } else if (score != null) {
            list.add("Con đạt điểm " + score + " cho bài tập này, rất đáng khen ngợi!");
        } else {
            list.add("Cảm ơn con đã hoàn thành bài tập đúng hạn. Cô/thầy đánh giá cao sự chăm chỉ của con!");
        }
        return list;
    }
}
