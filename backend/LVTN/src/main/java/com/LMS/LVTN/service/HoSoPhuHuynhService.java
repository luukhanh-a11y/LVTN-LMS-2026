package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.HoSoHocSinhRequest;
import com.LMS.LVTN.dto.request.HoSoPhuHuynhRequest;
import com.LMS.LVTN.dto.response.HoSoHocSinhResponse;
import com.LMS.LVTN.dto.response.HoSoPhuHuynhResponse;
import com.LMS.LVTN.entity.HoSoPhuHuynh;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.HoSoPhuHuynhMapper;
import com.LMS.LVTN.repository.HoSoPhuHuynhRepository;
import com.LMS.LVTN.repository.NguoiDungRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HoSoPhuHuynhService {

    HoSoPhuHuynhRepository hoSoPhuHuynhRepository;
    HoSoPhuHuynhMapper hoSoPhuHuynhMapper;
    NguoiDungRepository nguoiDungRepository;
    AuthenticationService authenticationService;

    public List<HoSoPhuHuynhResponse> getAll() {
        return hoSoPhuHuynhRepository.findAll().stream()
                .map(hoSoPhuHuynhMapper::toResponse)
                .collect(Collectors.toList());
    }

    public HoSoPhuHuynhResponse create(HoSoPhuHuynhRequest request){
        if (hoSoPhuHuynhRepository.existsByNguoiDung_NguoiDungId(request.getNguoiDungId()))
            throw new AppExceptions(Errorcode.DATA_EXISTED);

        return hoSoPhuHuynhMapper.toResponse(hoSoPhuHuynhRepository
                .save(hoSoPhuHuynhMapper.toEntity(request)));

    }

    public HoSoPhuHuynhResponse getById(Long id) {
        HoSoPhuHuynh entity = hoSoPhuHuynhRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_PHU_HUYNH_NOT_FOUND));
        return hoSoPhuHuynhMapper.toResponse(entity);
    }

    public HoSoPhuHuynhResponse getMyProfile(String token) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            if (nguoiDung.getHoSoPhuHuynh() == null) {
                throw new AppExceptions(Errorcode.HO_SO_PHU_HUYNH_NOT_FOUND);
            }
            return hoSoPhuHuynhMapper.toResponse(nguoiDung.getHoSoPhuHuynh());
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }

    public HoSoPhuHuynhResponse update(Long id, HoSoPhuHuynhRequest request) {
        HoSoPhuHuynh entity = hoSoPhuHuynhRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_PHU_HUYNH_NOT_FOUND));

        hoSoPhuHuynhMapper.updateHoSoPhuHuynh(request, entity);
        return hoSoPhuHuynhMapper.toResponse(hoSoPhuHuynhRepository.save(entity));
    }

    public HoSoPhuHuynhResponse updateMyProfile(String token, HoSoPhuHuynhRequest request) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            HoSoPhuHuynh entity = nguoiDung.getHoSoPhuHuynh();
            if (entity == null) {
                throw new AppExceptions(Errorcode.HO_SO_PHU_HUYNH_NOT_FOUND);
            }
            hoSoPhuHuynhMapper.updateHoSoPhuHuynh(request, entity);
            return hoSoPhuHuynhMapper.toResponse(hoSoPhuHuynhRepository.save(entity));
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }

    public void delete(Long id) {
        if (!hoSoPhuHuynhRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.HO_SO_PHU_HUYNH_NOT_FOUND);
        }
        hoSoPhuHuynhRepository.deleteById(id);
    }
}
