package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.HuyHieuRequest;
import com.LMS.LVTN.dto.response.HuyHieuResponse;
import com.LMS.LVTN.entity.HuyHieu;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.HuyHieuMapper;
import com.LMS.LVTN.repository.HuyHieuRepository;
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
public class HuyHieuService {
    
    HuyHieuMapper huyHieuMapper;
    HuyHieuRepository huyHieuRepository;

    @Transactional
    public HuyHieuResponse create(HuyHieuRequest request) {
        HuyHieu huyHieu = huyHieuMapper.toEntity(request);
        return huyHieuMapper.toResponse(huyHieuRepository.save(huyHieu));
    }

    public List<HuyHieuResponse> getAll() {
        return huyHieuRepository.findAll().stream()
                .map(huyHieuMapper::toResponse)
                .collect(Collectors.toList());
    }

    public HuyHieuResponse getById(Integer id) {
        HuyHieu huyHieu = huyHieuRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return huyHieuMapper.toResponse(huyHieu);
    }

    @Transactional
    public HuyHieuResponse update(Integer id, HuyHieuRequest request) {
        HuyHieu huyHieu = huyHieuRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        huyHieuMapper.updateHuyHieu(request, huyHieu);
        return huyHieuMapper.toResponse(huyHieuRepository.save(huyHieu));
    }

    @Transactional
    public void delete(Integer id) {
        if (!huyHieuRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        huyHieuRepository.deleteById(id);
    }
}
