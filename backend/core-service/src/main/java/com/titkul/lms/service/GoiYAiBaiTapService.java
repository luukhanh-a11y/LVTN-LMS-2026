package com.titkul.lms.service;

import com.titkul.lms.entity.MonHoc;
import com.titkul.lms.repository.MonHocRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

// AI-03 (spec 6.3) — Panel AI gợi ý bài tập bổ sung trong màn hình soạn H5P.
// MVP: sinh gợi ý dạng text tự do (không tự động chèn khối H5P vào bài đang soạn,
// vì H5PEditor là web component không lộ API đọc/ghi nội dung đang gõ theo thời
// gian thực) — GV đọc gợi ý và tự soạn thủ công. Cùng cách gọi Gemma3 nhiều lần
// đơn giản như GoiYAiNhanXetService, tránh 1 lần gọi yêu cầu nhiều phương án.
@Slf4j
@Service
@RequiredArgsConstructor
public class GoiYAiBaiTapService {

    private final MonHocRepository subjectRepository;
    private final OllamaClient ollamaClient;

    private static final String CONTENT_PERSONA = """
            Bạn là trợ lý hỗ trợ giáo viên tiểu học tại Việt Nam soạn bài tập bổ sung.
            Chỉ trả lời đúng 1 đề bài bài tập ngắn gọn, rõ ràng, phù hợp học sinh tiểu học, không thêm lời chào, không thêm tiêu đề, không dùng markdown, không giải thích thêm.
            Bắt buộc: toàn bộ câu trả lời phải 100% tiếng Việt, tuyệt đối không chèn bất kỳ từ hay cụm từ tiếng Anh nào vào giữa câu.
            """;

    private static final List<String> EXERCISE_INSTRUCTIONS = List.of(
            "Đề xuất 1 bài tập bổ sung dạng câu hỏi ngắn, đơn giản, giúp học sinh ôn lại kiến thức cơ bản của chủ đề.",
            "Đề xuất 1 bài tập bổ sung dạng thực hành/vận dụng, giúp học sinh áp dụng kiến thức vào một tình huống thực tế liên quan chủ đề.",
            "Đề xuất 1 bài tập bổ sung có độ khó cao hơn một chút dành cho học sinh khá giỏi, mở rộng thêm từ chủ đề."
    );

    public List<String> generateExerciseSuggestions(Integer grade, Integer subjectId, String topicHint) {
        MonHoc subject = subjectId != null ? subjectRepository.findById(subjectId).orElse(null) : null;

        List<String> suggestions = new ArrayList<>();
        for (String instruction : EXERCISE_INSTRUCTIONS) {
            String prompt = buildPrompt(grade, subject, topicHint, instruction);
            ollamaClient.generate(CONTENT_PERSONA, prompt)
                    .map(String::strip)
                    .filter(s -> !s.isBlank())
                    .ifPresent(suggestions::add);
        }
        if (suggestions.isEmpty()) {
            log.info("Gemma không trả được gợi ý bài tập nào (Ollama có thể chưa bật)");
        }
        return suggestions;
    }

    private String buildPrompt(Integer grade, MonHoc subject, String topicHint, String instruction) {
        StringBuilder sb = new StringBuilder();
        sb.append(instruction).append("\n\n");
        sb.append("Bối cảnh:\n");
        if (grade != null) {
            sb.append("- Khối lớp: ").append(grade).append("\n");
        }
        if (subject != null) {
            sb.append("- Môn học: ").append(subject.getTenMon()).append("\n");
        }
        if (topicHint != null && !topicHint.isBlank()) {
            sb.append("- Chủ đề bài giảng đang soạn: ").append(topicHint.strip()).append("\n");
        }
        return sb.toString();
    }
}
