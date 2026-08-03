package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.KhenThuongHocSinhRequest;
import com.LMS.LVTN.dto.response.KhenThuongHocSinhResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.HuyHieu;
import com.LMS.LVTN.entity.KhenThuongHocSinh;
import com.LMS.LVTN.enums.NguonCap;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.KhenThuongHocSinhMapper;
import com.LMS.LVTN.repository.HoSoGiaoVienRepository;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.HuyHieuRepository;
import com.LMS.LVTN.repository.KhenThuongHocSinhRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KhenThuongHocSinhService {

    KhenThuongHocSinhRepository khenThuongHocSinhRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    HuyHieuRepository huyHieuRepository;
    HoSoGiaoVienRepository hoSoGiaoVienRepository;
    AuthenticationService authenticationService;
    KhenThuongHocSinhMapper mapper;

    @Transactional
    public KhenThuongHocSinhResponse tangHuyHieuThuCong(String token, KhenThuongHocSinhRequest request) {
        try {
            // 1. Lấy thông tin người tặng từ Token
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            
            // Giả định giáo viên tặng có HoSoGiaoVien tương ứng với NguoiDungId
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findByNguoiDung_NguoiDungId(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

            // 2. Kiểm tra học sinh
            HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND)); // Nên có mã lỗi riêng cho HS

            HuyHieu huyHieu = huyHieuRepository.findById(request.getHuyHieuId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
                    
            if (huyHieu.getLoai() != com.LMS.LVTN.enums.LoaiHuyHieu.THU_CONG) {
                throw new AppExceptions(Errorcode.INVALID_DATA); // Chỉ được tặng huy hiệu thủ công
            }

            // 4. Tạo bản ghi khen thưởng
            KhenThuongHocSinh khenThuong = new KhenThuongHocSinh();
            khenThuong.setHocSinh(hocSinh);
            khenThuong.setHuyHieu(huyHieu);
            khenThuong.setGiaoVien(giaoVien);
            khenThuong.setThuKhen(request.getThuKhen());
            khenThuong.setNguonCap(NguonCap.THU_CONG);
            
            KhenThuongHocSinh saved = khenThuongHocSinhRepository.save(khenThuong);
            
            // 5. TODO: Tạo ThongBao (Public) để báo cho cả lớp hoặc Phụ huynh biết

            return mapper.toResponse(saved);

        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }

    public List<KhenThuongHocSinhResponse> getAllKhenThuong() {
        return khenThuongHocSinhRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    public KhenThuongHocSinhResponse getKhenThuongById(Long id) {
        KhenThuongHocSinh khenThuong = khenThuongHocSinhRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return mapper.toResponse(khenThuong);
    }

    public List<KhenThuongHocSinhResponse> getKhenThuongByHocSinh(Long hocSinhId) {
        return khenThuongHocSinhRepository.findByHocSinh_HocSinhId(hocSinhId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public KhenThuongHocSinhResponse updateKhenThuong(Long id, KhenThuongHocSinhRequest request) {
        KhenThuongHocSinh khenThuong = khenThuongHocSinhRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        if (request.getThuKhen() != null) {
            khenThuong.setThuKhen(request.getThuKhen());
        }

        return mapper.toResponse(khenThuongHocSinhRepository.save(khenThuong));
    }

    @Transactional
    public void deleteKhenThuong(Long id) {
        if (!khenThuongHocSinhRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        khenThuongHocSinhRepository.deleteById(id);
    }
}
