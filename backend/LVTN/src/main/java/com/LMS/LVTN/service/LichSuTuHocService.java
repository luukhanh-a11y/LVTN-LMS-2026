package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.LichSuTuHocRequest;
import com.LMS.LVTN.dto.response.LichSuTuHocResponse;
import com.LMS.LVTN.entity.DangBai;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.LichSuTuHoc;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.LichSuTuHocMapper;
import com.LMS.LVTN.repository.DangBaiRepository;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.LichSuTuHocRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LichSuTuHocService {

    GameService gameService;
    LichSuTuHocRepository lichSuTuHocRepository;
    LichSuTuHocMapper lichSuTuHocMapper;
    DangBaiRepository dangBaiRepository;
    DangBaiService dangBaiService;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    TienDoHocSinhService tienDoHocSinhService;


    public LichSuTuHocResponse nopBai(LichSuTuHocRequest request){

        if(!dangBaiRepository.isSachGiaoKhoa(request.getDangBaiId()))
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        if (lichSuTuHocRepository
                .existsByHocSinh_HocSinhIdAndDangBai_DangBaiId(request.getHocSinhId(), request.getDangBaiId()))
            throw new AppExceptions(Errorcode.DATA_EXISTED);

        DangBai dangBai = dangBaiRepository.findById(request.getDangBaiId())
                .orElseThrow(() -> new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND));

        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

        BigDecimal diem = gameService.chamDiem(dangBai.getDapAnChuan(), request.getChiTietBaiLam());

        LichSuTuHoc lichSuTuHoc = lichSuTuHocMapper.toEntity(request);
        lichSuTuHoc.setHocSinh(hocSinh);
        lichSuTuHoc.setDangBai(dangBai);
        lichSuTuHoc.setDiemSo(diem);

        LichSuTuHoc saved = lichSuTuHocRepository.save(lichSuTuHoc);

        int xp = dangBai.getXpThuong() + hocSinh.getTongXp();
        hocSinh.setTongXp(xp);

        hoSoHocSinhRepository.save(hocSinh);

        try {
            tienDoHocSinhService.updateProgress(hocSinh.getHocSinhId(), dangBai.getBaiHoc().getBaiHocId());
        } catch (Exception e) {

        }

        return lichSuTuHocMapper.toResponse(saved);
    }

    public List<LichSuTuHocResponse> getAll(){
        return lichSuTuHocRepository.findAll().stream()
                .map(lichSuTuHocMapper :: toResponse)
                .collect(Collectors.toList());
    }

    public List<LichSuTuHocResponse> getAllByHocSinhId(Long idHocSinh){
        if (!hoSoHocSinhRepository.existsById(idHocSinh))
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        return lichSuTuHocRepository.findByHocSinh_HocSinhId(idHocSinh)
                .stream().map(lichSuTuHocMapper :: toResponse)
                .collect(Collectors.toList());
    }

    public List<LichSuTuHocResponse> getByDangBaiId(Integer maDangBai){
        if (!dangBaiRepository.existsById(maDangBai))
            throw new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND);

        return lichSuTuHocRepository.findByDangBai_DangBaiId(maDangBai)
                .stream().map(lichSuTuHocMapper :: toResponse)
                .collect(Collectors.toList());
    }

    public List<LichSuTuHocResponse> getByDangBaiId(Integer maDangBai,Long maHocSinh){
        if (!hoSoHocSinhRepository.existsById(maHocSinh))
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        if (!dangBaiRepository.existsById(maDangBai))
            throw new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND);

        return lichSuTuHocRepository.findByHocSinh_HocSinhIdAndDangBai_DangBaiId(maHocSinh, maDangBai)
                .stream().map(lichSuTuHocMapper :: toResponse)
                .collect(Collectors.toList());
    }

    public List<LichSuTuHocResponse> getAllByMaHocSinh(String maHocSinh){
        if (hoSoHocSinhRepository.findByMaHocSinh(maHocSinh) == null)
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        return lichSuTuHocRepository.findByHocSinh_MaHocSinh(maHocSinh)
                .stream().map(lichSuTuHocMapper :: toResponse)
                .collect(Collectors.toList());
    }

    public LichSuTuHocResponse udpate(Long lichSuID,LichSuTuHocRequest request){
        LichSuTuHoc lichSuTuHoc = lichSuTuHocRepository.findById(lichSuID)
                .orElseThrow(() -> new AppExceptions(Errorcode.LICH_SU_TU_HOC_NOT_FOUND));

        DangBai dangBai = dangBaiRepository.findById(request.getDangBaiId())
                .orElseThrow(() -> new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND));

        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

        BigDecimal diem = gameService.chamDiem(dangBai.getDapAnChuan(), request.getChiTietBaiLam());

        lichSuTuHocMapper.updateLichSuTuHoc(request, lichSuTuHoc);
        lichSuTuHoc.setDiemSo(diem);

        return lichSuTuHocMapper.toResponse(lichSuTuHocRepository.save(lichSuTuHoc));
    }

    public void delete(Long lichSuID){
        LichSuTuHoc lichSuTuHoc = lichSuTuHocRepository.findById(lichSuID)
                .orElseThrow(() -> new AppExceptions(Errorcode.LICH_SU_TU_HOC_NOT_FOUND));

        lichSuTuHocRepository.delete(lichSuTuHoc);
    }
}
