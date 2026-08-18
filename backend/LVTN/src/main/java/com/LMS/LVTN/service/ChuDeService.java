package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.ChuDeRequest;
import com.LMS.LVTN.dto.response.ChuDeResponse;
import com.LMS.LVTN.entity.ChuDe;
import com.LMS.LVTN.entity.Sach;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.ChuDeMapper;
import com.LMS.LVTN.repository.ChuDeRepository;
import com.LMS.LVTN.repository.DangBaiRepository;
import com.LMS.LVTN.repository.SachRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChuDeService {

    ChuDeRepository chuDeRepository;
    ChuDeMapper chuDeMapper;
    SachRepository sachRepository;
    BaiHocService baiHocService;
    DangBaiRepository dangBaiRepository;

    public ChuDeResponse create(ChuDeRequest request) {
        ChuDe chuDe = chuDeMapper.toEntity(request);
        
        if (request.getSachId() != null) {
            Sach sach = sachRepository.findById(request.getSachId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.SACH_NOT_FOUND));
            chuDe.setSach(sach);
        }
        
        return chuDeMapper.toResponse(chuDeRepository.save(chuDe));
    }

    public List<ChuDeResponse> getAll() {
        return chuDeRepository.findAll().stream()
                .map(chuDeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ChuDeResponse> getBySachId(Integer sachId) {
        return chuDeRepository.findBySach_SachId(sachId).stream()
                .map(chuDeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ChuDeResponse getById(Integer id) {
        ChuDe chuDe = chuDeRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.CHU_DE_NOT_FOUND));
        return chuDeMapper.toResponse(chuDe);
    }

    public ChuDeResponse update(Integer id, ChuDeRequest request) {
        ChuDe chuDe = chuDeRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.CHU_DE_NOT_FOUND));

        chuDeMapper.updateChuDe(request, chuDe);
        
        if (request.getSachId() != null) {
            Sach sach = sachRepository.findById(request.getSachId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.SACH_NOT_FOUND));
            chuDe.setSach(sach);
        }

        return chuDeMapper.toResponse(chuDeRepository.save(chuDe));
    }

    @Transactional
    public void delete(Integer id) {
        if (!chuDeRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.CHU_DE_NOT_FOUND);
        }

        // Thứ tự bắt buộc: DangBai trước (con của BaiHoc) rồi mới tới BaiHoc — bảng dang_bai
        // không có ON DELETE CASCADE ở DB, xoá BaiHoc trước sẽ vi phạm khoá ngoại nếu bài học
        // còn dạng bài bên trong.
        dangBaiRepository.deleteAllByChuDeId(id);
        chuDeRepository.deleteAllByChuDeId(id);
        chuDeRepository.deleteById(id);
    }

    @Transactional
    public List<ChuDeResponse> nhanBanChuDeKhongBaiHoc(Integer sachCuId, Integer sachMoiId) {
        Sach sachMoi = sachRepository.findById(sachMoiId)
                .orElseThrow(() -> new AppExceptions(Errorcode.SACH_NOT_FOUND));

        List<ChuDe> chuDeCuList = chuDeRepository.findBySach_SachId(sachCuId);
        List<ChuDe> chuDeMoiList = new ArrayList<>();

        for (ChuDe chuDeCu : chuDeCuList) {
            ChuDe chuDeMoi = new ChuDe();
            chuDeMoi.setSach(sachMoi);
            chuDeMoi.setTenChuDe(chuDeCu.getTenChuDe());
            chuDeMoi.setTieuDe(chuDeCu.getTieuDe());
            chuDeMoi.setSlug(chuDeCu.getSlug() != null ? chuDeCu.getSlug() + "-s" + sachMoiId : null);
            chuDeMoi.setSoTrang(chuDeCu.getSoTrang());
            chuDeMoi.setSoThuTu(chuDeCu.getSoThuTu());
            chuDeMoi.setBookIndexIdNgoai(chuDeCu.getBookIndexIdNgoai());

            chuDeMoiList.add(chuDeRepository.save(chuDeMoi));
        }

        return chuDeMoiList.stream()
                .map(chuDeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<ChuDeResponse> nhanBanChuDeKemBaiHoc(Integer sachCuId, Integer sachMoiId) {
        Sach sachMoi = sachRepository.findById(sachMoiId)
                .orElseThrow(() -> new AppExceptions(Errorcode.SACH_NOT_FOUND));

        List<ChuDe> chuDeCuList = chuDeRepository.findBySach_SachId(sachCuId);
        List<ChuDe> chuDeMoiList = new ArrayList<>();

        for (ChuDe chuDeCu : chuDeCuList) {
            ChuDe chuDeMoi = new ChuDe();
            chuDeMoi.setSach(sachMoi);
            chuDeMoi.setTenChuDe(chuDeCu.getTenChuDe());
            chuDeMoi.setTieuDe(chuDeCu.getTieuDe());
            chuDeMoi.setSlug(chuDeCu.getSlug() != null ? chuDeCu.getSlug() + "-s" + sachMoiId : null);
            chuDeMoi.setSoTrang(chuDeCu.getSoTrang());
            chuDeMoi.setSoThuTu(chuDeCu.getSoThuTu());
            chuDeMoi.setBookIndexIdNgoai(chuDeCu.getBookIndexIdNgoai());

            ChuDe savedChuDeMoi = chuDeRepository.save(chuDeMoi);
            chuDeMoiList.add(savedChuDeMoi);

            baiHocService.nhanBanBaiHocKemDangBai(chuDeCu.getChuDeId(), savedChuDeMoi.getChuDeId());
        }

        return chuDeMoiList.stream()
                .map(chuDeMapper::toResponse)
                .collect(Collectors.toList());
    }
}
