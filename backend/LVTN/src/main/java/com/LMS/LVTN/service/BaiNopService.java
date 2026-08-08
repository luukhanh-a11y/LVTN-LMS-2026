package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.BaiNopRequest;
import com.LMS.LVTN.dto.response.BaiNopResponse;
import com.LMS.LVTN.entity.*;
import com.LMS.LVTN.enums.HanhDongDanhGia;
import com.LMS.LVTN.enums.LoaiBaiTap;
import com.LMS.LVTN.enums.TrangThaiBaiNop;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.BaiNopMapper;
import com.LMS.LVTN.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BaiNopService {

    BaiNopRepository baiNopRepository;
    BaiNopMapper baiNopMapper;
    BaiTapRepository baiTapRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    DanhGiaBaiLamRepository danhGiaBaiLamRepository;

    ChiTietBaiTapRepository chiTietBaiTapRepository;
    GameService gameService;
    ObjectMapper objectMapper;

    @Transactional
    public BaiNopResponse create(BaiNopRequest request) {
        if (request.getBaiTapId() == null || request.getHocSinhId() == null) {
            throw new AppExceptions(Errorcode.INVALID_DATA);
        }

        BaiTap baiTap = baiTapRepository.findById(request.getBaiTapId())
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        if (baiTap.getThoiDiemBatDau() != null && LocalDateTime.now().isBefore(baiTap.getThoiDiemBatDau())) {
            throw new AppExceptions(Errorcode.BAI_TAP_CHUA_MO);
        }

        long soLanDaLam = baiNopRepository.countByBaiTap_BaiTapIdAndHocSinh_HocSinhId(baiTap.getBaiTapId(), hocSinh.getHocSinhId());
        if (baiTap.getSoLanNopLaiToiDa() != null && baiTap.getSoLanNopLaiToiDa() != -1) {
            long soLuotYeuCauLamLai = danhGiaBaiLamRepository.countByBaiNop_BaiTap_BaiTapIdAndBaiNop_HocSinh_HocSinhIdAndHanhDong(
                    baiTap.getBaiTapId(), hocSinh.getHocSinhId(), HanhDongDanhGia.YC_LAM_LAI);
            long tongSoLanChoPhep = 1 + (baiTap.getSoLanNopLaiToiDa() > 0 ? baiTap.getSoLanNopLaiToiDa() : 0) + soLuotYeuCauLamLai;
            if (soLanDaLam >= tongSoLanChoPhep) {
                throw new AppExceptions(Errorcode.VUOT_QUA_SO_LAN_NOP_TOI_DA);
            }
        }

        BaiNop baiNop = baiNopMapper.toEntity(request);
        baiNop.setBaiTap(baiTap);
        baiNop.setHocSinh(hocSinh);
        baiNop.setSoLanLam((short) (soLanDaLam + 1));
        baiNop.setThoiDiemNop(LocalDateTime.now());
        baiNop.setLaNopTre(baiTap.getDeadline() != null && baiNop.getThoiDiemNop().isAfter(baiTap.getDeadline()));

        if (baiTap.getLoaiBaiTap() == LoaiBaiTap.TU_LUAN || baiTap.getLoaiBaiTap() == LoaiBaiTap.H5P) {
            baiNop.setDiemTuDong(null);
            baiNop.setTrangThai(TrangThaiBaiNop.CHUA_CHAM);
            baiNop.setXpNhanDuoc((short) 0);
        } else {
            baiNop.setTrangThai(TrangThaiBaiNop.DA_CHAM);
            if (baiNop.getChiTietBaiLam() != null && !baiNop.getChiTietBaiLam().isEmpty()) {
                try {
                    List<ChiTietBaiTap> chiTietList = chiTietBaiTapRepository.findByBaiTap_BaiTapIdOrderByThuTuAsc(baiTap.getBaiTapId());
                    if (chiTietList != null && !chiTietList.isEmpty()) {
                       JsonNode baiLamNode = objectMapper.readTree(baiNop.getChiTietBaiLam());
                       JsonNode mapBaiLam = baiLamNode.has("dapAnHocSinh") ? baiLamNode.get("dapAnHocSinh") : (baiLamNode.has("baiLamNhieuCau") ? baiLamNode.get("baiLamNhieuCau") : baiLamNode);

                        BigDecimal tongDiem = BigDecimal.ZERO;
                        for (ChiTietBaiTap ct : chiTietList) {
                            String idCauHoi = ct.getDangBai().getDangBaiId().toString();
                            String dapAnChuan = ct.getDangBai().getDapAnChuan();
                            JsonNode baiLamItem = (mapBaiLam != null && mapBaiLam.has(idCauHoi)) ? mapBaiLam.get(idCauHoi) : null;
                            String subBaiLamJson = (baiLamItem != null) ? (baiLamItem.isTextual() ? "{\"dapAnDungId\":\"" + baiLamItem.asText() + "\"}" : baiLamItem.toString()) : "{}";
                            BigDecimal diemSub = gameService.chamDiem(dapAnChuan, subBaiLamJson);
                            tongDiem = tongDiem.add(diemSub);
                        }
                        BigDecimal diem = tongDiem.divide(new BigDecimal(chiTietList.size()), 2, RoundingMode.HALF_UP);
                        baiNop.setDiemTuDong(diem);
                    } else if (baiTap.getDangBai() != null && baiTap.getDangBai().getDapAnChuan() != null) {
                        BigDecimal diem = gameService.chamDiem(baiTap.getDangBai().getDapAnChuan(), baiNop.getChiTietBaiLam());
                        baiNop.setDiemTuDong(diem);
                    }
                } catch (Exception e) {
                    // Log warning and proceed
                }
            }
            if (baiNop.getDiemTuDong() == null) {
                baiNop.setDiemTuDong(BigDecimal.ZERO);
            }
            short xp = (short) (baiNop.getDiemTuDong().doubleValue() * 10);
            baiNop.setXpNhanDuoc(xp > 0 ? xp : (short) 0);
        }

        BaiNop savedBaiNop = baiNopRepository.save(baiNop);
        
        // Cập nhật tổng XP trong HoSoHocSinh thay vì gọi huyHieuEvaluationService
        if (savedBaiNop.getHocSinh() != null && savedBaiNop.getXpNhanDuoc() != null && savedBaiNop.getXpNhanDuoc() > 0) {
            HoSoHocSinh hs = savedBaiNop.getHocSinh();
            int tongXp = (hs.getTongXp() != null ? hs.getTongXp() : 0) + savedBaiNop.getXpNhanDuoc();
            hs.setTongXp(tongXp);
            hoSoHocSinhRepository.save(hs);
        }

        return baiNopMapper.toResponse(savedBaiNop);
    }

    public List<BaiNopResponse> getAll() {
        return baiNopRepository.findAll().stream()
                .map(baiNopMapper::toResponse)
                .collect(Collectors.toList());
    }

    public BaiNopResponse getById(Long id) {
        BaiNop baiNop = baiNopRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return baiNopMapper.toResponse(baiNop);
    }

    @Transactional
    public BaiNopResponse update(Long id, BaiNopRequest request) {
        BaiNop baiNop = baiNopRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        baiNopMapper.updateBaiNop(request, baiNop);

        return baiNopMapper.toResponse(baiNopRepository.save(baiNop));
    }

    @Transactional
    public void delete(Long id) {
        if (!baiNopRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        baiNopRepository.deleteById(id);
    }

    public List<BaiNopResponse> getByBaiTapId(Long baiTapId) {
        return baiNopRepository.findByBaiTap_BaiTapId(baiTapId).stream()
                .map(baiNopMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<BaiNopResponse> getByHocSinhId(Long hocSinhId) {
        return baiNopRepository.findByHocSinh_HocSinhId(hocSinhId).stream()
                .map(baiNopMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<BaiNopResponse> getAllBaiNopByBaiTapIdAndLopId(Long baiTapId, Long lopId) {
        return baiNopRepository.findByBaiTap_BaiTapIdAndHocSinh_LopHoc_LopHocId(baiTapId, lopId).stream()
                .map(baiNopMapper::toResponse)
                .collect(Collectors.toList());
    }
}
