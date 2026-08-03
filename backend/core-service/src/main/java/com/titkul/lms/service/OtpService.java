package com.titkul.lms.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final Map<String, OtpData> otpCache = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(999999));
        otpCache.put(email, new OtpData(otp, LocalDateTime.now().plusMinutes(5)));
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        OtpData data = otpCache.get(email);
        if (data == null) return false;
        
        if (LocalDateTime.now().isAfter(data.expiryTime)) {
            otpCache.remove(email);
            return false; // expired
        }
        
        if (data.otp.equals(otp)) {
            otpCache.remove(email); // consume it
            return true;
        }
        return false;
    }

    private static class OtpData {
        String otp;
        LocalDateTime expiryTime;

        OtpData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}
