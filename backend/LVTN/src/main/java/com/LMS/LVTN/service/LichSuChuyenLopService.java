package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.LichSuChuyenLopRequest;
import com.LMS.LVTN.dto.response.LichSuChuyenLopResponse;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.LichSuChuyenLop;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.enums.LyDoChuyenLop;
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
    AuthenticationService authenticationService;

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
        } else if (lichSu.getHocSinh() != null) {
            lichSu.setLopCu(lichSu.getHocSinh().getLopHoc());
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

        // Tự động chuyển đổi lớp cho học sinh
        if (lichSu.getHocSinh() != null) {
            HoSoHocSinh hocSinh = lichSu.getHocSinh();
            if (lichSu.getLopMoi() != null) {
                hocSinh.setLopHoc(lichSu.getLopMoi());
                hoSoHocSinhRepository.save(hocSinh);
            } else if (lichSu.getLyDo() == LyDoChuyenLop.CHUYEN_CUP) {
                hocSinh.setLopHoc(null); // Tốt nghiệp hoặc rời trường
                hoSoHocSinhRepository.save(hocSinh);
            }
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

    @Transactional
    public void bulkThucHienChuyenLop(String token, com.LMS.LVTN.dto.request.BulkChuyenLopRequest request) {
        try {
            String nguoiThucHienId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiThucHien = nguoiDungRepository.findById(nguoiThucHienId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

            LopHoc lopMoi = null;
            if (request.getLopHocMoiId() != null) {
                lopMoi = lopHocRepository.findById(request.getLopHocMoiId())
                        .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            }

            for (Long hocSinhId : request.getHocSinhIds()) {
                HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(hocSinhId)
                        .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND));
                
                LopHoc lopCu = hocSinh.getLopHoc();

                LichSuChuyenLop lichSu = new LichSuChuyenLop();
                lichSu.setHocSinh(hocSinh);
                lichSu.setLopCu(lopCu);
                lichSu.setLopMoi(lopMoi);
                lichSu.setNamHocCu(lopCu != null && lopCu.getNamHoc() != null ? lopCu.getNamHoc().getTenNamHoc() : null);
                lichSu.setNamHocMoi(lopMoi != null && lopMoi.getNamHoc() != null ? lopMoi.getNamHoc().getTenNamHoc() : (lopCu != null && lopCu.getNamHoc() != null ? lopCu.getNamHoc().getTenNamHoc() : ""));
                lichSu.setLyDo(com.LMS.LVTN.enums.LyDoChuyenLop.CHUYEN_TRUONG); // Can be adapted later if needed
                lichSu.setGhiChu(request.getLyDo());
                lichSu.setNguoiThucHien(nguoiThucHien);

                lichSuChuyenLopRepository.save(lichSu);

                if (lopMoi != null) {
                    hocSinh.setLopHoc(lopMoi);
                    hoSoHocSinhRepository.save(hocSinh);
                }
            }
        } catch (java.text.ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }

    @Transactional
    public List<LichSuChuyenLopResponse> chuyenLopHangLoat(List<LichSuChuyenLopRequest> requests) {
        return requests.stream().map(req -> {
            if (req.getHocSinhId() == null || req.getNamHocMoi() == null) {
                throw new AppExceptions(Errorcode.INVALID_DATA);
            }
            if (lichSuChuyenLopRepository.existsByHocSinh_HocSinhIdAndNamHocMoi(req.getHocSinhId(), req.getNamHocMoi())) {
                throw new AppExceptions(Errorcode.LICH_SU_CHUYEN_LOP_EXISTED);
            }
            return this.create(req);
        }).collect(Collectors.toList());
    }

    public List<LichSuChuyenLopResponse> getByHocSinhId(Long hocSinhId) {
        return lichSuChuyenLopRepository.findByHocSinh_HocSinhId(hocSinhId).stream()
                .map(lichSuChuyenLopMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<LichSuChuyenLopResponse> getAllByNguoiThucHienId(String nguoiThucHienId) {
        return lichSuChuyenLopRepository.findByNguoiThucHien_NguoiDungId(nguoiThucHienId).stream()
                .map(lichSuChuyenLopMapper::toResponse)
                .collect(Collectors.toList());
    }
}
