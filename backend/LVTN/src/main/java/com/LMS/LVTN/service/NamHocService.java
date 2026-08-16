package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.NamHocRequest;
import com.LMS.LVTN.dto.response.NamHocResponse;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.entity.LopHoc;
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

import com.LMS.LVTN.repository.LopHocRepository;
import com.LMS.LVTN.repository.HocKyRepository;
import com.LMS.LVTN.repository.CauHinhHeThongRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NamHocService {

    NamHocRepository namHocRepository;
    NamHocMapper namHocMapper;
    LopHocRepository lopHocRepository;
    HocKyRepository hocKyRepository;
    CauHinhHeThongRepository cauHinhHeThongRepository;

    private NamHoc getNamHocHienTaiTuCauHinh() {
        return cauHinhHeThongRepository.findById((short) 1)
                .map(config -> config.getHocKyHienTai() != null ? config.getHocKyHienTai().getNamHoc() : null)
                .orElse(null);
    }

    private String xacDinhTrangThaiNamHoc(NamHoc namHocCanKiemTra, NamHoc namHocCauHinhHienTai) {
        if (namHocCauHinhHienTai != null && namHocCanKiemTra.getNamHocId().equals(namHocCauHinhHienTai.getNamHocId())) {
            return "HIEN_TAI";
        }

        java.time.LocalDate today = java.time.LocalDate.now();
        if (namHocCanKiemTra.getNgayBatDau() != null && namHocCanKiemTra.getNgayBatDau().isAfter(today)) {
            return "MOI";
        }
        
        return "CU";
    }

    private NamHocResponse enrichWithTrangThai(NamHoc namHoc, NamHoc namHocCauHinhHienTai) {
        NamHocResponse response = namHocMapper.toResponse(namHoc);
        response.setTrangThai(xacDinhTrangThaiNamHoc(namHoc, namHocCauHinhHienTai));
        return response;
    }

    @Transactional
    public NamHocResponse create(NamHocRequest request) {
        if (namHocRepository.existsByTenNamHoc(request.getTenNamHoc()))
            throw new AppExceptions(Errorcode.DATA_EXISTED);
            
        if (request.getNgayBatDau() != null && request.getNgayKetThuc() != null) {
            if (!request.getNgayBatDau().isBefore(request.getNgayKetThuc())) {
                throw new AppExceptions(Errorcode.INVALID_DATA);
            }
        }

        NamHoc namHoc = namHocMapper.toEntity(request);
        NamHoc savedNamHoc = namHocRepository.save(namHoc);

        if (request.getCloneTuNamHocId() != null) {
            NamHoc oldNamHoc = namHocRepository.findById(request.getCloneTuNamHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.NAM_HOC_NOT_FOUND));

            // Clone HocKy
            List<HocKy> oldHocKys = hocKyRepository.findByNamHoc_NamHocId(oldNamHoc.getNamHocId());
            for (HocKy oldHk : oldHocKys) {
                HocKy newHk = new HocKy();
                newHk.setNamHoc(savedNamHoc);
                newHk.setSoHocKy(oldHk.getSoHocKy());
                // Assuming start and end dates can be null or we leave them null for now
                hocKyRepository.save(newHk);
            }

            // Clone LopHoc
            List<LopHoc> oldLopHocs = lopHocRepository.findByNamHoc_TenNamHoc(oldNamHoc.getTenNamHoc());
            for (LopHoc oldLop : oldLopHocs) {
                LopHoc newLop = new LopHoc();
                newLop.setTenLop(oldLop.getTenLop());
                newLop.setKhoiLop(oldLop.getKhoiLop());
                newLop.setSiSoToiDa(oldLop.getSiSoToiDa());
                newLop.setTrangThai(oldLop.getTrangThai());
                newLop.setNamHoc(savedNamHoc);
                // GiaoVienChuNhiem is left null for the new year
                lopHocRepository.save(newLop);
            }
        }

        return enrichWithTrangThai(savedNamHoc, getNamHocHienTaiTuCauHinh());
    }

    public List<NamHocResponse> getAll() {
        NamHoc currentNamHoc = getNamHocHienTaiTuCauHinh();
        return namHocRepository.findAll().stream()
                .map(nh -> enrichWithTrangThai(nh, currentNamHoc))
                .collect(Collectors.toList());
    }

    public NamHocResponse getById(Integer id) {
        NamHoc namHoc = namHocRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.NAM_HOC_NOT_FOUND));
        return enrichWithTrangThai(namHoc, getNamHocHienTaiTuCauHinh());
    }

    public NamHocResponse update(Integer id, NamHocRequest request) {
        NamHoc namHoc = namHocRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.NAM_HOC_NOT_FOUND));

        namHocMapper.updateNamHoc(request, namHoc);
        return enrichWithTrangThai(namHocRepository.save(namHoc), getNamHocHienTaiTuCauHinh());
    }

    public void delete(Integer id) {
        if (!namHocRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.NAM_HOC_NOT_FOUND);
        }
        namHocRepository.deleteById(id);
    }
}
