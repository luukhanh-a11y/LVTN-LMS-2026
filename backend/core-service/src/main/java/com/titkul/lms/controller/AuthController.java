package com.titkul.lms.controller;

import com.titkul.lms.dto.*;
import com.titkul.lms.entity.PhienDangNhap;
import com.titkul.lms.repository.PhienDangNhapRepository;
import com.titkul.lms.repository.NguoiDungRepository;
import com.titkul.lms.service.AuthService;
import com.titkul.lms.service.EmailService;
import com.titkul.lms.service.OtpService;
import com.titkul.lms.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final NguoiDungRepository userRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final PhienDangNhapRepository loginSessionRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (LockedException e) {
            return ResponseEntity.status(403).body(Map.of("message", "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên."));
        } catch (DisabledException e) {
            return ResponseEntity.status(403).body(Map.of("message", "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên."));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Tài khoản hoặc mật khẩu không chính xác."));
        }
        return ResponseEntity.ok(authService.buildLoginResponse(authentication, request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(PhienDangNhap::getNguoiDung)
                .map(user -> {
                    String token = authService.generateTokenFromUser(user);
                    return ResponseEntity.ok(new TokenRefreshResponse(token, request.getRefreshToken(), "Bearer"));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email không tồn tại trong hệ thống."));
        }
        String otp = otpService.generateOtp(request.getEmail());
        emailService.sendSimpleEmail(
                request.getEmail(),
                "Titkul LMS - Mã xác nhận lấy lại mật khẩu",
                "Mã OTP của bạn là: " + otp + "\n\nMã này có hiệu lực trong 5 phút.\nVui lòng không chia sẻ mã này cho bất kỳ ai."
        );
        return ResponseEntity.ok(Map.of("message", "Mã OTP đã được gửi đến email của bạn."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        if (!otpService.validateOtp(request.getEmail(), request.getOtp())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã OTP không hợp lệ hoặc đã hết hạn."));
        }
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    user.setMatKhauHash(passwordEncoder.encode(request.getNewPassword()));
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ."));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("message", "Lỗi không xác định.")));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập."));
        }
        return userRepository.findByTenDangNhap(authentication.getName())
                .map(user -> {
                    user.setMatKhauHash(passwordEncoder.encode(request.getNewPassword()));
                    user.setBatBuocDoiMk(false);
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công."));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("message", "Người dùng không tồn tại.")));
    }

    // QT01.2 - Đổi mật khẩu tự nguyện (đã đăng nhập): xác nhận MK cũ -> gửi OTP
    @PostMapping("/change-password/request-otp")
    public ResponseEntity<?> requestChangePasswordOtp(@Valid @RequestBody ChangePasswordOtpRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập."));
        }
        return userRepository.findByTenDangNhap(authentication.getName())
                .map(user -> {
                    if (!passwordEncoder.matches(request.getOldPassword(), user.getMatKhauHash())) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu hiện tại không chính xác."));
                    }
                    if (user.getEmail() == null || user.getEmail().isBlank()) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Tài khoản chưa có email để nhận mã OTP."));
                    }
                    String otp = otpService.generateOtp(user.getEmail());
                    emailService.sendSimpleEmail(
                            user.getEmail(),
                            "Titkul LMS - Mã xác nhận đổi mật khẩu",
                            "Mã OTP của bạn là: " + otp + "\n\nMã này có hiệu lực trong 5 phút.\nVui lòng không chia sẻ mã này cho bất kỳ ai."
                    );
                    return ResponseEntity.ok(Map.of("message", "Mã OTP đã được gửi đến email của bạn."));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("message", "Người dùng không tồn tại.")));
    }

    // QT01.2 - Bước 2: xác nhận OTP -> lưu MK mới -> đăng xuất các phiên khác
    @PostMapping("/change-password/confirm")
    public ResponseEntity<?> confirmChangePassword(@Valid @RequestBody ChangePasswordConfirmRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập."));
        }
        return userRepository.findByTenDangNhap(authentication.getName())
                .map(user -> {
                    if (!otpService.validateOtp(user.getEmail(), request.getOtp())) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Mã OTP không hợp lệ hoặc đã hết hạn."));
                    }
                    user.setMatKhauHash(passwordEncoder.encode(request.getNewPassword()));
                    user.setBatBuocDoiMk(false);
                    userRepository.save(user);
                    loginSessionRepository.deleteByNguoiDung(user);
                    return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại trên các thiết bị khác."));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("message", "Người dùng không tồn tại.")));
    }
}
