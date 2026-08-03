package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.response.HopThuThongBaoResponse;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.ThongBao;
import com.LMS.LVTN.entity.HopThuThongBao;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.HopThuThongBaoMapper;
import com.LMS.LVTN.repository.NguoiDungRepository;
import com.LMS.LVTN.repository.ThongBaoRepository;
import com.LMS.LVTN.repository.HopThuThongBaoRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HopThuThongBaoService {

    HopThuThongBaoRepository HopThuThongBaoRepository;
    ThongBaoRepository thongBaoRepository;
    NguoiDungRepository nguoiDungRepository;
    AuthenticationService authenticationService;
    HopThuThongBaoMapper mapper;

    @Transactional(readOnly = true)
    public List<HopThuThongBaoResponse> getAllByNguoiDungId(String nguoiDungId) {
        if (!nguoiDungRepository.existsById(nguoiDungId))
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        return HopThuThongBaoRepository
                .findByNguoiDung_NguoiDungIdOrderByThongBao_LaGhimDescThongBao_NgayDangDesc(nguoiDungId)
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HopThuThongBaoResponse> getAllGhimByNguoiDungId(String nguoiDungId) {
        if (!nguoiDungRepository.existsById(nguoiDungId))
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        return HopThuThongBaoRepository
                .findByNguoiDung_NguoiDungIdAndThongBao_LaGhimTrueOrderByThongBao_NgayDangDesc(nguoiDungId)
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HopThuThongBaoResponse> getAllNotGhimByNguoiDungId(String nguoiDungId) {
        if (!nguoiDungRepository.existsById(nguoiDungId))
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        return HopThuThongBaoRepository
                .findByNguoiDung_NguoiDungIdAndThongBao_LaGhimFalseOrderByThongBao_NgayDangDesc(nguoiDungId)
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public HopThuThongBaoResponse markAsRead(String token, Long thongBaoId) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);

            HopThuThongBao trangThai = HopThuThongBaoRepository
                    .findByNguoiDung_NguoiDungIdAndThongBao_ThongBaoId(nguoiDungId, thongBaoId)
                    .orElseGet(() -> {
                        HopThuThongBao newTrangThai = new HopThuThongBao();
                        
                        NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
                                
                        ThongBao thongBao = thongBaoRepository.findById(thongBaoId)
                                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_EXISTED)); // Replace with correct error code later
                                
                        newTrangThai.setNguoiDung(nguoiDung);
                        newTrangThai.setThongBao(thongBao);
                        return newTrangThai;
                    });

            trangThai.setDaDoc(true);
            trangThai.setThoiDiemDoc(LocalDateTime.now());
            
            return mapper.toResponse(HopThuThongBaoRepository.save(trangThai));
            
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }
}

