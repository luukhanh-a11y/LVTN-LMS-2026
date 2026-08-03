package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.BaiNopRequest;
import com.LMS.LVTN.dto.response.BaiNopResponse;
import com.LMS.LVTN.entity.*;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.BaiNopMapper;
import com.LMS.LVTN.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    HuyHieuEvaluationService huyHieuEvaluationService;

    @Transactional
    public BaiNopResponse create(BaiNopRequest request) {
        BaiNop baiNop = baiNopMapper.toEntity(request);

        if (baiNop.getSoLanLam() == null) {
            baiNop.setSoLanLam((short) 1);
        }
        if (baiNop.getXpNhanDuoc() == null) {
            baiNop.setXpNhanDuoc((short) 0);
        }
        if (baiNop.getLaNopTre() == null) {
            baiNop.setLaNopTre(false);
        }

        if (request.getBaiTapId() != null) {
            BaiTap baiTap = baiTapRepository.findById(request.getBaiTapId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            baiNop.setBaiTap(baiTap);
            
            // Check deadline
            if (baiTap.getDeadline() != null && LocalDateTime.now().isAfter(baiTap.getDeadline())) {
                baiNop.setLaNopTre(true);
            }
        }

        if (request.getHocSinhId() != null) {
            HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            baiNop.setHocSinh(hocSinh);
        }

        if (baiNop.getThoiDiemNop() == null) {
            baiNop.setThoiDiemNop(LocalDateTime.now());
        }

        BaiNop savedBaiNop = baiNopRepository.save(baiNop);
        
        // Kích hoạt kiểm tra huy hiệu sau khi nộp bài
        if (savedBaiNop.getHocSinh() != null) {
            huyHieuEvaluationService.evaluate(savedBaiNop.getHocSinh().getHocSinhId());
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

        if (baiNop.getSoLanLam() == null) {
            baiNop.setSoLanLam((short) 1);
        }
        if (baiNop.getXpNhanDuoc() == null) {
            baiNop.setXpNhanDuoc((short) 0);
        }
        if (baiNop.getLaNopTre() == null) {
            baiNop.setLaNopTre(false);
        }

        if (request.getBaiTapId() != null) {
            BaiTap baiTap = baiTapRepository.findById(request.getBaiTapId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            baiNop.setBaiTap(baiTap);
        }

        if (request.getHocSinhId() != null) {
            HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            baiNop.setHocSinh(hocSinh);
        }

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
}
