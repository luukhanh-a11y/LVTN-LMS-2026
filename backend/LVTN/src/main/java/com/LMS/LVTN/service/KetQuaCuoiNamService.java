package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.KetQuaCuoiNamRequest;
import com.LMS.LVTN.dto.response.KetQuaCuoiNamResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.KetQuaCuoiNam;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.KetQuaCuoiNamMapper;
import com.LMS.LVTN.repository.HoSoGiaoVienRepository;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.KetQuaCuoiNamRepository;
import com.LMS.LVTN.repository.LopHocRepository;
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
public class KetQuaCuoiNamService {

    KetQuaCuoiNamRepository ketQuaCuoiNamRepository;
    KetQuaCuoiNamMapper ketQuaCuoiNamMapper;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    LopHocRepository lopHocRepository;
    HoSoGiaoVienRepository hoSoGiaoVienRepository;

    @Transactional
    public KetQuaCuoiNamResponse create(KetQuaCuoiNamRequest request) {
        KetQuaCuoiNam ketQua = ketQuaCuoiNamMapper.toEntity(request);

        if (request.getHocSinhId() != null) {
            HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND));
            ketQua.setHocSinh(hocSinh);
        }

        if (request.getLopHocId() != null) {
            LopHoc lopHoc = lopHocRepository.findById(request.getLopHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            ketQua.setLopHoc(lopHoc);
        }

        if (request.getGiaoVienXetId() != null) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienXetId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            ketQua.setGiaoVienXet(giaoVien);
        }

        return ketQuaCuoiNamMapper.toResponse(ketQuaCuoiNamRepository.save(ketQua));
    }

    public List<KetQuaCuoiNamResponse> getAll() {
        return ketQuaCuoiNamRepository.findAll().stream()
                .map(ketQuaCuoiNamMapper::toResponse)
                .collect(Collectors.toList());
    }

    public KetQuaCuoiNamResponse getById(Long id) {
        KetQuaCuoiNam ketQua = ketQuaCuoiNamRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return ketQuaCuoiNamMapper.toResponse(ketQua);
    }

    @Transactional
    public KetQuaCuoiNamResponse update(Long id, KetQuaCuoiNamRequest request) {
        KetQuaCuoiNam ketQua = ketQuaCuoiNamRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        ketQuaCuoiNamMapper.updateKetQuaCuoiNam(request, ketQua);

        if (request.getHocSinhId() != null) {
            HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND));
            ketQua.setHocSinh(hocSinh);
        }

        if (request.getLopHocId() != null) {
            LopHoc lopHoc = lopHocRepository.findById(request.getLopHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            ketQua.setLopHoc(lopHoc);
        }

        if (request.getGiaoVienXetId() != null) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienXetId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            ketQua.setGiaoVienXet(giaoVien);
        }

        return ketQuaCuoiNamMapper.toResponse(ketQuaCuoiNamRepository.save(ketQua));
    }

    @Transactional
    public void delete(Long id) {
        if (!ketQuaCuoiNamRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        ketQuaCuoiNamRepository.deleteById(id);
    }
}
