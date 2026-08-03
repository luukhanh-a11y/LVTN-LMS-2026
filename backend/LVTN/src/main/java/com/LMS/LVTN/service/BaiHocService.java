package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.BaiHocRequest;
import com.LMS.LVTN.dto.response.BaiHocResponse;
import com.LMS.LVTN.entity.BaiHoc;
import com.LMS.LVTN.entity.ChuDe;
import com.LMS.LVTN.entity.DangBai;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.BaiHocMapper;
import com.LMS.LVTN.repository.BaiHocRepository;
import com.LMS.LVTN.repository.ChuDeRepository;
import com.LMS.LVTN.repository.DangBaiRepository;
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
public class BaiHocService {

    BaiHocRepository baiHocRepository;
    BaiHocMapper baiHocMapper;
    ChuDeRepository chuDeRepository;
    DangBaiService dangBaiService;
    DangBaiRepository dangBaiRepository;
    public BaiHocResponse create(BaiHocRequest request) {
        BaiHoc baiHoc = baiHocMapper.toEntity(request);
        
        if (request.getChuDeId() == null) {
            throw new AppExceptions(Errorcode.CHU_DE_NOT_FOUND);
        }
        
        ChuDe chuDe = chuDeRepository.findById(request.getChuDeId())
                .orElseThrow(() -> new AppExceptions(Errorcode.CHU_DE_NOT_FOUND));
        baiHoc.setChuDe(chuDe);
        
        return baiHocMapper.toResponse(baiHocRepository.save(baiHoc));
    }

    public List<BaiHocResponse> getAll() {
        return baiHocRepository.findAll().stream()
                .map(baiHocMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<BaiHocResponse> getByChuDeId(Integer chuDeId) {
        return baiHocRepository.findByChuDe_ChuDeId(chuDeId).stream()
                .map(baiHocMapper::toResponse)
                .collect(Collectors.toList());
    }

    public BaiHocResponse getById(Integer id) {
        BaiHoc baiHoc = baiHocRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.BAI_HOC_NOT_FOUND));
        return baiHocMapper.toResponse(baiHoc);
    }

    public BaiHocResponse update(Integer id, BaiHocRequest request) {
        BaiHoc baiHoc = baiHocRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.BAI_HOC_NOT_FOUND));

        baiHocMapper.updateBaiHoc(request, baiHoc);
        
        if (request.getChuDeId() == null) {
            throw new AppExceptions(Errorcode.CHU_DE_NOT_FOUND);
        }
        
        ChuDe chuDe = chuDeRepository.findById(request.getChuDeId())
                .orElseThrow(() -> new AppExceptions(Errorcode.CHU_DE_NOT_FOUND));
        baiHoc.setChuDe(chuDe);

        return baiHocMapper.toResponse(baiHocRepository.save(baiHoc));
    }

    @Transactional
    public void delete(Integer id) {
        BaiHoc baiHoc = baiHocRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.BAI_HOC_NOT_FOUND));

        baiHocRepository.deleteAllByBaiHocId(id);
        baiHocRepository.deleteById(id);
    }
}
