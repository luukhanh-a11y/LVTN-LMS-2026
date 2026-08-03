package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.SachRequest;
import com.LMS.LVTN.dto.response.SachResponse;
import com.LMS.LVTN.entity.MonHoc;
import com.LMS.LVTN.entity.Sach;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.SachMapper;
import com.LMS.LVTN.repository.MonHocRepository;
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
public class SachService {

    SachRepository sachRepository;
    SachMapper sachMapper;
    MonHocRepository monHocRepository;

    public SachResponse create(SachRequest request) {
        Sach sach = sachMapper.toEntity(request);
        
        if (request.getMonHocId() != null) {
            MonHoc monHoc = monHocRepository.findById(request.getMonHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.MON_HOC_NOT_FOUND));
            sach.setMonHoc(monHoc);
        }
        
        return sachMapper.toResponse(sachRepository.save(sach));
    }

    public List<SachResponse> getAll() {
        return sachRepository.findAll().stream()
                .map(sachMapper::toResponse)
                .collect(Collectors.toList());
    }

    public SachResponse getById(Integer id) {
        Sach sach = sachRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.SACH_NOT_FOUND));
        return sachMapper.toResponse(sach);
    }

    public SachResponse update(Integer id, SachRequest request) {
        Sach sach = sachRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.SACH_NOT_FOUND));

        sachMapper.updateSach(request, sach);
        
        if (request.getMonHocId() != null) {
            MonHoc monHoc = monHocRepository.findById(request.getMonHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.MON_HOC_NOT_FOUND));
            sach.setMonHoc(monHoc);
        }

        return sachMapper.toResponse(sachRepository.save(sach));
    }

    public void delete(Integer id) {
        if (!sachRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.SACH_NOT_FOUND);
        }

        sachRepository.deleteAllBySachId(id);
        sachRepository.deleteById(id);
    }
}
