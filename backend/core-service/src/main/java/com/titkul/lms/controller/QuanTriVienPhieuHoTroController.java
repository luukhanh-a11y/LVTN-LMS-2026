package com.titkul.lms.controller;

import com.titkul.lms.dto.XuLyPhieuHoTroRequest;
import com.titkul.lms.dto.PhieuHoTroResponse;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.service.PhieuHoTroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/tickets")
@RequiredArgsConstructor
public class QuanTriVienPhieuHoTroController {

    private final PhieuHoTroService ticketService;

    @GetMapping
    public ResponseEntity<List<PhieuHoTroResponse>> getPendingTickets() {
        return ResponseEntity.ok(ticketService.getPendingTickets());
    }

    @PostMapping("/{ticketId}/process")
    public ResponseEntity<PhieuHoTroResponse> processTicket(
            @PathVariable Long ticketId,
            Authentication authentication,
            @RequestBody XuLyPhieuHoTroRequest request) {
        return ResponseEntity.ok(ticketService.processTicket(ticketId, authentication.getName(), request));
    }
}
