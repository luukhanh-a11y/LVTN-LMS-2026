package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.HoSoGiaoVienRequest;
import com.LMS.LVTN.dto.request.HoSoHocSinhRequest;
import com.LMS.LVTN.dto.response.HoSoGiaoVienResponse;
import com.LMS.LVTN.dto.response.HoSoHocSinhResponse;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.HoSoHocSinhMapper;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
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
public class HoSoHocSinhService {

    HoSoHocSinhRepository hoSoHocSinhRepository;
    HoSoHocSinhMapper hoSoHocSinhMapper;
    NguoiDungRepository nguoiDungRepository;
    AuthenticationService authenticationService;

    public List<HoSoHocSinhResponse> getAll() {
        return hoSoHocSinhRepository.findAll().stream()
                .map(hoSoHocSinhMapper::toResponse)
                .collect(Collectors.toList());
    }

    public HoSoHocSinhResponse create(HoSoHocSinhRequest request){
        if (hoSoHocSinhRepository.existsByNguoiDung_NguoiDungId(request.getNguoiDungId()))
            throw new AppExceptions(Errorcode.DATA_EXISTED);

        return hoSoHocSinhMapper.toResponse(hoSoHocSinhRepository
                .save(hoSoHocSinhMapper.toEntity(request)));

    }

    public HoSoHocSinhResponse getById(Long id) {
        HoSoHocSinh entity = hoSoHocSinhRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND));
        return hoSoHocSinhMapper.toResponse(entity);
    }

    public HoSoHocSinhResponse getByMaHocSinh(String maHocSinh){

        if (hoSoHocSinhRepository.findByMaHocSinh(maHocSinh) == null)
            throw new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND);

        return  hoSoHocSinhMapper.toResponse(hoSoHocSinhRepository.findByMaHocSinh(maHocSinh));
    }

    public HoSoHocSinhResponse getMyProfile(String token) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            if (nguoiDung.getHoSoHocSinh() == null) {
                throw new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND);
            }
            return hoSoHocSinhMapper.toResponse(nguoiDung.getHoSoHocSinh());
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }

    public HoSoHocSinhResponse update(Long id, HoSoHocSinhRequest request) {
        HoSoHocSinh entity = hoSoHocSinhRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND));

        hoSoHocSinhMapper.updateHoSoHocSinh(request, entity);
        return hoSoHocSinhMapper.toResponse(hoSoHocSinhRepository.save(entity));
    }

    public void delete(Long id) {
        if (!hoSoHocSinhRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND);
        }
        hoSoHocSinhRepository.deleteById(id);
    }
}
