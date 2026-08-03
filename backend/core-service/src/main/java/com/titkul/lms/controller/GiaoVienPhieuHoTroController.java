package com.titkul.lms.controller;

import com.titkul.lms.dto.PhieuHoTroResponse;
import com.titkul.lms.dto.PhieuHoTroRequest;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.service.PhieuHoTroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teacher/tickets")
@RequiredArgsConstructor
public class GiaoVienPhieuHoTroController {

    private final PhieuHoTroService ticketService;

    @GetMapping
    public ResponseEntity<List<PhieuHoTroResponse>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketService.getTicketsByTeacherUsername(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<PhieuHoTroResponse> createTicket(
            Authentication authentication,
            @RequestBody PhieuHoTroRequest request) {
        return ResponseEntity.ok(ticketService.createTicket(authentication.getName(), request));
    }
}
