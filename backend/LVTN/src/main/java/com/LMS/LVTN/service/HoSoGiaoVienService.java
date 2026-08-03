package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.HoSoGiaoVienRequest;
import com.LMS.LVTN.dto.response.HoSoGiaoVienResponse;
import com.LMS.LVTN.dto.response.HoSoHocSinhResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.HoSoGiaoVienMapper;
import com.LMS.LVTN.repository.HoSoGiaoVienRepository;
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
public class HoSoGiaoVienService {

    HoSoGiaoVienRepository hoSoGiaoVienRepository;
    HoSoGiaoVienMapper hoSoGiaoVienMapper;
    NguoiDungRepository nguoiDungRepository;
    AuthenticationService authenticationService;

    public List<HoSoGiaoVienResponse> getAll() {
        return hoSoGiaoVienRepository.findAll().stream()
                .map(hoSoGiaoVienMapper::toResponse)
                .collect(Collectors.toList());
    }

    public HoSoGiaoVienResponse create(HoSoGiaoVienRequest request){
        if (hoSoGiaoVienRepository.existsByNguoiDung_NguoiDungId(request.getNguoiDungId()))
            throw new AppExceptions(Errorcode.DATA_EXISTED);

        return hoSoGiaoVienMapper.toResponse(hoSoGiaoVienRepository
                .save(hoSoGiaoVienMapper.toEntity(request)));

    }

    public HoSoGiaoVienResponse findByMaGiaoVien(String maGiaoVien){
        if (hoSoGiaoVienRepository.findByMaGiaoVien(maGiaoVien) == null)
            throw new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND);

        return hoSoGiaoVienMapper.toResponse(hoSoGiaoVienRepository.findByMaGiaoVien(maGiaoVien));

    }

    public HoSoGiaoVienResponse getById(Long id) {
        HoSoGiaoVien entity = hoSoGiaoVienRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND)); // Assuming USER_NOT_FOUND is generic enough
        return hoSoGiaoVienMapper.toResponse(entity);
    }

    public HoSoGiaoVienResponse getMyProfile(String token) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            if (nguoiDung.getHoSoGiaoVien() == null) {
                throw new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND);
            }
            return hoSoGiaoVienMapper.toResponse(nguoiDung.getHoSoGiaoVien());
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }

    public HoSoGiaoVienResponse update(Long id, HoSoGiaoVienRequest request) {
        HoSoGiaoVien entity = hoSoGiaoVienRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));

        hoSoGiaoVienMapper.updateHoSoGiaoVien(request, entity);
        return hoSoGiaoVienMapper.toResponse(hoSoGiaoVienRepository.save(entity));
    }

    public void delete(Long id) {
        if (!hoSoGiaoVienRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND);
        }
        hoSoGiaoVienRepository.deleteById(id);
    }
}
