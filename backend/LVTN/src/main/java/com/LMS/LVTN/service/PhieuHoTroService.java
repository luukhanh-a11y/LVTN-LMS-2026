package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.PhieuHoTroRequest;
import com.LMS.LVTN.dto.request.ThongBaoRequest;
import com.LMS.LVTN.dto.response.PhieuHoTroResponse;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.PhieuHoTro;
import com.LMS.LVTN.enums.LoaiThongBao;
import com.LMS.LVTN.enums.TrangThaiPhieu;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.PhieuHoTroMapper;
import com.LMS.LVTN.repository.NguoiDungRepository;
import com.LMS.LVTN.repository.NguoiDungRepository;
import com.LMS.LVTN.repository.PhieuHoTroRepository;
import com.LMS.LVTN.repository.NamHocRepository;
import com.LMS.LVTN.entity.NamHoc;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PhieuHoTroService {

    PhieuHoTroRepository phieuHoTroRepository;
    PhieuHoTroMapper phieuHoTroMapper;
    NguoiDungRepository nguoiDungRepository;
    ThongBaoService thongBaoService;
    EmailService emailService;
    NamHocRepository namHocRepository;

    @NonFinal
    @Value("${app.default.reset-password:123456}")
    String defaultResetPassword;

    @Transactional
    public PhieuHoTroResponse create(PhieuHoTroRequest request) {
        PhieuHoTro phieuHoTro = phieuHoTroMapper.toEntity(request);
        if (phieuHoTro.getTrangThai() == null) {
            phieuHoTro.setTrangThai(TrangThaiPhieu.CHO_DUYET);
        }
        
        if (request.getNguoiDungTaoId() != null) {
            NguoiDung nguoiDungTao = nguoiDungRepository.findById(request.getNguoiDungTaoId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            phieuHoTro.setNguoiDungTao(nguoiDungTao);
        }
        
        if (request.getNguoiDungLienQuanId() != null) {
            NguoiDung nguoiDungLienQuan = nguoiDungRepository.findById(request.getNguoiDungLienQuanId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            phieuHoTro.setNguoiDungLienQuan(nguoiDungLienQuan);
        }
        
        return phieuHoTroMapper.toResponse(phieuHoTroRepository.save(phieuHoTro));
    }

    public List<PhieuHoTroResponse> getAllByIdUserSend(String idUser){
        if (!nguoiDungRepository.existsById(idUser))
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        return phieuHoTroRepository.findByNguoiDungTao_NguoiDungId(idUser)
                .stream().map(phieuHoTroMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<PhieuHoTroResponse> getAllByIdUserReceive(String idUser){
        if (!nguoiDungRepository.existsById(idUser))
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        return phieuHoTroRepository.findByNguoiDungLienQuan_NguoiDungId(idUser)
                .stream().map(phieuHoTroMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<PhieuHoTroResponse> getAll() {
        return phieuHoTroRepository.findAll().stream()
                .map(phieuHoTroMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Page<PhieuHoTroResponse> searchPhieuHoTro(String keyword, String loaiYeuCau, String trangThai, Integer namHocId, Pageable pageable) {
        Specification<PhieuHoTro> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (keyword != null && !keyword.isEmpty()) {
                String kw = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("moTa")), kw));
            }
            if (loaiYeuCau != null && !loaiYeuCau.isEmpty() && !loaiYeuCau.equals("all")) {
                predicates.add(cb.equal(root.get("loaiYeuCau"), loaiYeuCau));
            }
            if (trangThai != null && !trangThai.isEmpty() && !trangThai.equals("all")) {
                predicates.add(cb.equal(root.get("trangThai"), com.LMS.LVTN.enums.TrangThaiPhieu.valueOf(trangThai)));
            }
            if (namHocId != null) {
                NamHoc namHoc = namHocRepository.findById(namHocId).orElse(null);
                if (namHoc != null && namHoc.getNgayBatDau() != null) {
                    java.time.LocalDateTime startDate = namHoc.getNgayBatDau().atStartOfDay();
                    java.time.LocalDateTime endDate = null;
                    
                    List<NamHoc> allNamHocs = namHocRepository.findAll(org.springframework.data.domain.Sort.by("ngayBatDau").ascending());
                    for (int i = 0; i < allNamHocs.size(); i++) {
                        if (allNamHocs.get(i).getNamHocId().equals(namHoc.getNamHocId())) {
                            if (i + 1 < allNamHocs.size()) {
                                endDate = allNamHocs.get(i + 1).getNgayBatDau().atStartOfDay();
                            }
                            break;
                        }
                    }
                    
                    predicates.add(cb.greaterThanOrEqualTo(root.get("ngayTao"), startDate));
                    if (endDate != null) {
                        predicates.add(cb.lessThan(root.get("ngayTao"), endDate));
                    }
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return phieuHoTroRepository.findAll(spec, pageable).map(phieuHoTroMapper::toResponse);
    }

    public PhieuHoTroResponse getById(Long id) {
        PhieuHoTro phieuHoTro = phieuHoTroRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.PHIEU_HO_TRO_NOT_FOUND));
        return phieuHoTroMapper.toResponse(phieuHoTro);
    }

    @Transactional
    public PhieuHoTroResponse update(Long id, PhieuHoTroRequest request) {
        PhieuHoTro phieuHoTro = phieuHoTroRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.PHIEU_HO_TRO_NOT_FOUND));

        TrangThaiPhieu trangThaiCu = phieuHoTro.getTrangThai();
        phieuHoTroMapper.updatePhieuHoTro(request, phieuHoTro);
        
        if (request.getNguoiDungTaoId() != null) {
            NguoiDung nguoiDungTao = nguoiDungRepository.findById(request.getNguoiDungTaoId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            phieuHoTro.setNguoiDungTao(nguoiDungTao);
        }
        
        if (request.getNguoiDungLienQuanId() != null) {
            NguoiDung nguoiDungLienQuan = nguoiDungRepository.findById(request.getNguoiDungLienQuanId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            phieuHoTro.setNguoiDungLienQuan(nguoiDungLienQuan);
        }

        if (request.getAdminXuLyId() != null) {
            NguoiDung admin = nguoiDungRepository.findById(request.getAdminXuLyId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            phieuHoTro.setAdminXuLy(admin);
        }

        if (request.getTrangThai() != null) {
            phieuHoTro.setTrangThai(request.getTrangThai());
            if (request.getTrangThai() != trangThaiCu && (request.getTrangThai() == TrangThaiPhieu.DA_DUYET || request.getTrangThai() == TrangThaiPhieu.TU_CHOI)) {
                phieuHoTro.setNgayXuLy(LocalDateTime.now());
            }
        }

        PhieuHoTro savedPhieu = phieuHoTroRepository.save(phieuHoTro);

        if (savedPhieu.getTrangThai() != trangThaiCu && (savedPhieu.getTrangThai() == TrangThaiPhieu.DA_DUYET || savedPhieu.getTrangThai() == TrangThaiPhieu.TU_CHOI)) {
            if (savedPhieu.getTrangThai() == TrangThaiPhieu.DA_DUYET && "RESET_MAT_KHAU".equalsIgnoreCase(savedPhieu.getLoaiYeuCau())) {
                resetMatKhauGoc(savedPhieu);
            }
            guiThongBaoXuLyPhieu(savedPhieu);
        }

        return phieuHoTroMapper.toResponse(savedPhieu);
    }

    @Transactional
    public PhieuHoTroResponse xuLyPhieu(Long id, PhieuHoTroRequest request) {
        PhieuHoTro phieuHoTro = phieuHoTroRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.PHIEU_HO_TRO_NOT_FOUND));

        TrangThaiPhieu trangThaiCu = phieuHoTro.getTrangThai();

        if (request.getTrangThai() != null) {
            phieuHoTro.setTrangThai(request.getTrangThai());
            if (request.getTrangThai() != trangThaiCu && (request.getTrangThai() == TrangThaiPhieu.DA_DUYET || request.getTrangThai() == TrangThaiPhieu.TU_CHOI)) {
                phieuHoTro.setNgayXuLy(LocalDateTime.now());
            }
        }

        if (request.getGhiChuXuLy() != null) {
            phieuHoTro.setGhiChuXuLy(request.getGhiChuXuLy());
        }

        if (request.getAdminXuLyId() != null) {
            NguoiDung admin = nguoiDungRepository.findById(request.getAdminXuLyId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            phieuHoTro.setAdminXuLy(admin);
        }

        PhieuHoTro savedPhieu = phieuHoTroRepository.save(phieuHoTro);

        if (savedPhieu.getTrangThai() != trangThaiCu && (savedPhieu.getTrangThai() == TrangThaiPhieu.DA_DUYET || savedPhieu.getTrangThai() == TrangThaiPhieu.TU_CHOI)) {
            if (savedPhieu.getTrangThai() == TrangThaiPhieu.DA_DUYET && "RESET_MAT_KHAU".equalsIgnoreCase(savedPhieu.getLoaiYeuCau())) {
                resetMatKhauGoc(savedPhieu);
            }
            guiThongBaoXuLyPhieu(savedPhieu);
        }

        return phieuHoTroMapper.toResponse(savedPhieu);
    }

    private void resetMatKhauGoc(PhieuHoTro phieuHoTro) {
        NguoiDung nguoiDungReset = phieuHoTro.getNguoiDungLienQuan() != null ? 
                phieuHoTro.getNguoiDungLienQuan() : phieuHoTro.getNguoiDungTao();

        if (nguoiDungReset != null) {
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
            nguoiDungReset.setMatKhauHash(passwordEncoder.encode(defaultResetPassword));
            nguoiDungReset.setBatBuocDoiMk(true);
            nguoiDungRepository.save(nguoiDungReset);

            // Gửi email thông báo mật khẩu mới cho người dùng
            if (nguoiDungReset.getEmail() != null && !nguoiDungReset.getEmail().trim().isEmpty()) {
                
                String tenHienThi = nguoiDungReset.getTenDangNhap();
                if (nguoiDungReset.getHoSoHocSinh() != null) {
                    tenHienThi = nguoiDungReset.getHoSoHocSinh().getHoTen();
                } else if (nguoiDungReset.getHoSoGiaoVien() != null) {
                    tenHienThi = nguoiDungReset.getHoSoGiaoVien().getHoTen();
                } else if (nguoiDungReset.getHoSoPhuHuynh() != null) {
                    tenHienThi = nguoiDungReset.getHoSoPhuHuynh().getHoTen();
                }

                String subject = "[LMS] Thông báo cấp lại mật khẩu mới";
                String content = "Xin chào " + tenHienThi + ",\n\n"
                        + "Yêu cầu cấp lại mật khẩu của bạn đã được Quản trị viên xử lý và phê duyệt thành công.\n"
                        + "Mật khẩu truy cập mới của bạn là: " + defaultResetPassword + "\n\n"
                        + "Vui lòng đăng nhập và bắt buộc đổi lại mật khẩu ngay trong lần đăng nhập đầu tiên để đảm bảo an toàn cho tài khoản.\n\n"
                        + "Trân trọng,\nBan quản trị hệ thống LMS.";
                
                // Gọi EmailService để gửi mail
                try {
                    emailService.sendSimpleEmail(nguoiDungReset.getEmail(), subject, content);
                } catch (Exception e) {
                    System.err.println("Không thể gửi email báo mật khẩu tới " + nguoiDungReset.getEmail() + ": " + e.getMessage());
                }
            }
        }
    }

    private void guiThongBaoXuLyPhieu(PhieuHoTro phieuHoTro) {
        if (phieuHoTro.getNguoiDungTao() == null) return;

        String trangThaiStr = (phieuHoTro.getTrangThai() == TrangThaiPhieu.DA_DUYET) ? "ĐÃ ĐƯỢC DUYỆT" : "TỪ CHỐI";
        String tieuDe = "[Hệ thống] Phiếu hỗ trợ #" + phieuHoTro.getPhieuId() + " (" + phieuHoTro.getLoaiYeuCau() + ") " + trangThaiStr;

        StringBuilder noiDung = new StringBuilder();
        noiDung.append("Yêu cầu hỗ trợ của bạn");
        if (phieuHoTro.getMoTa() != null && !phieuHoTro.getMoTa().trim().isEmpty()) {
            noiDung.append(" (").append(phieuHoTro.getMoTa()).append(")");
        }
        noiDung.append(" đã được BQT xử lý với kết quả: ").append(trangThaiStr).append(".\n");

        if (phieuHoTro.getGhiChuXuLy() != null && !phieuHoTro.getGhiChuXuLy().trim().isEmpty()) {
            noiDung.append("Ghi chú từ BQT: ").append(phieuHoTro.getGhiChuXuLy()).append("\n");
        }

        if (phieuHoTro.getTrangThai() == TrangThaiPhieu.DA_DUYET && "RESET_MAT_KHAU".equalsIgnoreCase(phieuHoTro.getLoaiYeuCau())) {
            noiDung.append("\n⚡ Mật khẩu gốc của tài khoản đã được reset về mặc định là: ").append(defaultResetPassword).append(". Vui lòng đăng nhập và đổi lại mật khẩu ngay lập tức!");
        }

        ThongBaoRequest thongBaoRequest = new ThongBaoRequest();
        if (phieuHoTro.getAdminXuLy() != null) {
            thongBaoRequest.setNguoiGuiId(phieuHoTro.getAdminXuLy().getNguoiDungId());
        }
        thongBaoRequest.setNguoiNhanId(phieuHoTro.getNguoiDungTao().getNguoiDungId());
        thongBaoRequest.setTieuDe(tieuDe);
        thongBaoRequest.setNoiDung(noiDung.toString());
        thongBaoRequest.setLoaiThongBao(LoaiThongBao.HE_THONG);
        thongBaoRequest.setLaGhim(false);

        thongBaoService.create(thongBaoRequest);

        // Nếu có người dùng liên quan và khác với người dùng tạo phiếu -> gửi thêm cho người liên quan
        if (phieuHoTro.getNguoiDungLienQuan() != null && 
            !phieuHoTro.getNguoiDungLienQuan().getNguoiDungId().equals(phieuHoTro.getNguoiDungTao().getNguoiDungId())) {
            ThongBaoRequest reqLienQuan = new ThongBaoRequest();
            if (phieuHoTro.getAdminXuLy() != null) {
                reqLienQuan.setNguoiGuiId(phieuHoTro.getAdminXuLy().getNguoiDungId());
            }
            reqLienQuan.setNguoiNhanId(phieuHoTro.getNguoiDungLienQuan().getNguoiDungId());
            reqLienQuan.setTieuDe(tieuDe);
            reqLienQuan.setNoiDung(noiDung.toString());
            reqLienQuan.setLoaiThongBao(LoaiThongBao.HE_THONG);
            reqLienQuan.setLaGhim(false);
            thongBaoService.create(reqLienQuan);
        }
    }

    public void delete(Long id) {
        if (!phieuHoTroRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.PHIEU_HO_TRO_NOT_FOUND);
        }
        phieuHoTroRepository.deleteById(id);
    }
}
