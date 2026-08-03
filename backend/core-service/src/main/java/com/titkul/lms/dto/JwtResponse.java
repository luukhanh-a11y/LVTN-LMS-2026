package com.titkul.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UserDto user;

    @Data
    @AllArgsConstructor
    public static class UserDto {
        private Long userId;
        private String role;
        private String status;
        private String username;
        private Boolean requirePasswordChange;
    }
}
