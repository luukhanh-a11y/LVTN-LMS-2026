package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.MonHocRequest;
import com.LMS.LVTN.dto.response.MonHocResponse;
import com.LMS.LVTN.entity.MonHoc;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.MonHocMapper;
import com.LMS.LVTN.repository.MonHocRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MonHocService {

    MonHocRepository monHocRepository;
    MonHocMapper monHocMapper;

    public MonHocResponse create(MonHocRequest request) {
        MonHoc monHoc = monHocMapper.toEntity(request);
        return monHocMapper.toResponse(monHocRepository.save(monHoc));
    }

    public List<MonHocResponse> getAll() {
        return monHocRepository.findAll().stream()
                .map(monHocMapper::toResponse)
                .collect(Collectors.toList());
    }

    public MonHocResponse getById(Short id) {
        MonHoc monHoc = monHocRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.MON_HOC_NOT_FOUND));
        return monHocMapper.toResponse(monHoc);
    }

    public MonHocResponse update(Short id, MonHocRequest request) {
        MonHoc monHoc = monHocRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.MON_HOC_NOT_FOUND));

        monHocMapper.updateMonHoc(request, monHoc);
        return monHocMapper.toResponse(monHocRepository.save(monHoc));
    }

    public void delete(Short id) {
        if (!monHocRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.MON_HOC_NOT_FOUND);
        }
        monHocRepository.deleteById(id);
    }
}
