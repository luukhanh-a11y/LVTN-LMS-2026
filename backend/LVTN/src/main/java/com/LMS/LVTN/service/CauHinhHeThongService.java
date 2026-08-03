package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.CauHinhHeThongRequest;
import com.LMS.LVTN.dto.response.CauHinhHeThongResponse;
import com.LMS.LVTN.entity.CauHinhHeThong;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.CauHinhHeThongMapper;
import com.LMS.LVTN.repository.CauHinhHeThongRepository;
import com.LMS.LVTN.repository.HocKyRepository;
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
public class CauHinhHeThongService {

    CauHinhHeThongRepository cauHinhHeThongRepository;
    CauHinhHeThongMapper cauHinhHeThongMapper;
    HocKyRepository hocKyRepository;

    @Transactional
    public CauHinhHeThongResponse create(CauHinhHeThongRequest request) {
        CauHinhHeThong cauHinh = cauHinhHeThongMapper.toEntity(request);

        if (request.getHocKyHienTaiId() != null) {
            HocKy hocKy = hocKyRepository.findById(request.getHocKyHienTaiId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            cauHinh.setHocKyHienTai(hocKy);
        }

        return cauHinhHeThongMapper.toResponse(cauHinhHeThongRepository.save(cauHinh));
    }

    public List<CauHinhHeThongResponse> getAll() {
        return cauHinhHeThongRepository.findAll().stream()
                .map(cauHinhHeThongMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CauHinhHeThongResponse getById(Short id) {
        CauHinhHeThong cauHinh = cauHinhHeThongRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return cauHinhHeThongMapper.toResponse(cauHinh);
    }

    @Transactional
    public CauHinhHeThongResponse update(Short id, CauHinhHeThongRequest request) {
        CauHinhHeThong cauHinh = cauHinhHeThongRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        cauHinhHeThongMapper.updateCauHinhHeThong(request, cauHinh);

        if (request.getHocKyHienTaiId() != null) {
            HocKy hocKy = hocKyRepository.findById(request.getHocKyHienTaiId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            cauHinh.setHocKyHienTai(hocKy);
        }

        return cauHinhHeThongMapper.toResponse(cauHinhHeThongRepository.save(cauHinh));
    }

    @Transactional
    public void delete(Short id) {
        if (!cauHinhHeThongRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        cauHinhHeThongRepository.deleteById(id);
    }
}
