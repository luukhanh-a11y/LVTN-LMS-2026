package com.titkul.lms.controller;

import com.titkul.lms.repository.HocKyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class HocKyController {

    private final HocKyRepository semesterRepository;

    @GetMapping("/api/v1/semesters")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> list() {
        List<Map<String, Object>> semesters = semesterRepository.findAll().stream()
                .map(s -> {
                    String yearName = s.getNamHoc() != null ? s.getNamHoc().getTenNamHoc() : "";
                    return Map.<String, Object>of(
                            "id", s.getHocKyId(),
                            "label", "Học kỳ " + s.getSoHocKy() + " (" + yearName + ")"
                    );
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(semesters);
    }
}
