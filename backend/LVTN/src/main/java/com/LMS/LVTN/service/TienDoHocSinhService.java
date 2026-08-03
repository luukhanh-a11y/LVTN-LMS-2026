package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.TienDoHocSinhRequest;
import com.LMS.LVTN.dto.response.TienDoHocSinhResponse;
import com.LMS.LVTN.entity.*;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.TienDoHocSinhMapper;
import com.LMS.LVTN.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TienDoHocSinhService {

    TienDoHocSinhRepository tienDoHocSinhRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    BaiHocRepository baiHocRepository;
    HocKyRepository hocKyRepository;
    LichSuTuHocRepository lichSuTuHocRepository;
    DangBaiRepository dangBaiRepository;
    TienDoHocSinhMapper tienDoHocSinhMapper;

    @Transactional(readOnly = true)
    public TienDoHocSinhResponse getByHocSinhIdAndBaiHocId(Long hocSinhId, Integer baiHocId) {
        return tienDoHocSinhRepository.findByHocSinh_HocSinhIdAndBaiHoc_BaiHocId(hocSinhId, baiHocId)
                .map(tienDoHocSinhMapper::toResponse)
                .orElseGet(() -> {
                    // Trả về DTO ảo trên RAM (Không tạo bản ghi trong CSDL để tránh rác dữ liệu)
                    TienDoHocSinhResponse emptyResp = new TienDoHocSinhResponse();
                    emptyResp.setHocSinhId(hocSinhId);
                    emptyResp.setBaiHocId(baiHocId);
                    emptyResp.setPhanTramHoanThanh((short) 0);
                    emptyResp.setThoiGianHoc(0);
                    emptyResp.setDaHoanThanh(false);
                    return emptyResp;
                });
    }

    @Transactional
    public TienDoHocSinh createTienDo(Long hocSinhId, Integer baiHocId) {
        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(hocSinhId)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

        BaiHoc baiHoc = baiHocRepository.findById(baiHocId)
                .orElseThrow(() -> new AppExceptions(Errorcode.BAI_HOC_NOT_FOUND));

        LopHoc lopHoc = hocSinh.getLopHoc();
        if (lopHoc == null) {
            throw new AppExceptions(Errorcode.INVALID_DATA); 
        }
        
        Integer namHocId = lopHoc.getNamHoc().getNamHocId();
        Short soHocKySach = baiHoc.getChuDe().getSach().getHocKy();

        HocKy hocKy = hocKyRepository.findByNamHoc_NamHocIdAndSoHocKy(namHocId, soHocKySach)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        TienDoHocSinh tienDo = new TienDoHocSinh();
        tienDo.setHocSinh(hocSinh);
        tienDo.setBaiHoc(baiHoc);
        tienDo.setHocKy(hocKy);
        tienDo.setPhanTramHoanThanh((short) 0);
        tienDo.setThoiGianHoc(0);
        tienDo.setLanXemCuoi(LocalDateTime.now());
        tienDo.setDaHoanThanh(false);

        return tienDoHocSinhRepository.save(tienDo);
    }

    @Transactional
    public TienDoHocSinh getOrCreateTienDo(Long hocSinhId, Integer baiHocId) {
        return tienDoHocSinhRepository
                .findByHocSinh_HocSinhIdAndBaiHoc_BaiHocId(hocSinhId, baiHocId)
                .orElseGet(() -> createTienDo(hocSinhId, baiHocId));
    }

    @Transactional
    public void updateProgress(Long hocSinhId, Integer baiHocId) {
        TienDoHocSinh tienDo = getOrCreateTienDo(hocSinhId, baiHocId);

        int totalDangBai = dangBaiRepository.countByBaiHoc_BaiHocId(baiHocId);
        if (totalDangBai == 0) {
            tienDo.setPhanTramHoanThanh((short) 100);
            tienDo.setDaHoanThanh(true);
        } else {
            int completedDangBai = lichSuTuHocRepository.countDistinctDangBaiByHocSinhAndBaiHoc(hocSinhId, baiHocId);
            short percentage = (short) ((completedDangBai * 100) / totalDangBai);
            if (percentage > 100) percentage = 100;

            tienDo.setPhanTramHoanThanh(percentage);
            tienDo.setDaHoanThanh(percentage == 100);
        }
        
        tienDo.setLanXemCuoi(LocalDateTime.now());
        tienDoHocSinhRepository.save(tienDo);
    }

    @Transactional
    public void unmarkProgress(Long hocSinhId, Integer baiHocId) {
        tienDoHocSinhRepository.findByHocSinh_HocSinhIdAndBaiHoc_BaiHocId(hocSinhId, baiHocId)
                .ifPresent(tienDo -> {
                    tienDo.setDaHoanThanh(false);
                    tienDo.setPhanTramHoanThanh((short) 0);
                    tienDo.setLanXemCuoi(LocalDateTime.now());
                    tienDoHocSinhRepository.save(tienDo);
                });
    }

    public List<TienDoHocSinhResponse> getAll() {
        return tienDoHocSinhRepository.findAll().stream()
                .map(tienDoHocSinhMapper::toResponse)
                .collect(Collectors.toList());
    }

    public TienDoHocSinhResponse getById(Long id) {
        TienDoHocSinh entity = tienDoHocSinhRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return tienDoHocSinhMapper.toResponse(entity);
    }

    public void delete(Long id) {
        if (!tienDoHocSinhRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        tienDoHocSinhRepository.deleteById(id);
    }
}
