package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.LopHocRequest;
import com.LMS.LVTN.dto.response.LopHocResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.entity.NamHoc;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.LopHocMapper;
import com.LMS.LVTN.repository.HoSoGiaoVienRepository;
import com.LMS.LVTN.repository.LopHocRepository;
import com.LMS.LVTN.repository.NamHocRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LopHocService {

    LopHocRepository lopHocRepository;
    LopHocMapper lopHocMapper;
    NamHocRepository namHocRepository;
    HoSoGiaoVienRepository hoSoGiaoVienRepository;

    public LopHocResponse create(LopHocRequest request) {
        LopHoc lopHoc = lopHocMapper.toEntity(request);
        
        if (request.getNamHocId() != null) {
            NamHoc namHoc = namHocRepository.findById(request.getNamHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.NAM_HOC_NOT_FOUND)); // Or appropriate error
            lopHoc.setNamHoc(namHoc);
        }
        
        if (request.getGiaoVienChuNhiemId() != null) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienChuNhiemId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            lopHoc.setGiaoVienChuNhiem(giaoVien);
        }

        return mapToResponseWithSiSo(lopHocRepository.save(lopHoc));
    }
    @Transactional(readOnly = true)
    public List<LopHocResponse> getAll() {
        return lopHocRepository.findAll().stream()
                .map(this::mapToResponseWithSiSo)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<LopHocResponse> searchLopHoc(String keyword, Long namHocId, Integer khoiLop, Pageable pageable) {
        Specification<LopHoc> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("tenLop")), "%" + keyword.toLowerCase() + "%"));
            }
            if (namHocId != null) {
                predicates.add(cb.equal(root.get("namHoc").get("namHocId"), namHocId));
            }
            if (khoiLop != null) {
                predicates.add(cb.equal(root.get("khoiLop"), khoiLop));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return lopHocRepository.findAll(spec, pageable).map(this::mapToResponseWithSiSo);
    }

    @Transactional(readOnly = true)
    public LopHocResponse getById(Long id) {
        LopHoc lopHoc = lopHocRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
        return mapToResponseWithSiSo(lopHoc);
    }

    public LopHocResponse update(Long id, LopHocRequest request) {
        LopHoc lopHoc = lopHocRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));

        lopHocMapper.updateLopHoc(request, lopHoc);
        
        if (request.getNamHocId() != null) {
            NamHoc namHoc = namHocRepository.findById(request.getNamHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.NAM_HOC_NOT_FOUND));
            lopHoc.setNamHoc(namHoc);
        }
        
        if (request.getGiaoVienChuNhiemId() != null) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienChuNhiemId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            lopHoc.setGiaoVienChuNhiem(giaoVien);
        }

        return mapToResponseWithSiSo(lopHocRepository.save(lopHoc));
    }

    public void delete(Long id) {
        if (!lopHocRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND);
        }
        lopHocRepository.deleteById(id);
    }

    private LopHocResponse mapToResponseWithSiSo(LopHoc lopHoc) {
        LopHocResponse response = lopHocMapper.toResponse(lopHoc);
        if (lopHoc.getHoSoHocSinhs() != null) {
            response.setSiSoHienTai((long) lopHoc.getHoSoHocSinhs().size());
        } else {
            response.setSiSoHienTai(0L);
        }
        return response;
    }
}
