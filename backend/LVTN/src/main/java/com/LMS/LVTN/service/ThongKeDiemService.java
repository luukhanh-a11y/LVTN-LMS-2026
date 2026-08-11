package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.response.DiemTrungBinhMonResponse;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.entity.MonHoc;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ThongKeDiemService {

    MonHocRepository monHocRepository;
    HocKyRepository hocKyRepository;
    BaiNopRepository baiNopRepository;
    LichSuTuHocRepository lichSuTuHocRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;

    public List<DiemTrungBinhMonResponse> getDanhSachDiemTrungBinhMon(Long hocSinhId, Integer hocKyId) {
        if (!hoSoHocSinhRepository.existsById(hocSinhId)) {
            throw new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND);
        }

        HocKy hocKy = hocKyRepository.findById(hocKyId)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        List<MonHoc> danhSachMonHoc = monHocRepository.findAll();

        return danhSachMonHoc.stream().map(monHoc -> buildDiemTrungBinhResponse(hocSinhId, hocKy, monHoc))
                .collect(Collectors.toList());
    }

    public DiemTrungBinhMonResponse getDiemTrungBinhChiTietMon(Long hocSinhId, Integer hocKyId, int idMonHoc) {
        if (!hoSoHocSinhRepository.existsById(hocSinhId)) {
            throw new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND);
        }

        HocKy hocKy = hocKyRepository.findById(hocKyId)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        MonHoc monHoc = monHocRepository.findById(idMonHoc)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        return buildDiemTrungBinhResponse(hocSinhId, hocKy, monHoc);
    }

    private DiemTrungBinhMonResponse buildDiemTrungBinhResponse(Long hocSinhId, HocKy hocKy, MonHoc monHoc) {
        Double diemBaiTap = baiNopRepository.tinhDiemTrungBinhBaiTapTheoMonAndHocKy(
                hocSinhId, monHoc.getMaMon(), hocKy.getHocKyId()
        ).orElse(0.0);

        Double diemTuHoc = lichSuTuHocRepository.tinhDiemTrungBinhTuHocTheoMonAndHocKy(
                hocSinhId, monHoc.getMaMon(), hocKy.getSoHocKy()
        ).map(BigDecimal::doubleValue).orElse(0.0);

        diemBaiTap = roundToTwoDecimals(diemBaiTap);
        diemTuHoc = roundToTwoDecimals(diemTuHoc);

        Double diemChung = 0.0;
        if (diemBaiTap > 0 && diemTuHoc > 0) {
            diemChung = roundToTwoDecimals((diemBaiTap + diemTuHoc) / 2.0);
        } else if (diemBaiTap > 0) {
            diemChung = diemBaiTap;
        } else if (diemTuHoc > 0) {
            diemChung = diemTuHoc;
        }

        return DiemTrungBinhMonResponse.builder()
                .maMon(monHoc.getMaMon())
                .tenMon(monHoc.getTenMon())
                .diemTrungBinhBaiTap(diemBaiTap)
                .diemTrungBinhTuHoc(diemTuHoc)
                .diemTrungBinhChung(diemChung)
                .build();
    }

    private Double roundToTwoDecimals(Double value) {
        if (value == null || value == 0.0) return 0.0;
        return Math.round(value * 100.0) / 100.0;
    }
}
