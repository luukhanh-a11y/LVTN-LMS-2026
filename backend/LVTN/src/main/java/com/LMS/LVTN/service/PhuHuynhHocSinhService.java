package com.LMS.LVTN.service;
// Force recompile

import com.LMS.LVTN.dto.request.PhuHuynhHocSinhRequest;
import com.LMS.LVTN.dto.response.PhuHuynhHocSinhResponse;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.HoSoPhuHuynh;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.PhuHuynhHocSinh;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.PhuHuynhHocSinhMapper;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.HoSoPhuHuynhRepository;
import com.LMS.LVTN.repository.NguoiDungRepository;
import com.LMS.LVTN.repository.PhuHuynhHocSinhRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PhuHuynhHocSinhService {

    PhuHuynhHocSinhMapper phuHuynhHocSinhMapper;
    PhuHuynhHocSinhRepository phuHuynhHocSinhRepository;
    NguoiDungRepository nguoiDungRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    HoSoPhuHuynhRepository hoSoPhuHuynhRepository;
    AuthenticationService authenticationService;

    public List<PhuHuynhHocSinhResponse> getDSHocSinhByPhuHuynhId( String idUser) {
        NguoiDung phuHuynh = nguoiDungRepository.findById(idUser)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));;

        if (phuHuynhHocSinhRepository.findByPhuHuynh_PhuHuynhId(phuHuynh.getHoSoPhuHuynh().getPhuHuynhId()) == null)
            throw  new AppExceptions(Errorcode.HO_SO_PHU_HUYNH_NOT_FOUND);

        return phuHuynhHocSinhRepository.findByPhuHuynh_PhuHuynhId(phuHuynh.getHoSoPhuHuynh().getPhuHuynhId())
                .stream().map(phuHuynhHocSinhMapper::toResponse).collect(Collectors.toList());
    }


    public List<PhuHuynhHocSinhResponse> getDSPhuHuynhByHocSinhId( String idUser) {
        NguoiDung hocSinh = nguoiDungRepository.findById(idUser)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));;

        if (phuHuynhHocSinhRepository.findByPhuHuynh_PhuHuynhId(hocSinh.getHoSoHocSinh().getHocSinhId()) == null)
            throw  new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND);

        return phuHuynhHocSinhRepository.findByPhuHuynh_PhuHuynhId(hocSinh.getHoSoHocSinh().getHocSinhId())
                .stream().map(phuHuynhHocSinhMapper::toResponse).collect(Collectors.toList());
    }

    public List<PhuHuynhHocSinhResponse> getDSPhuHuynhByMaHocSinh(String maHocSinh){
        if (hoSoHocSinhRepository.findByMaHocSinh(maHocSinh) == null)
            throw new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND);

        HoSoHocSinh hoSoHocSinh = hoSoHocSinhRepository.findByMaHocSinh(maHocSinh);

        return phuHuynhHocSinhRepository.findByHocSinh_MaHocSinh(hoSoHocSinh.getMaHocSinh())
                .stream().map(phuHuynhHocSinhMapper :: toResponse).collect(Collectors.toList());
    }

    public void createQuanHe(PhuHuynhHocSinhRequest request){

        if (!hoSoHocSinhRepository.existsById(request.getHocSinhId()))
            throw new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND);

        if (!hoSoPhuHuynhRepository.existsById(request.getPhuHuynhId()))
            throw new AppExceptions(Errorcode.HO_SO_PHU_HUYNH_NOT_FOUND);

        phuHuynhHocSinhRepository.save(phuHuynhHocSinhMapper.toEntity(request));
    }

    public void deleteQuanHe(Long idMoiQuanHe){
        PhuHuynhHocSinh phuHuynhHocSinh = phuHuynhHocSinhRepository.findById(idMoiQuanHe)
                .orElseThrow(() -> new AppExceptions(Errorcode.QUAN_HE_NOT_EXIST));

        phuHuynhHocSinhRepository.delete(phuHuynhHocSinh);
    }
}
