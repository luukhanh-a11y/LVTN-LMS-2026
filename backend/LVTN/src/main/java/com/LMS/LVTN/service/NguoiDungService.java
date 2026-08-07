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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NguoiDungService {

    NguoiDungRepository nguoiDungRepository;
    NguoiDungMapper nguoiDungMapper;
    AuthenticationService authenticationService;

    @Transactional(readOnly = true)
    public Page<NguoiDungResponse> searchNguoiDung(String token, String role, String keyword, String status, Long classId, Integer grade, String subject, Pageable pageable) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung admin = nguoiDungRepository.findById(nguoiDungId).orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            checkAdminRole(admin);
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }

        Specification<NguoiDung> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (role != null && !role.isEmpty()) {
                predicates.add(cb.equal(root.get("vaiTro"), VaiTro.valueOf(role)));
            }
            if (status != null && !status.isEmpty() && !status.equals("all")) {
                predicates.add(cb.equal(root.get("trangThai"), TrangThaiNguoiDung.valueOf(status)));
            }
            if (keyword != null && !keyword.isEmpty()) {
                String kw = "%" + keyword.toLowerCase() + "%";
                Predicate hoTen = cb.like(cb.lower(root.get("hoSoHocSinh").get("hoTen")), kw);
                Predicate tenDangNhap = cb.like(cb.lower(root.get("tenDangNhap")), kw);
                // Vì hoTen nằm ở 3 bảng (hoSoHocSinh, hoSoGiaoVien, hoSoPhuHuynh) nên ta cần join hoặc tìm trong các bảng liên quan.
                // Để đơn giản, ta tìm kiếm theo tên đăng nhập và email. Tên chi tiết phức tạp hơn do cấu trúc EAV.
                predicates.add(cb.or(tenDangNhap, cb.like(cb.lower(root.get("email")), kw)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return nguoiDungRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<NguoiDungResponse> getAllNguoiDung(String token, Pageable pageable) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            checkAdminRole(nguoiDung);
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
        return nguoiDungRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<NguoiDungResponse> getNguoiDungByTrangThai(String token, TrangThaiNguoiDung trangThai, Pageable pageable) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            checkAdminRole(nguoiDung);
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
        return nguoiDungRepository.findByTrangThai(trangThai, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<NguoiDungResponse> getNguoiDungByVaiTro(String token, VaiTro vaiTro, Pageable pageable) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            checkAdminRole(nguoiDung);
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
        return nguoiDungRepository.findByVaiTro(vaiTro, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public NguoiDungResponse getNguoiDungById(String id) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
        return mapToResponse(nguoiDung);
    }

    @Transactional(readOnly = true)
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

    public NguoiDungResponse updateRole(String token, String id, UpDateRoleUserRequest request) {
        try {
            String adminId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung admin = nguoiDungRepository.findById(adminId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

            checkAdminRole(admin);
            checkTrangThaiHoatDong(admin);

            NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

            nguoiDungMapper.updateRoleUser(request, nguoiDung);
            return nguoiDungMapper.toResponse(nguoiDungRepository.save(nguoiDung));
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }

    public NguoiDungResponse updateTrangThai(String token, String id, UpdateTrangThaiUser request) {
        try {
            String adminId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung admin = nguoiDungRepository.findById(adminId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

            checkAdminRole(admin);

            NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

            nguoiDungMapper.updateTrangThaiUser(request, nguoiDung);
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
            throw new AppExceptions(Errorcode.ACCESS_DENIED);
        }
    }

    private NguoiDungResponse mapToResponse(NguoiDung entity) {
        NguoiDungResponse response = nguoiDungMapper.toResponse(entity);
        if (entity.getVaiTro() == VaiTro.HOC_SINH && entity.getHoSoHocSinh() != null) {
            response.setHoTen(entity.getHoSoHocSinh().getHoTen());
            response.setMaHocSinh(entity.getHoSoHocSinh().getMaHocSinh());
            if (entity.getHoSoHocSinh().getLopHoc() != null) {
                response.setTenLop(entity.getHoSoHocSinh().getLopHoc().getTenLop());
                response.setKhoiLop(entity.getHoSoHocSinh().getLopHoc().getKhoiLop());
                response.setLopHocId(entity.getHoSoHocSinh().getLopHoc().getLopHocId());
            }
        } else if (entity.getVaiTro() == VaiTro.GIAO_VIEN && entity.getHoSoGiaoVien() != null) {
            response.setHoTen(entity.getHoSoGiaoVien().getHoTen());
            response.setMaGiaoVien(entity.getHoSoGiaoVien().getMaGiaoVien());
            response.setBoMon(entity.getHoSoGiaoVien().getBoMon());
            
            String lopGiangDayStr = "";
            List<Long> lopGiangDayIds = new java.util.ArrayList<>();
            if (entity.getHoSoGiaoVien().getPhanCongGiangDays() != null) {
                lopGiangDayStr = entity.getHoSoGiaoVien().getPhanCongGiangDays().stream()
                        .filter(pc -> pc.getLopHoc() != null)
                        .map(pc -> pc.getLopHoc().getTenLop())
                        .distinct()
                        .collect(Collectors.joining(", "));
                        
                lopGiangDayIds = entity.getHoSoGiaoVien().getPhanCongGiangDays().stream()
                        .filter(pc -> pc.getLopHoc() != null)
                        .map(pc -> pc.getLopHoc().getLopHocId())
                        .distinct()
                        .collect(Collectors.toList());
            }
            response.setLopGiangDay(lopGiangDayStr);
            response.setLopGiangDayIds(lopGiangDayIds);
        } else if (entity.getVaiTro() == VaiTro.PHU_HUYNH && entity.getHoSoPhuHuynh() != null) {
            response.setHoTen(entity.getHoSoPhuHuynh().getHoTen());
            String tenConStr = "";
            String lopCuaConStr = "";
            List<Long> lopCuaConIds = new java.util.ArrayList<>();
            
            if (entity.getHoSoPhuHuynh().getPhuHuynhHocSinhs() != null) {
                tenConStr = entity.getHoSoPhuHuynh().getPhuHuynhHocSinhs().stream()
                        .filter(ph -> ph.getHocSinh() != null)
                        .map(ph -> ph.getHocSinh().getHoTen())
                        .collect(Collectors.joining(", "));
                        
                lopCuaConStr = entity.getHoSoPhuHuynh().getPhuHuynhHocSinhs().stream()
                        .filter(ph -> ph.getHocSinh() != null && ph.getHocSinh().getLopHoc() != null)
                        .map(ph -> ph.getHocSinh().getLopHoc().getTenLop())
                        .distinct()
                        .collect(Collectors.joining(", "));
                        
                lopCuaConIds = entity.getHoSoPhuHuynh().getPhuHuynhHocSinhs().stream()
                        .filter(ph -> ph.getHocSinh() != null && ph.getHocSinh().getLopHoc() != null)
                        .map(ph -> ph.getHocSinh().getLopHoc().getLopHocId())
                        .distinct()
                        .collect(Collectors.toList());
            }
            response.setTenCon(tenConStr);
            response.setLopCuaCon(lopCuaConStr);
            response.setLopCuaConIds(lopCuaConIds);
        }
        return response;
    }

    private void checkTrangThaiHoatDong(NguoiDung nguoiDung) {
        if (nguoiDung.getTrangThai() != TrangThaiNguoiDung.ACTIVE) {
            throw new AppExceptions(Errorcode.USER_INACTIVE);
        }
    }
}
