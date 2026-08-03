package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.LichSuChuyenLopRequest;
import com.LMS.LVTN.dto.response.LichSuChuyenLopResponse;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.LichSuChuyenLop;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.LichSuChuyenLopMapper;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.LichSuChuyenLopRepository;
import com.LMS.LVTN.repository.LopHocRepository;
import com.LMS.LVTN.repository.NguoiDungRepository;
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
public class LichSuChuyenLopService {

    LichSuChuyenLopRepository lichSuChuyenLopRepository;
    LichSuChuyenLopMapper lichSuChuyenLopMapper;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    LopHocRepository lopHocRepository;
    NguoiDungRepository nguoiDungRepository;

    @Transactional
    public LichSuChuyenLopResponse create(LichSuChuyenLopRequest request) {
        LichSuChuyenLop lichSu = lichSuChuyenLopMapper.toEntity(request);

        if (request.getHocSinhId() != null) {
            HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND));
            lichSu.setHocSinh(hocSinh);
        }

        if (request.getLopCuId() != null) {
            LopHoc lopCu = lopHocRepository.findById(request.getLopCuId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            lichSu.setLopCu(lopCu);
        }

        if (request.getLopMoiId() != null) {
            LopHoc lopMoi = lopHocRepository.findById(request.getLopMoiId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            lichSu.setLopMoi(lopMoi);
        }

        if (request.getNguoiThucHienId() != null) {
            NguoiDung nguoiThucHien = nguoiDungRepository.findById(request.getNguoiThucHienId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            lichSu.setNguoiThucHien(nguoiThucHien);
        }

        return lichSuChuyenLopMapper.toResponse(lichSuChuyenLopRepository.save(lichSu));
    }

    public List<LichSuChuyenLopResponse> getAll() {
        return lichSuChuyenLopRepository.findAll().stream()
                .map(lichSuChuyenLopMapper::toResponse)
                .collect(Collectors.toList());
    }

    public LichSuChuyenLopResponse getById(Long id) {
        LichSuChuyenLop lichSu = lichSuChuyenLopRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return lichSuChuyenLopMapper.toResponse(lichSu);
    }

    @Transactional
    public LichSuChuyenLopResponse update(Long id, LichSuChuyenLopRequest request) {
        LichSuChuyenLop lichSu = lichSuChuyenLopRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        lichSuChuyenLopMapper.updateLichSuChuyenLop(request, lichSu);

        if (request.getHocSinhId() != null) {
            HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND));
            lichSu.setHocSinh(hocSinh);
        }

        if (request.getLopCuId() != null) {
            LopHoc lopCu = lopHocRepository.findById(request.getLopCuId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            lichSu.setLopCu(lopCu);
        }

        if (request.getLopMoiId() != null) {
            LopHoc lopMoi = lopHocRepository.findById(request.getLopMoiId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            lichSu.setLopMoi(lopMoi);
        }

        if (request.getNguoiThucHienId() != null) {
            NguoiDung nguoiThucHien = nguoiDungRepository.findById(request.getNguoiThucHienId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            lichSu.setNguoiThucHien(nguoiThucHien);
        }

        return lichSuChuyenLopMapper.toResponse(lichSuChuyenLopRepository.save(lichSu));
    }

    @Transactional
    public void delete(Long id) {
        if (!lichSuChuyenLopRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        lichSuChuyenLopRepository.deleteById(id);
    }
}
