package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.HocKyRequest;
import com.LMS.LVTN.dto.response.HocKyResponse;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.entity.NamHoc;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.HocKyMapper;
import com.LMS.LVTN.repository.HocKyRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class HocKyService {
    HocKyRepository hocKyRepository;
    HocKyMapper hocKyMapper;
    com.LMS.LVTN.repository.NamHocRepository namHocRepository;

    @Transactional
    public HocKyResponse create(HocKyRequest request) {
       HocKy hocKy = hocKyMapper.toEntity(request);

        if (request.getNamHocId() != null) {
           NamHoc namHoc = namHocRepository.findById(request.getNamHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.NAM_HOC_NOT_FOUND));
            hocKy.setNamHoc(namHoc);
        }

        return hocKyMapper.toResponse(hocKyRepository.save(hocKy));
    }

    public List<HocKyResponse> getAll() {
        return hocKyRepository.findAll().stream()
                .map(hocKyMapper::toResponse)
                .collect(Collectors.toList());
    }

    public HocKyResponse getById(Integer id) {
        HocKy hocKy = hocKyRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return hocKyMapper.toResponse(hocKy);
    }

    @Transactional
    public HocKyResponse update(Integer id, HocKyRequest request) {
       HocKy hocKy = hocKyRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        hocKyMapper.updateHocKy(request, hocKy);

        if (request.getNamHocId() != null) {
            NamHoc namHoc = namHocRepository.findById(request.getNamHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.NAM_HOC_NOT_FOUND));
            hocKy.setNamHoc(namHoc);
        }

        return hocKyMapper.toResponse(hocKyRepository.save(hocKy));
    }

    @Transactional
    public void delete(Integer id) {
        if (!hocKyRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        hocKyRepository.deleteById(id);
    }}
