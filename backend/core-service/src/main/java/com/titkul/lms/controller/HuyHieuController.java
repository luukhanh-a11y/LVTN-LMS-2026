package com.titkul.lms.controller;

import com.titkul.lms.entity.HuyHieu;
import com.titkul.lms.repository.HuyHieuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HuyHieuController {

    private final HuyHieuRepository huyHieuRepository;

    @GetMapping("/api/v1/badges")
    public ResponseEntity<List<HuyHieu>> list() {
        return ResponseEntity.ok(huyHieuRepository.findAll());
    }
}
