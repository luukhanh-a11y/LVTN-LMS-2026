package com.LMS.LVTN.service;
// Force recompile
import com.LMS.LVTN.dto.request.AuthenticationRequest;
import com.LMS.LVTN.dto.request.IntrospectRequest;
import com.LMS.LVTN.dto.request.LogoutRequest;
import com.LMS.LVTN.dto.request.RefreshRequest;
import com.LMS.LVTN.dto.response.AuthenticationResponse;
import com.LMS.LVTN.dto.response.IntrospectResponse;
import com.LMS.LVTN.dto.response.NguoiDungResponse;
import com.LMS.LVTN.entity.InvalidatedToken;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.enums.TrangThaiNguoiDung;
import com.LMS.LVTN.repository.InvalidatedTokenRepository;
import com.LMS.LVTN.repository.NguoiDungRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationService {

    final NguoiDungRepository nguoiDungRepository;
    final InvalidatedTokenRepository invalidatedTokenRepository;

    @Value("${jwt.signerKey}")
    String signerKey;

    @Value("${jwt.valid-duration}")
    long validDuration;

    @Value("${jwt.refreshable-duration}")
    long refreshableDuration;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        var user = nguoiDungRepository.findByTenDangNhap(request.getTenDangNhap())
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

        if (user.getTrangThai() == TrangThaiNguoiDung.LOCKED || user.getTrangThai() == TrangThaiNguoiDung.DISABLED) {
            throw new AppExceptions(Errorcode.USER_INACTIVE);
        }

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getMatKhauHash());

        if (!authenticated) {
            throw new AppExceptions(Errorcode.UNAUTHENTICATED);
        }

        var token = generateToken(user);

        NguoiDungResponse thongTinUser = new NguoiDungResponse();
        thongTinUser.setNguoiDungId(user.getNguoiDungId());
        thongTinUser.setTenDangNhap(user.getTenDangNhap());
        thongTinUser.setVaiTro(user.getVaiTro());
        thongTinUser.setTrangThai(user.getTrangThai());
        thongTinUser.setEmail(user.getEmail());
        thongTinUser.setSoDienThoai(user.getSoDienThoai());

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .thongTinUser(thongTinUser)
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request) {
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token, false);
        } catch (AppExceptions | JOSEException | ParseException e) {
            isValid = false;
        }
        return IntrospectResponse.builder().valid(isValid).build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);
            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            if (jit != null && !invalidatedTokenRepository.existsById(jit)) {
                InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                        .id(jit)
                        .expiryTime(expiryTime)
                        .build();

                try {
                    invalidatedTokenRepository.save(invalidatedToken);
                } catch (Exception e) {
                    log.info("Token {} already invalidated", jit);
                }
            }
        } catch (AppExceptions e) {
            log.info("Token already expired or invalid");
        }
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signJWT = verifyToken(request.getToken(), true);

        var jit = signJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signJWT.getJWTClaimsSet().getExpirationTime();

        if (jit != null && !invalidatedTokenRepository.existsById(jit)) {
            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jit)
                    .expiryTime(expiryTime)
                    .build();

            try {
                invalidatedTokenRepository.save(invalidatedToken);
            } catch (Exception e) {
                log.info("Token {} already invalidated during refresh", jit);
            }
        }

        var username = signJWT.getJWTClaimsSet().getSubject();
        var user = nguoiDungRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new AppExceptions(Errorcode.UNAUTHENTICATED));

        var token = generateToken(user);

        NguoiDungResponse thongTinUser = new NguoiDungResponse();
        thongTinUser.setNguoiDungId(user.getNguoiDungId());
        thongTinUser.setTenDangNhap(user.getTenDangNhap());
        thongTinUser.setVaiTro(user.getVaiTro());
        thongTinUser.setTrangThai(user.getTrangThai());
        thongTinUser.setEmail(user.getEmail());
        thongTinUser.setSoDienThoai(user.getSoDienThoai());

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .thongTinUser(thongTinUser)
                .build();
    }

    private String generateToken(NguoiDung nguoiDung) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(nguoiDung.getTenDangNhap())
                .issuer("com.LMS.LVTN")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(validDuration, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("role", nguoiDung.getVaiTro().name())
                .claim("idnguoiDung", nguoiDung.getNguoiDungId())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new AppExceptions(Errorcode.TOKEN_GENERATION_FAILED);
        }
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(signerKey.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant()
                        .plus(refreshableDuration, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date())))
            throw new AppExceptions(Errorcode.UNAUTHENTICATED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppExceptions(Errorcode.UNAUTHENTICATED);

        return signedJWT;
    }

    public String getMaNguoiDungFromToken(String token) throws ParseException {
        
        if (!StringUtils.hasText(token)) {
        throw new AppExceptions(Errorcode.UNAUTHENTICATED);
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        SignedJWT signedJWT;
        try {
            signedJWT = verifyToken(token, false);
        } catch (JOSEException e) {
            throw new AppExceptions(Errorcode.UNAUTHENTICATED);
        }

        Object claim = signedJWT.getJWTClaimsSet().getClaim("idnguoiDung");

        if (claim == null) {
            throw new AppExceptions(Errorcode.UNAUTHENTICATED);
        }

        return String.valueOf(claim);
    }

    public String getRoleFromToken(String token) throws ParseException {

        if (!StringUtils.hasText(token)) {
        throw new AppExceptions(Errorcode.UNAUTHENTICATED);
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        SignedJWT signedJWT;
        try {
            signedJWT = verifyToken(token, false);
        } catch (JOSEException e) {
            throw new AppExceptions(Errorcode.UNAUTHENTICATED);
        }
        return (String) signedJWT.getJWTClaimsSet().getClaim("role");
    }
}
