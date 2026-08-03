package com.titkul.lms.service;

import com.titkul.lms.constant.AppConstants;
import com.titkul.lms.dto.NguoiDungQuanTriResponse;
import com.titkul.lms.dto.TaoNguoiDungRequest;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import com.titkul.lms.service.strategy.TaoNguoiDungStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuanLyNguoiDungService {

    private final NguoiDungRepository userRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final HoSoHocSinhRepository studentProfileRepository;
    private final HoSoPhuHuynhRepository parentProfileRepository;
    private final LopHocRepository classRoomRepository;
    private final com.titkul.lms.repository.LichSuChuyenLopRepository classTransferHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final List<TaoNguoiDungStrategy> userCreationStrategies;

    @Transactional
    public NguoiDung createUser(TaoNguoiDungRequest dto) {
        // Username giờ được tự sinh bên trong từng TaoNguoiDungStrategy (GV+SĐT / HS+Mã HS)
        // và được kiểm tra trùng ngay tại đó, nên không cần check dto.getUsername() ở đây nữa.
        String defaultPasswordHash = passwordEncoder.encode(AppConstants.DEFAULT_PASSWORD);

        TaoNguoiDungStrategy strategy = userCreationStrategies.stream()
                .filter(s -> s.supports(dto.getRole()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Vai trò không hợp lệ hoặc không được hỗ trợ: " + dto.getRole()));

        return strategy.createUser(dto, defaultPasswordHash);
    }

    @Transactional(readOnly = true)
    public List<NguoiDungQuanTriResponse> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            NguoiDungQuanTriResponse dto = new NguoiDungQuanTriResponse();
            dto.setId(user.getNguoiDungId());
            dto.setUsername(user.getTenDangNhap());
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getSoDienThoai());
            dto.setRole(user.getVaiTro().name());
            dto.setStatus(user.getTrangThai().name());
            dto.setRequirePasswordChange(user.getBatBuocDoiMk());
            dto.setLastLogin(user.getLanDangNhapCuoi());
            dto.setCreatedAt(user.getNgayTao());

            if (user.getVaiTro() == VaiTro.HOC_SINH) {
                studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId()).ifPresent(p -> {
                    dto.setFullName(p.getHoTen());
                    if (p.getLopHoc() != null) {
                        dto.setClassName(p.getLopHoc().getTenLop());
                        dto.setClassId(p.getLopHoc().getLopHocId());
                        dto.getClassIds().add(p.getLopHoc().getLopHocId());
                    }
                });
            } else if (user.getVaiTro() == VaiTro.GIAO_VIEN) {
                teacherProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId()).ifPresent(p -> {
                    dto.setFullName(p.getHoTen());
                });
            } else if (user.getVaiTro() == VaiTro.PHU_HUYNH) {
                parentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId()).ifPresent(p -> {
                    dto.setFullName(p.getHoTen());
                    List<HoSoHocSinh> children = studentProfileRepository.findByPhuHuynh_PhuHuynhId(p.getPhuHuynhId());
                    if (children != null) {
                        children.forEach(child -> {
                            if (child.getLopHoc() != null) {
                                dto.getClassIds().add(child.getLopHoc().getLopHocId());
                            }
                        });
                    }
                });
            }
            return dto;
        }).toList();
    }

    @Transactional
    public NguoiDung toggleUserStatus(Long userId) {
        NguoiDung user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        if (user.getTrangThai() == TrangThaiNguoiDung.ACTIVE) {
            user.setTrangThai(TrangThaiNguoiDung.LOCKED);
        } else {
            user.setTrangThai(TrangThaiNguoiDung.ACTIVE);
        }
        return userRepository.save(user);
    }
    
    @Transactional
    public NguoiDung updateUser(Long userId, NguoiDung updateDto) {
        NguoiDung user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
        
        if (updateDto.getSoDienThoai() != null && !updateDto.getSoDienThoai().isEmpty()) {
            user.setSoDienThoai(updateDto.getSoDienThoai());
        }
        if (updateDto.getTrangThai() != null) {
            user.setTrangThai(updateDto.getTrangThai());
        }
        return userRepository.save(user);
    }
    
    @Transactional
    public void transferClass(Long userId, Long newClassId, String adminUsername, LyDoChuyenLop reason, String note) {
        HoSoHocSinh profile = studentProfileRepository.findByNguoiDung_NguoiDungId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));
        LopHoc newClass = classRoomRepository.findById(newClassId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        NguoiDung admin = userRepository.findByTenDangNhap(adminUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người thực hiện"));

        LopHoc oldClass = profile.getLopHoc();
        if (oldClass != null && oldClass.getLopHocId().equals(newClass.getLopHocId())) {
            throw new RuntimeException("Học sinh đã thuộc lớp này rồi.");
        }

        LichSuChuyenLop history = new LichSuChuyenLop();
        history.setStudent(profile);
        history.setLopCu(oldClass);
        history.setLopMoi(newClass);
        history.setNamHocCu(oldClass != null ? oldClass.getNamHoc().getTenNamHoc() : null);
        history.setNamHocMoi(newClass.getNamHoc().getTenNamHoc());
        history.setLyDo(reason != null ? reason : LyDoChuyenLop.DOI_LOP);
        history.setGhiChu(note);
        history.setNguoiThucHien(admin);
        classTransferHistoryRepository.save(history);

        profile.setLopHoc(newClass);
        studentProfileRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> getClassTransferHistory(Long userId) {
        HoSoHocSinh profile = studentProfileRepository.findByNguoiDung_NguoiDungId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        java.time.format.DateTimeFormatter fmt = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return classTransferHistoryRepository.findByStudent_HocSinhIdOrderByThoiDiemChuyenDesc(profile.getHocSinhId())
                .stream()
                .map(h -> {
                    java.util.Map<String, Object> map = new java.util.LinkedHashMap<>();
                    map.put("id", h.getChuyenLopId());
                    map.put("lopCu", h.getLopCu() != null ? h.getLopCu().getTenLop() : null);
                    map.put("lopMoi", h.getLopMoi().getTenLop());
                    map.put("namHocCu", h.getNamHocCu());
                    map.put("namHocMoi", h.getNamHocMoi());
                    map.put("lyDo", h.getLyDo().name());
                    map.put("ghiChu", h.getGhiChu());
                    map.put("nguoiThucHien", h.getNguoiThucHien().getTenDangNhap());
                    map.put("thoiDiemChuyen", h.getThoiDiemChuyen().format(fmt));
                    return map;
                })
                .collect(java.util.stream.Collectors.toList());
    }
}
