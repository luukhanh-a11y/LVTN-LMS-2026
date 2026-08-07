package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.DanhGiaBaiLamRequest;
import com.LMS.LVTN.dto.response.DanhGiaBaiLamResponse;
import com.LMS.LVTN.entity.*;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.DanhGiaBaiLamMapper;
import com.LMS.LVTN.repository.*;
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
public class DanhGiaBaiLamService {

    DanhGiaBaiLamRepository danhGiaBaiLamRepository;
    DanhGiaBaiLamMapper danhGiaBaiLamMapper;
    BaiNopRepository baiNopRepository;
    HoSoGiaoVienRepository hoSoGiaoVienRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;

    @Transactional
    public DanhGiaBaiLamResponse create(DanhGiaBaiLamRequest request) {
        DanhGiaBaiLam danhGia = danhGiaBaiLamMapper.toEntity(request);

        if (request.getBaiNopId() != null) {
            // Check if evaluation already exists for this submission
            if (danhGiaBaiLamRepository.findByBaiNop_BaiNopId(request.getBaiNopId()).isPresent()) {
                throw new AppExceptions(Errorcode.DATA_NOT_FOUND); // Adjust error code to "already exists" if available
            }
            BaiNop baiNop = baiNopRepository.findById(request.getBaiNopId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            danhGia.setBaiNop(baiNop);
        } else {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND); // baiNopId is required
        }

        if (request.getGiaoVienId() != null) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            danhGia.setGiaoVien(giaoVien);
        } else {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND); // giaoVienId is required
        }

        DanhGiaBaiLam savedDanhGia = danhGiaBaiLamRepository.save(danhGia);
        
        // Đồng bộ sang BaiNop và cập nhật tổng XP cho HoSoHocSinh thay vì gọi huyHieuEvaluationService
        syncBaiNopAndStudentXp(savedDanhGia);

        return danhGiaBaiLamMapper.toResponse(savedDanhGia);
    }

    public List<DanhGiaBaiLamResponse> getAll() {
        return danhGiaBaiLamRepository.findAll().stream()
                .map(danhGiaBaiLamMapper::toResponse)
                .collect(Collectors.toList());
    }

    public DanhGiaBaiLamResponse getById(Long id) {
        DanhGiaBaiLam danhGia = danhGiaBaiLamRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return danhGiaBaiLamMapper.toResponse(danhGia);
    }

    @Transactional
    public DanhGiaBaiLamResponse update(Long id, DanhGiaBaiLamRequest request) {
        DanhGiaBaiLam danhGia = danhGiaBaiLamRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        danhGiaBaiLamMapper.updateDanhGiaBaiLam(request, danhGia);

        // Usually we don't update the associated submission or teacher for an evaluation,
        // but if needed:
        if (request.getBaiNopId() != null && !request.getBaiNopId().equals(danhGia.getBaiNop().getBaiNopId())) {
            BaiNop baiNop = baiNopRepository.findById(request.getBaiNopId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            danhGia.setBaiNop(baiNop);
        }

        if (request.getGiaoVienId() != null && !request.getGiaoVienId().equals(danhGia.getGiaoVien().getGiaoVienId())) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            danhGia.setGiaoVien(giaoVien);
        }

        DanhGiaBaiLam updatedDanhGia = danhGiaBaiLamRepository.save(danhGia);
        syncBaiNopAndStudentXp(updatedDanhGia);
        return danhGiaBaiLamMapper.toResponse(updatedDanhGia);
    }

    private void syncBaiNopAndStudentXp(DanhGiaBaiLam danhGia) {
        if (danhGia.getBaiNop() != null) {
            BaiNop baiNop = danhGia.getBaiNop();
            baiNop.setTrangThai(com.LMS.LVTN.enums.TrangThaiBaiNop.DA_CHAM);

            short xpMoi = 0;
            if (danhGia.getDiemSo() != null) {
                xpMoi = (short) (danhGia.getDiemSo().doubleValue() * 10);
            }
            short xpCu = baiNop.getXpNhanDuoc() != null ? baiNop.getXpNhanDuoc() : 0;
            baiNop.setXpNhanDuoc(xpMoi > 0 ? xpMoi : (short) 0);
            baiNopRepository.save(baiNop);

            if (baiNop.getHocSinh() != null && (xpMoi - xpCu) != 0) {
                HoSoHocSinh hocSinh = baiNop.getHocSinh();
                int tongXpHienTai = hocSinh.getTongXp() != null ? hocSinh.getTongXp() : 0;
                int tongXpMoi = tongXpHienTai + (xpMoi - xpCu);
                hocSinh.setTongXp(Math.max(0, tongXpMoi));
                hoSoHocSinhRepository.save(hocSinh);
            }
        }
    }

    @Transactional
    public void delete(Long id) {
        if (!danhGiaBaiLamRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        danhGiaBaiLamRepository.deleteById(id);
    }

    public DanhGiaBaiLamResponse getByBaiNopId(Long baiNopId) {
        DanhGiaBaiLam danhGia = danhGiaBaiLamRepository.findByBaiNop_BaiNopId(baiNopId)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return danhGiaBaiLamMapper.toResponse(danhGia);
    }

    public List<DanhGiaBaiLamResponse> getByGiaoVienId(Long giaoVienId) {
        return danhGiaBaiLamRepository.findByGiaoVien_GiaoVienId(giaoVienId).stream()
                .map(danhGiaBaiLamMapper::toResponse)
                .collect(Collectors.toList());
    }
}
