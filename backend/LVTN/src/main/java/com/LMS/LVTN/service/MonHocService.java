package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.MonHocRequest;
import com.LMS.LVTN.dto.response.MonHocResponse;
import com.LMS.LVTN.entity.MonHoc;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.MonHocMapper;
import com.LMS.LVTN.repository.MonHocRepository;
import com.LMS.LVTN.repository.PhanCongGiangDayRepository;
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
public class MonHocService {

    MonHocRepository monHocRepository;
    MonHocMapper monHocMapper;
    SachRepository sachRepository;
    PhanCongGiangDayRepository phanCongGiangDayRepository;

    public MonHocResponse create(MonHocRequest request) {
        if (monHocRepository.existsByMaMon(request.getMaMon())) {
            throw new AppExceptions(Errorcode.DATA_EXISTED);
        }
        MonHoc monHoc = monHocMapper.toEntity(request);
        return monHocMapper.toResponse(monHocRepository.save(monHoc));
    }

    public List<MonHocResponse> getAll() {
        return monHocRepository.findAll().stream()
                .map(monHocMapper::toResponse)
                .collect(Collectors.toList());
    }

    public MonHocResponse getById(int monHocId) {
        MonHoc monHoc = monHocRepository.findById(monHocId)
                .orElseThrow(() -> new AppExceptions(Errorcode.MON_HOC_NOT_FOUND));
        return monHocMapper.toResponse(monHoc);
    }

    public MonHocResponse update(int monHocId, MonHocRequest request) {
        MonHoc monHoc = monHocRepository.findById(monHocId)
                .orElseThrow(() -> new AppExceptions(Errorcode.MON_HOC_NOT_FOUND));

        monHocMapper.updateMonHoc(request, monHoc);
        return monHocMapper.toResponse(monHocRepository.save(monHoc));
    }

    public void delete(int monHocId) {
        MonHoc monHoc = monHocRepository.findById(monHocId)
                .orElseThrow(() -> new AppExceptions(Errorcode.MON_HOC_NOT_FOUND));
        if (sachRepository.existsByMaMon(monHoc.getMaMon()) || phanCongGiangDayRepository.existsByMonHoc_MonHocId(monHocId)) {
            throw new AppExceptions(Errorcode.MON_HOC_DANG_SU_DUNG);
        }
        monHocRepository.deleteById(monHocId);
    }
}
