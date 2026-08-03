package com.titkul.lms.service;

import com.titkul.lms.dto.NguoiDungProfileResponse;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.repository.HoSoPhuHuynhRepository;
import com.titkul.lms.repository.HoSoHocSinhRepository;
import com.titkul.lms.repository.HoSoGiaoVienRepository;
import com.titkul.lms.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NguoiDungService {

    private final NguoiDungRepository userRepository;
    private final HoSoHocSinhRepository studentProfileRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final HoSoPhuHuynhRepository parentProfileRepository;

    public NguoiDungProfileResponse getMyProfile(String username) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        NguoiDungProfileResponse dto = NguoiDungProfileResponse.builder()
                .username(user.getTenDangNhap())
                .email(user.getEmail())
                .phone(user.getSoDienThoai())
                .role(user.getVaiTro().name())
                .build();

        switch (user.getVaiTro()) {
            case HOC_SINH:
                studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId()).ifPresent(profile -> {
                    dto.setFullName(profile.getHoTen());
                });
                break;
            case GIAO_VIEN:
                teacherProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId()).ifPresent(profile -> {
                    dto.setFullName(profile.getHoTen());
                });
                break;
            case PHU_HUYNH:
                parentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId()).ifPresent(profile -> {
                    dto.setFullName(profile.getHoTen());
                });
                break;
            case ADMIN:
                dto.setFullName("Quản trị viên");
                break;
        }

        // Set default name if not found
        if (dto.getFullName() == null || dto.getFullName().isEmpty()) {
            dto.setFullName(user.getTenDangNhap());
        }

        return dto;
    }
}
