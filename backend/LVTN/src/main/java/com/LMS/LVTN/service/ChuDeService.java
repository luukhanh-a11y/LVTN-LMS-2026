package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.ChuDeRequest;
import com.LMS.LVTN.dto.response.ChuDeResponse;
import com.LMS.LVTN.entity.ChuDe;
import com.LMS.LVTN.entity.Sach;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.ChuDeMapper;
import com.LMS.LVTN.repository.ChuDeRepository;
import com.LMS.LVTN.repository.SachRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChuDeService {

    ChuDeRepository chuDeRepository;
    ChuDeMapper chuDeMapper;
    SachRepository sachRepository;



    public ChuDeResponse create(ChuDeRequest request) {
        ChuDe chuDe = chuDeMapper.toEntity(request);
        
        if (request.getSachId() != null) {
            Sach sach = sachRepository.findById(request.getSachId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.SACH_NOT_FOUND));
            chuDe.setSach(sach);
        }
        
        return chuDeMapper.toResponse(chuDeRepository.save(chuDe));
    }

    public List<ChuDeResponse> getAll() {
        return chuDeRepository.findAll().stream()
                .map(chuDeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ChuDeResponse> getBySachId(Integer sachId) {
        return chuDeRepository.findBySach_SachId(sachId).stream()
                .map(chuDeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ChuDeResponse getById(Integer id) {
        ChuDe chuDe = chuDeRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.CHU_DE_NOT_FOUND));
        return chuDeMapper.toResponse(chuDe);
    }

    public ChuDeResponse update(Integer id, ChuDeRequest request) {
        ChuDe chuDe = chuDeRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.CHU_DE_NOT_FOUND));

        chuDeMapper.updateChuDe(request, chuDe);
        
        if (request.getSachId() != null) {
            Sach sach = sachRepository.findById(request.getSachId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.SACH_NOT_FOUND));
            chuDe.setSach(sach);
        }

        return chuDeMapper.toResponse(chuDeRepository.save(chuDe));
    }

    public void delete(Integer id) {
        if (!chuDeRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.CHU_DE_NOT_FOUND);
        }

        chuDeRepository.deleteAllByChuDeId(id);
        chuDeRepository.deleteById(id);
    }
}
