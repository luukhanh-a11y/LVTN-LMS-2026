package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.ChiTietBaiTapRequest;
import com.LMS.LVTN.dto.response.ChiTietBaiTapResponse;
import com.LMS.LVTN.entity.BaiTap;
import com.LMS.LVTN.entity.ChiTietBaiTap;
import com.LMS.LVTN.entity.DangBai;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.ChiTietBaiTapMapper;
import com.LMS.LVTN.repository.BaiTapRepository;
import com.LMS.LVTN.repository.ChiTietBaiTapRepository;
import com.LMS.LVTN.repository.DangBaiRepository;
import com.LMS.LVTN.validation.NoiDungSgkValidator;
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
public class ChiTietBaiTapService {

    ChiTietBaiTapRepository chiTietBaiTapRepository;
    BaiTapRepository baiTapRepository;
    DangBaiRepository dangBaiRepository;
    ChiTietBaiTapMapper chiTietBaiTapMapper;
    NoiDungSgkValidator noiDungSgkValidator;

    @Transactional
    public ChiTietBaiTapResponse create(ChiTietBaiTapRequest request) {
        if (request.getBaiTapId() == null || request.getDangBaiId() == null) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }

        noiDungSgkValidator.validateKhongPhaiSgk(request.getDangBaiId());

        BaiTap baiTap = baiTapRepository.findById(request.getBaiTapId())
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        DangBai dangBai = dangBaiRepository.findById(request.getDangBaiId())
                .orElseThrow(() -> new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND));

        ChiTietBaiTap entity = chiTietBaiTapMapper.toEntity(request);
        entity.setBaiTap(baiTap);
        entity.setDangBai(dangBai);

        ChiTietBaiTap saved = chiTietBaiTapRepository.save(entity);
        return chiTietBaiTapMapper.toResponse(saved);
    }

    public List<ChiTietBaiTapResponse> getAll() {
        return chiTietBaiTapRepository.findAll().stream()
                .map(chiTietBaiTapMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ChiTietBaiTapResponse getById(Long id) {
        ChiTietBaiTap entity = chiTietBaiTapRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return chiTietBaiTapMapper.toResponse(entity);
    }

    public List<ChiTietBaiTapResponse> getByBaiTapId(Long baiTapId) {
        return chiTietBaiTapRepository.findByBaiTap_BaiTapIdOrderByThuTuAsc(baiTapId).stream()
                .map(chiTietBaiTapMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ChiTietBaiTapResponse> getByDangBaiId(Integer dangBaiId) {
        return chiTietBaiTapRepository.findByDangBai_DangBaiId(dangBaiId).stream()
                .map(chiTietBaiTapMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChiTietBaiTapResponse update(Long id, ChiTietBaiTapRequest request) {
        ChiTietBaiTap entity = chiTietBaiTapRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        BaiTap baiTap = null;
        if (request.getBaiTapId() != null) {
            baiTap = baiTapRepository.findById(request.getBaiTapId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        }

        DangBai dangBai = null;
        if (request.getDangBaiId() != null) {
            noiDungSgkValidator.validateKhongPhaiSgk(request.getDangBaiId());
            dangBai = dangBaiRepository.findById(request.getDangBaiId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND));
        }

        chiTietBaiTapMapper.updateChiTietBaiTap(request, entity);
        if (baiTap != null) entity.setBaiTap(baiTap);
        if (dangBai != null) entity.setDangBai(dangBai);

        ChiTietBaiTap saved = chiTietBaiTapRepository.save(entity);
        return chiTietBaiTapMapper.toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!chiTietBaiTapRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        chiTietBaiTapRepository.deleteById(id);
    }
}
