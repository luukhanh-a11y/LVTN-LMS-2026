package com.titkul.lms.service.strategy;

import com.titkul.lms.dto.TaoNguoiDungRequest;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TaoHocSinhStrategy implements TaoNguoiDungStrategy {

    private final NguoiDungRepository userRepository;
    private final HoSoHocSinhRepository studentProfileRepository;
    private final HoSoPhuHuynhRepository parentProfileRepository;
    private final LopHocRepository classRoomRepository;

    @Override
    public boolean supports(String roleStr) {
        return "HOC_SINH".equals(roleStr);
    }

    @Override
    @Transactional
    public NguoiDung createUser(TaoNguoiDungRequest dto, String defaultPasswordHash) {
        if (dto.getStudentCode() == null || dto.getStudentCode().isBlank()) {
            throw new IllegalArgumentException("Mã học sinh là bắt buộc để tạo tài khoản Học sinh.");
        }
        if (studentProfileRepository.findByMaHocSinh(dto.getStudentCode()).isPresent()) {
            throw new RuntimeException("Mã học sinh này đã tồn tại.");
        }
        if (dto.getClassId() == null) {
            throw new IllegalArgumentException("Học sinh bắt buộc phải được gắn vào một lớp học.");
        }

        LopHoc classRoom = classRoomRepository.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lớp học"));
        if (classRoom.getTrangThai() != TrangThaiLopHoc.ACTIVE) {
            throw new IllegalArgumentException("Chỉ được gắn học sinh vào lớp đang ACTIVE.");
        }

        String username = "HS" + dto.getStudentCode();
        if (userRepository.existsByTenDangNhap(username)) {
            throw new RuntimeException("Đã tồn tại tài khoản Học sinh với mã này.");
        }

        NguoiDung user = new NguoiDung();
        user.setTenDangNhap(username);
        user.setMatKhauHash(defaultPasswordHash);
        user.setTrangThai(TrangThaiNguoiDung.ACTIVE);
        user.setBatBuocDoiMk(true);
        user.setVaiTro(VaiTro.HOC_SINH);

        user = userRepository.save(user);

        HoSoPhuHuynh parentProfile = null;
        if (dto.getParentPhone() != null && !dto.getParentPhone().trim().isEmpty()) {
            Optional<NguoiDung> existingParent = userRepository.findByTenDangNhap(dto.getParentPhone());
            if (existingParent.isPresent()) {
                parentProfile = parentProfileRepository.findByNguoiDung_NguoiDungId(existingParent.get().getNguoiDungId())
                    .orElseThrow(() -> new RuntimeException("SĐT đã dùng nhưng không phải Phụ huynh."));
            } else {
                NguoiDung pUser = new NguoiDung();
                pUser.setTenDangNhap(dto.getParentPhone());
                pUser.setSoDienThoai(dto.getParentPhone());
                pUser.setMatKhauHash(defaultPasswordHash);
                pUser.setVaiTro(VaiTro.PHU_HUYNH);
                pUser.setTrangThai(TrangThaiNguoiDung.ACTIVE);
                pUser.setBatBuocDoiMk(true);
                pUser = userRepository.save(pUser);

                parentProfile = new HoSoPhuHuynh();
                parentProfile.setNguoiDung(pUser);
                parentProfile.setHoTen(dto.getParentName() != null ? dto.getParentName() : "Phụ huynh của " + dto.getFullName());
                parentProfile = parentProfileRepository.save(parentProfile);
            }
        }

        HoSoHocSinh sp = new HoSoHocSinh();
        sp.setNguoiDung(user);
        sp.setMaHocSinh(dto.getStudentCode());
        sp.setHoTen(dto.getFullName());
        sp.setNgaySinh(dto.getDateOfBirth());
        sp.setLopHoc(classRoom);
        sp.setPhuHuynh(parentProfile);
        studentProfileRepository.save(sp);
        
        return user;
    }
}
