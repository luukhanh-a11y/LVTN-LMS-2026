package com.titkul.lms.controller;

import com.titkul.lms.dto.DanhGiaRequest;
import com.titkul.lms.dto.BaiNopDetailResponse;
import com.titkul.lms.entity.DanhGiaBaiLam;
import com.titkul.lms.entity.BaiNop;
import com.titkul.lms.service.GoiYAiNhanXetService;
import com.titkul.lms.service.BaiNopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BaiNopController {

    private final BaiNopService submissionService;
    private final GoiYAiNhanXetService aiSuggestionService;

    @PostMapping("/submissions")
    public ResponseEntity<BaiNop> submitAssignment(@RequestBody BaiNop submission) {
        return ResponseEntity.ok(submissionService.submitAssignment(submission));
    }

    @GetMapping("/assignments/{id}/submissions")
    public ResponseEntity<List<BaiNop>> getSubmissions(@PathVariable Long id) {
        List<BaiNop> submissions = submissionService.getSubmissionsByAssignment(id);
        List<BaiNop> filtered = submissions.stream()
                .filter(s -> s.getTrangThai() != com.titkul.lms.entity.TrangThaiBaiNop.LUU_NHAP)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<BaiNopDetailResponse> getSubmissionDetail(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmissionDetail(id));
    }

    @PostMapping("/submissions/{id}/evaluate")
    public ResponseEntity<DanhGiaBaiLam> evaluateSubmission(
            @PathVariable Long id,
            @RequestBody DanhGiaRequest dto) {
        return ResponseEntity.ok(submissionService.evaluateSubmission(id, dto));
    }

    @PostMapping("/submissions/{id}/comment-suggestions")
    public ResponseEntity<?> generateCommentSuggestions(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(aiSuggestionService.generateCommentSuggestions(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/submissions/comment-suggestions/{suggestionId}/choose")
    public ResponseEntity<?> chooseCommentSuggestion(@PathVariable Long suggestionId) {
        try {
            aiSuggestionService.chooseSuggestion(suggestionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
