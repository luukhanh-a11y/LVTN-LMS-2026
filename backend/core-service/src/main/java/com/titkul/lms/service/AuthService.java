package com.titkul.lms.service;

import com.titkul.lms.dto.JwtResponse;
import com.titkul.lms.entity.PhienDangNhap;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.security.JwtUtils;
import com.titkul.lms.security.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;

    @Value("${jwt.expiration}")
    private Long jwtExpirationMs;

    public JwtResponse buildLoginResponse(Authentication authentication, HttpServletRequest request) {
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(authentication);
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("UNKNOWN");

        JwtResponse.UserDto userDto = new JwtResponse.UserDto(
                userDetails.getId(),
                role,
                "ACTIVE",
                userDetails.getUsername(),
                userDetails.getRequirePasswordChange()
        );

        PhienDangNhap refreshToken = refreshTokenService.createRefreshToken(
                userDetails.getId(),
                request.getHeader("User-Agent"),
                request.getRemoteAddr()
        );

        return new JwtResponse(jwt, refreshToken.getRefreshToken(), "Bearer", jwtExpirationMs / 1000, userDto);
    }

    public String generateTokenFromUser(NguoiDung user) {
        return jwtUtils.generateJwtTokenFromUsername(user.getTenDangNhap(), user.getVaiTro().name());
    }
}
