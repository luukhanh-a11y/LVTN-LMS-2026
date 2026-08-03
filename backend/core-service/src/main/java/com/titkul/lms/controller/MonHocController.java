package com.titkul.lms.controller;

import com.titkul.lms.entity.MonHoc;
import com.titkul.lms.repository.MonHocRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class MonHocController {

    private final MonHocRepository subjectRepository;

    @GetMapping("/api/v1/subjects")
    public ResponseEntity<List<MonHoc>> list() {
        List<MonHoc> subjects = subjectRepository.findAll().stream()
                .filter(s -> s.getTrangThai() == com.titkul.lms.entity.TrangThaiMonHoc.ACTIVE)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subjects);
    }
}
