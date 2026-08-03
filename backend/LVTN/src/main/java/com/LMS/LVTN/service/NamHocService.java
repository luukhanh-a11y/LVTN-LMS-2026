package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.NamHocRequest;
import com.LMS.LVTN.dto.response.NamHocResponse;
import com.LMS.LVTN.entity.NamHoc;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.NamHocMapper;
import com.LMS.LVTN.repository.NamHocRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NamHocService {

    NamHocRepository namHocRepository;
    NamHocMapper namHocMapper;

    public NamHocResponse create(NamHocRequest request) {
        if (namHocRepository.existsByTenNamHoc(request.getTenNamHoc()))
            throw new AppExceptions(Errorcode.DATA_EXISTED);

        NamHoc namHoc = namHocMapper.toEntity(request);
        return namHocMapper.toResponse(namHocRepository.save(namHoc));
    }

    public List<NamHocResponse> getAll() {
        return namHocRepository.findAll().stream()
                .map(namHocMapper::toResponse)
                .collect(Collectors.toList());
    }

    public NamHocResponse getById(Integer id) {
        NamHoc namHoc = namHocRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.NAM_HOC_NOT_FOUND));
        return namHocMapper.toResponse(namHoc);
    }

    public NamHocResponse update(Integer id, NamHocRequest request) {
        NamHoc namHoc = namHocRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.NAM_HOC_NOT_FOUND));

        namHocMapper.updateNamHoc(request, namHoc);
        return namHocMapper.toResponse(namHocRepository.save(namHoc));
    }

    public void delete(Integer id) {
        if (!namHocRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.NAM_HOC_NOT_FOUND);
        }
        namHocRepository.deleteById(id);
    }
}
