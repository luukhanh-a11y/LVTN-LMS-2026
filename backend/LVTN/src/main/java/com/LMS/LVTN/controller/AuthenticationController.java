package com.LMS.LVTN.controller;

import com.LMS.LVTN.dto.request.AuthenticationRequest;
import com.LMS.LVTN.dto.request.ForgotPasswordRequest;
import com.LMS.LVTN.dto.request.IntrospectRequest;
import com.LMS.LVTN.dto.request.LogoutRequest;
import com.LMS.LVTN.dto.request.RefreshRequest;
import com.LMS.LVTN.dto.request.VerifyOtpRequest;
import com.LMS.LVTN.dto.response.ApiResponse;
import com.LMS.LVTN.dto.response.AuthenticationResponse;
import com.LMS.LVTN.dto.response.IntrospectResponse;
import com.LMS.LVTN.service.AuthenticationService;
import com.LMS.LVTN.service.OtpService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;
    OtpService otpService;

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .data(authenticationService.authenticate(request))
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) {
        return ApiResponse.<IntrospectResponse>builder()
                .data(authenticationService.introspect(request))
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        return ApiResponse.<AuthenticationResponse>builder()
                .data(authenticationService.refreshToken(request))
                .build();
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        otpService.sendOtpResetPassword(request.getEmail());
        return ApiResponse.<String>builder()
                .data("Mã OTP đã được gửi về email của bạn (hiệu lực trong 1 phút). Vui lòng kiểm tra hộp thư.")
                .build();
    }

    @PostMapping("/verify-otp-reset")
    public ApiResponse<String> verifyOtpReset(@RequestBody VerifyOtpRequest request) {
        otpService.verifyOtpAndResetPassword(request.getEmail(), request.getOtp());
        return ApiResponse.<String>builder()
                .data("Xác nhận OTP thành công. Mật khẩu mới đã được gửi về email của bạn.")
                .build();
    }
}
