package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.BaiTapRequest;
import com.LMS.LVTN.dto.response.BaiTapResponse;
import com.LMS.LVTN.entity.*;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.BaiTapMapper;
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
public class BaiTapService {

    BaiTapRepository baiTapRepository;
    BaiTapMapper baiTapMapper;
    HoSoGiaoVienRepository hoSoGiaoVienRepository;
    LopHocRepository lopHocRepository;
    DangBaiRepository dangBaiRepository;
    HocKyRepository hocKyRepository;

    @Transactional
    public BaiTapResponse create(BaiTapRequest request) {
        BaiTap baiTap = baiTapMapper.toEntity(request);

        if (request.getGiaoVienId() != null) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            baiTap.setGiaoVien(giaoVien);
        }

        if (request.getLopHocId() != null) {
            LopHoc lopHoc = lopHocRepository.findById(request.getLopHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            baiTap.setLopHoc(lopHoc);
        }

        if (request.getDangBaiId() != null) {
            DangBai dangBai = dangBaiRepository.findById(request.getDangBaiId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND));
            baiTap.setDangBai(dangBai);
        }

        if (request.getHocKyId() != null) {
            HocKy hocKy = hocKyRepository.findById(request.getHocKyId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HOC_KY_NOT_FOUND));
            baiTap.setHocKy(hocKy);
        }

        return baiTapMapper.toResponse(baiTapRepository.save(baiTap));
    }

    public List<BaiTapResponse> getAll() {
        return baiTapRepository.findAll().stream()
                .map(baiTapMapper::toResponse)
                .collect(Collectors.toList());
    }

    public BaiTapResponse getById(Long id) {
        BaiTap baiTap = baiTapRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return baiTapMapper.toResponse(baiTap);
    }

    @Transactional
    public BaiTapResponse update(Long id, BaiTapRequest request) {
        BaiTap baiTap = baiTapRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        baiTapMapper.updateBaiTap(request, baiTap);

        if (request.getGiaoVienId() != null) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            baiTap.setGiaoVien(giaoVien);
        }

        if (request.getLopHocId() != null) {
            LopHoc lopHoc = lopHocRepository.findById(request.getLopHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            baiTap.setLopHoc(lopHoc);
        }

        if (request.getDangBaiId() != null) {
            DangBai dangBai = dangBaiRepository.findById(request.getDangBaiId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND));
            baiTap.setDangBai(dangBai);
        }

        if (request.getHocKyId() != null) {
            HocKy hocKy = hocKyRepository.findById(request.getHocKyId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HOC_KY_NOT_FOUND));
            baiTap.setHocKy(hocKy);
        }

        return baiTapMapper.toResponse(baiTapRepository.save(baiTap));
    }

    @Transactional
    public void delete(Long id) {
        if (!baiTapRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        baiTapRepository.deleteById(id);
    }

    public List<BaiTapResponse> getByLopHocId(Long lopHocId) {
        return baiTapRepository.findByLopHoc_LopHocId(lopHocId).stream()
                .map(baiTapMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<BaiTapResponse> getByGiaoVienId(Long giaoVienId) {
        return baiTapRepository.findByGiaoVien_GiaoVienId(giaoVienId).stream()
                .map(baiTapMapper::toResponse)
                .collect(Collectors.toList());
    }
}
