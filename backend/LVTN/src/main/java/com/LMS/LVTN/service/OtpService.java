package com.LMS.LVTN.service;

import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.repository.NguoiDungRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OtpService {

    NguoiDungRepository nguoiDungRepository;
    EmailService emailService;

    Map<String, OtpInfo> otpCache = new ConcurrentHashMap<>();

    @NonFinal
    @Value("${app.otp.expiration-minutes:1}")
    long otpExpirationMinutes;

    public void sendOtpResetPassword(String email) {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new AppExceptions(Errorcode.EMAIL_NOT_FOUND));
        String otpCode = String.format("%06d", new Random().nextInt(1000000));
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(otpExpirationMinutes);

        otpCache.put(email, new OtpInfo(otpCode, expiryTime));

        String subject = "[Hệ thống LMS] Mã OTP khôi phục mật khẩu";
        String content = String.format(
                "Xin chào %s,\n\n" +
                "Mã OTP để đặt lại mật khẩu của bạn là: %s\n" +
                "Mã này có hiệu lực trong vòng %d phút. Vui lòng không chia sẻ cho bất kỳ ai.\n\n" +
                "Trân trọng,\nBan quản trị hệ thống.",
                nguoiDung.getTenDangNhap(), otpCode, otpExpirationMinutes
        );

        emailService.sendSimpleEmail(email, subject, content);
    }

    @Transactional
    public void verifyOtpAndResetPassword(String email, String inputOtp) {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new AppExceptions(Errorcode.EMAIL_NOT_FOUND));

        OtpInfo otpInfo = otpCache.get(email);
        if (otpInfo == null) {
            throw new AppExceptions(Errorcode.OTP_INVALID);
        }

        if (LocalDateTime.now().isAfter(otpInfo.getExpiryTime())) {
            otpCache.remove(email);
            throw new AppExceptions(Errorcode.OTP_EXPIRED);
        }

        if (!otpInfo.getOtpCode().equals(inputOtp)) {
            throw new AppExceptions(Errorcode.OTP_INVALID);
        }

        otpCache.remove(email);

        String newPassword = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8).toUpperCase();

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        nguoiDung.setMatKhauHash(passwordEncoder.encode(newPassword));
        nguoiDung.setBatBuocDoiMk(true);
        nguoiDungRepository.save(nguoiDung);

        String subject = "[Hệ thống LMS] Mật khẩu mới của bạn";
        String content = String.format(
                "Xin chào %s,\n\n" +
                "Bạn đã xác thực OTP thành công. Mật khẩu mới cho tài khoản của bạn là: %s\n" +
                "⚡ LƯU Ý BẢO MẬT: Hệ thống sẽ BẮT BUỘC bạn đổi mật khẩu mới ngay khi bạn đăng nhập lần tới.\n\n" +
                "Trân trọng,\nBan quản trị hệ thống.",
                nguoiDung.getTenDangNhap(), newPassword
        );

        emailService.sendSimpleEmail(email, subject, content);
    }

    @Data
    @AllArgsConstructor
    private static class OtpInfo {
        private String otpCode;
        private LocalDateTime expiryTime;
    }
}
