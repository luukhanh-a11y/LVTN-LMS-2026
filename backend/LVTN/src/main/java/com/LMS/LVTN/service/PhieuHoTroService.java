package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.PhieuHoTroRequest;
import com.LMS.LVTN.dto.response.PhieuHoTroResponse;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.PhieuHoTro;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.PhieuHoTroMapper;
import com.LMS.LVTN.repository.NguoiDungRepository;
import com.LMS.LVTN.repository.PhieuHoTroRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PhieuHoTroService {

    PhieuHoTroRepository phieuHoTroRepository;
    PhieuHoTroMapper phieuHoTroMapper;
    NguoiDungRepository nguoiDungRepository;

    public PhieuHoTroResponse create(PhieuHoTroRequest request) {
        PhieuHoTro phieuHoTro = phieuHoTroMapper.toEntity(request);
        
        if (request.getNguoiDungTaoId() != null) {
            NguoiDung nguoiDungTao = nguoiDungRepository.findById(request.getNguoiDungTaoId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            phieuHoTro.setNguoiDungTao(nguoiDungTao);
        }
        
        if (request.getNguoiDungLienQuanId() != null) {
            NguoiDung nguoiDungLienQuan = nguoiDungRepository.findById(request.getNguoiDungLienQuanId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            phieuHoTro.setNguoiDungLienQuan(nguoiDungLienQuan);
        }
        
        return phieuHoTroMapper.toResponse(phieuHoTroRepository.save(phieuHoTro));
    }

    public List<PhieuHoTroResponse> getAllByIdUserSend(String idUser){
        if (!nguoiDungRepository.existsById(idUser))
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        return phieuHoTroRepository.findByNguoiDungTao_NguoiDungId(idUser)
                .stream().map(phieuHoTroMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<PhieuHoTroResponse> getAllByIdUserReceive(String idUser){
        if (!nguoiDungRepository.existsById(idUser))
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        return phieuHoTroRepository.findByNguoiDungLienQuan_NguoiDungId(idUser)
                .stream().map(phieuHoTroMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<PhieuHoTroResponse> getAll() {
        return phieuHoTroRepository.findAll().stream()
                .map(phieuHoTroMapper::toResponse)
                .collect(Collectors.toList());
    }

    public PhieuHoTroResponse getById(Long id) {
        PhieuHoTro phieuHoTro = phieuHoTroRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.PHIEU_HO_TRO_NOT_FOUND));
        return phieuHoTroMapper.toResponse(phieuHoTro);
    }

    public PhieuHoTroResponse update(Long id, PhieuHoTroRequest request) {
        PhieuHoTro phieuHoTro = phieuHoTroRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.PHIEU_HO_TRO_NOT_FOUND));

        phieuHoTroMapper.updatePhieuHoTro(request, phieuHoTro);
        
        if (request.getNguoiDungTaoId() != null) {
            NguoiDung nguoiDungTao = nguoiDungRepository.findById(request.getNguoiDungTaoId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            phieuHoTro.setNguoiDungTao(nguoiDungTao);
        }
        
        if (request.getNguoiDungLienQuanId() != null) {
            NguoiDung nguoiDungLienQuan = nguoiDungRepository.findById(request.getNguoiDungLienQuanId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            phieuHoTro.setNguoiDungLienQuan(nguoiDungLienQuan);
        }

        return phieuHoTroMapper.toResponse(phieuHoTroRepository.save(phieuHoTro));
    }

    public void delete(Long id) {
        if (!phieuHoTroRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.PHIEU_HO_TRO_NOT_FOUND);
        }
        phieuHoTroRepository.deleteById(id);
    }
}
