package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.NguoiDungCreateRequest;
import com.LMS.LVTN.dto.request.NguoiDungRequest;
import com.LMS.LVTN.dto.request.UpDateRoleUserRequest;
import com.LMS.LVTN.dto.request.UpdateTrangThaiUser;
import com.LMS.LVTN.dto.response.NguoiDungResponse;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.enums.TrangThaiNguoiDung;
import com.LMS.LVTN.enums.VaiTro;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.NguoiDungMapper;
import com.LMS.LVTN.repository.NguoiDungRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NguoiDungService {

    NguoiDungRepository nguoiDungRepository;
    NguoiDungMapper nguoiDungMapper;
    AuthenticationService authenticationService;

    public List<NguoiDungResponse> getAllNguoiDung(String token) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            checkAdminRole(nguoiDung);
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
        return nguoiDungRepository.findAll().stream()
                .map(nguoiDungMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<NguoiDungResponse> getNguoiDungByTrangThai(String token, TrangThaiNguoiDung trangThai) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            checkAdminRole(nguoiDung);
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
        return nguoiDungRepository.findByTrangThai(trangThai).stream()
                .map(nguoiDungMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<NguoiDungResponse> getNguoiDungByVaiTro(String token, VaiTro vaiTro) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            checkAdminRole(nguoiDung);
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
        return nguoiDungRepository.findByVaiTro(vaiTro).stream()
                .map(nguoiDungMapper::toResponse)
                .collect(Collectors.toList());
    }

    public NguoiDungResponse getNguoiDungById(String  id) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
        return nguoiDungMapper.toResponse(nguoiDung);
    }

    public NguoiDungResponse getMyInfo(String token) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            return nguoiDungMapper.toResponse(nguoiDung);
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }

    public NguoiDungResponse updateRole(String token, String id, UpDateRoleUserRequest request){
        try {
            String adminId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung admin = nguoiDungRepository.findById(adminId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

            checkAdminRole(admin);
            checkTrangThaiHoatDong(admin);

            NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

            nguoiDungMapper.updateRoleUser(request,nguoiDung);
            return nguoiDungMapper.toResponse(nguoiDungRepository.save(nguoiDung));
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }

    public NguoiDungResponse updateTrangThai(String token, String id, UpdateTrangThaiUser request){
        try {
            String adminId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung admin = nguoiDungRepository.findById(adminId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

            checkAdminRole(admin);

            NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

            nguoiDungMapper.updateTrangThaiUser(request,nguoiDung);
            return nguoiDungMapper.toResponse(nguoiDungRepository.save(nguoiDung));
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }

    public NguoiDungResponse createNguoiDung(NguoiDungCreateRequest request) {
        if (request.getVaiTro() == null || request.getTrangThai() == null) {
            throw new AppExceptions(Errorcode.INVALID_KEY);
        }
        
        NguoiDung nguoiDung = nguoiDungMapper.toEntity(request);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        nguoiDung.setMatKhauHash(passwordEncoder.encode(request.getMatKhau()));
        
        return nguoiDungMapper.toResponse(nguoiDungRepository.save(nguoiDung));
    }

    public NguoiDungResponse updateThongTinNguoiDung(String id, NguoiDungRequest request) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

        nguoiDungMapper.updateThongTinNguoiDung(request, nguoiDung);
        return nguoiDungMapper.toResponse(nguoiDungRepository.save(nguoiDung));
    }

    public void deleteNguoiDung(String id) {
        if (!nguoiDungRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);
        }
        nguoiDungRepository.deleteById(id);
    }

    private void checkAdminRole(NguoiDung nguoiDung) {
        if (nguoiDung.getVaiTro() != VaiTro.ADMIN) {
            throw new AppExceptions(Errorcode.UNAUTHORIZED);
        }
    }

    private void checkTrangThaiHoatDong(NguoiDung nguoiDung) {
        if (nguoiDung.getTrangThai() != TrangThaiNguoiDung.ACTIVE) {
            throw new AppExceptions(Errorcode.USER_INACTIVE);
        }
    }
}
