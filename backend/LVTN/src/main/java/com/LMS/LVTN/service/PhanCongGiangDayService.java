package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.PhanCongGiangDayRequest;
import com.LMS.LVTN.dto.response.PhanCongGiangDayResponse;
import com.LMS.LVTN.entity.*;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.PhanCongGiangDayMapper;
import com.LMS.LVTN.repository.*;
import com.LMS.LVTN.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PhanCongGiangDayService {

    PhanCongGiangDayRepository phanCongGiangDayRepository;
    PhanCongGiangDayMapper phanCongGiangDayMapper;
    HoSoGiaoVienRepository hoSoGiaoVienRepository;
    LopHocRepository lopHocRepository;
    MonHocRepository monHocRepository;
    HocKyRepository hocKyRepository;
    CauHinhHeThongRepository cauHinhHeThongRepository;

    private HocKy getHocKyHienTaiTuCauHinh() {
        return cauHinhHeThongRepository.findById((short) 1)
                .map(CauHinhHeThong::getHocKyHienTai)
                .orElse(null);
    }

    @Transactional
    public PhanCongGiangDayResponse create(PhanCongGiangDayRequest request) {
        PhanCongGiangDay phanCong = phanCongGiangDayMapper.toEntity(request);

        if (request.getGiaoVienId() != null) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            phanCong.setGiaoVien(giaoVien);
        }

        if (request.getLopHocId() != null) {
            LopHoc lopHoc = lopHocRepository.findById(request.getLopHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            phanCong.setLopHoc(lopHoc);
        }

        if (request.getMonHocId() != null) {
            MonHoc monHoc = monHocRepository.findById(request.getMonHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            phanCong.setMonHoc(monHoc);
        }

        if (request.getHocKyId() != null) {
            HocKy hocKy = hocKyRepository.findById(request.getHocKyId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HOC_KY_NOT_FOUND));
            phanCong.setHocKy(hocKy);
        }

        return phanCongGiangDayMapper.toResponse(phanCongGiangDayRepository.save(phanCong));
    }

    public List<PhanCongGiangDayResponse> getAll(Integer hocKyId) {
        Integer finalHocKyId = hocKyId;
        if (finalHocKyId == null) {
            HocKy currentHocKy = getHocKyHienTaiTuCauHinh();
            if (currentHocKy != null) {
                finalHocKyId = currentHocKy.getHocKyId();
            }
        }
        if (finalHocKyId != null) {
            return phanCongGiangDayRepository.findByHocKy_HocKyId(finalHocKyId).stream()
                    .map(phanCongGiangDayMapper::toResponse)
                    .collect(Collectors.toList());
        }
        return phanCongGiangDayRepository.findAll().stream()
                .map(phanCongGiangDayMapper::toResponse)
                .collect(Collectors.toList());
    }

    public PhanCongGiangDayResponse getById(Long id) {
        PhanCongGiangDay phanCong = phanCongGiangDayRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return phanCongGiangDayMapper.toResponse(phanCong);
    }

    @Transactional
    public PhanCongGiangDayResponse update(Long id, PhanCongGiangDayRequest request) {
        PhanCongGiangDay phanCong = phanCongGiangDayRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        phanCongGiangDayMapper.updatePhanCongGiangDay(request, phanCong);

        if (request.getGiaoVienId() != null) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            phanCong.setGiaoVien(giaoVien);
        }

        if (request.getLopHocId() != null) {
            LopHoc lopHoc = lopHocRepository.findById(request.getLopHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            phanCong.setLopHoc(lopHoc);
        }

        if (request.getMonHocId() != null) {
            MonHoc monHoc = monHocRepository.findById(request.getMonHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            phanCong.setMonHoc(monHoc);
        }

        if (request.getHocKyId() != null) {
            HocKy hocKy = hocKyRepository.findById(request.getHocKyId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HOC_KY_NOT_FOUND));
            phanCong.setHocKy(hocKy);
        }

        return phanCongGiangDayMapper.toResponse(phanCongGiangDayRepository.save(phanCong));
    }

    @Transactional
    public void delete(Long id) {
        if (!phanCongGiangDayRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        phanCongGiangDayRepository.deleteById(id);
    }

    public List<PhanCongGiangDayResponse> getByGiaoVienId(Long giaoVienId, Integer hocKyId) {
        Integer finalHocKyId = hocKyId;
        if (finalHocKyId == null) {
            HocKy currentHocKy = getHocKyHienTaiTuCauHinh();
            if (currentHocKy != null) {
                finalHocKyId = currentHocKy.getHocKyId();
            }
        }
        if (finalHocKyId != null) {
            return phanCongGiangDayRepository.findByGiaoVien_GiaoVienIdAndHocKy_HocKyId(giaoVienId, finalHocKyId).stream()
                    .map(phanCongGiangDayMapper::toResponse)
                    .collect(Collectors.toList());
        }
        return phanCongGiangDayRepository.findByGiaoVien_GiaoVienId(giaoVienId).stream()
                .map(phanCongGiangDayMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<PhanCongGiangDayResponse> getByLopHocId(Long lopHocId, Integer hocKyId) {
        Integer finalHocKyId = hocKyId;
        if (finalHocKyId == null) {
            HocKy currentHocKy = getHocKyHienTaiTuCauHinh();
            if (currentHocKy != null) {
                finalHocKyId = currentHocKy.getHocKyId();
            }
        }
        if (finalHocKyId != null) {
            return phanCongGiangDayRepository.findByLopHoc_LopHocIdAndHocKy_HocKyId(lopHocId, finalHocKyId).stream()
                    .map(phanCongGiangDayMapper::toResponse)
                    .collect(Collectors.toList());
        }
        return phanCongGiangDayRepository.findByLopHoc_LopHocId(lopHocId).stream()
                .map(phanCongGiangDayMapper::toResponse)
                .collect(Collectors.toList());
    }
}
