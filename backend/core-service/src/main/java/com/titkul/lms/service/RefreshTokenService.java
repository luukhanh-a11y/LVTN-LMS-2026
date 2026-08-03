package com.titkul.lms.service;

import com.titkul.lms.entity.PhienDangNhap;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.repository.PhienDangNhapRepository;
import com.titkul.lms.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${jwt.refreshExpirationMs:2592000000}")
    private Long refreshTokenDurationMs;

    private final PhienDangNhapRepository loginSessionRepository;
    private final NguoiDungRepository userRepository;

    public PhienDangNhap createRefreshToken(Long userId, String deviceName, String ipAddress) {
        NguoiDung user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        PhienDangNhap session = PhienDangNhap.builder()
                .nguoiDung(user)
                .refreshToken(UUID.randomUUID().toString())
                .tenThietBi(deviceName)
                .diaChiIp(ipAddress)
                .hetHan(LocalDateTime.now().plusNanos(refreshTokenDurationMs * 1_000_000))
                .thoiDiemTao(LocalDateTime.now())
                .daThuHoi(false)
                .build();

        return loginSessionRepository.save(session);
    }

    public Optional<PhienDangNhap> findByToken(String token) {
        return loginSessionRepository.findAll().stream().filter(s -> s.getRefreshToken().equals(token)).findFirst(); // In real app, query DB directly
    }

    public PhienDangNhap verifyExpiration(PhienDangNhap token) {
        if (token.getHetHan().isBefore(LocalDateTime.now()) || token.getDaThuHoi()) {
            loginSessionRepository.delete(token);
            throw new RuntimeException("Refresh token was expired or revoked. Please make a new signin request");
        }

        token.setThoiDiemSuDungCuoi(LocalDateTime.now());
        return loginSessionRepository.save(token);
    }
}
