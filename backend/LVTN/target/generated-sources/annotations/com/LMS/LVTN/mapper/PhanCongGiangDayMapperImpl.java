package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.PhanCongGiangDayRequest;
import com.LMS.LVTN.dto.response.PhanCongGiangDayResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.entity.MonHoc;
import com.LMS.LVTN.entity.NamHoc;
import com.LMS.LVTN.entity.PhanCongGiangDay;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-04T02:43:01+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class PhanCongGiangDayMapperImpl implements PhanCongGiangDayMapper {

    @Override
    public PhanCongGiangDay toEntity(PhanCongGiangDayRequest request) {
        if ( request == null ) {
            return null;
        }

        PhanCongGiangDay phanCongGiangDay = new PhanCongGiangDay();

        return phanCongGiangDay;
    }

    @Override
    public PhanCongGiangDayResponse toResponse(PhanCongGiangDay entity) {
        if ( entity == null ) {
            return null;
        }

        PhanCongGiangDayResponse phanCongGiangDayResponse = new PhanCongGiangDayResponse();

        phanCongGiangDayResponse.setGiaoVienId( entityGiaoVienGiaoVienId( entity ) );
        phanCongGiangDayResponse.setTenGiaoVien( entityGiaoVienHoTen( entity ) );
        phanCongGiangDayResponse.setLopHocId( entityLopHocLopHocId( entity ) );
        phanCongGiangDayResponse.setTenLop( entityLopHocTenLop( entity ) );
        phanCongGiangDayResponse.setMonHocId( entityMonHocMonHocId( entity ) );
        phanCongGiangDayResponse.setTenMon( entityMonHocTenMon( entity ) );
        phanCongGiangDayResponse.setHocKyId( entityHocKyHocKyId( entity ) );
        phanCongGiangDayResponse.setSoHocKy( entityHocKySoHocKy( entity ) );
        phanCongGiangDayResponse.setTenNamHoc( entityHocKyNamHocTenNamHoc( entity ) );
        phanCongGiangDayResponse.setNgayPhanCong( entity.getNgayPhanCong() );
        phanCongGiangDayResponse.setPhanCongId( entity.getPhanCongId() );

        return phanCongGiangDayResponse;
    }

    @Override
    public void updatePhanCongGiangDay(PhanCongGiangDayRequest request, PhanCongGiangDay entity) {
        if ( request == null ) {
            return;
        }
    }

    private Long entityGiaoVienGiaoVienId(PhanCongGiangDay phanCongGiangDay) {
        HoSoGiaoVien giaoVien = phanCongGiangDay.getGiaoVien();
        if ( giaoVien == null ) {
            return null;
        }
        return giaoVien.getGiaoVienId();
    }

    private String entityGiaoVienHoTen(PhanCongGiangDay phanCongGiangDay) {
        HoSoGiaoVien giaoVien = phanCongGiangDay.getGiaoVien();
        if ( giaoVien == null ) {
            return null;
        }
        return giaoVien.getHoTen();
    }

    private Long entityLopHocLopHocId(PhanCongGiangDay phanCongGiangDay) {
        LopHoc lopHoc = phanCongGiangDay.getLopHoc();
        if ( lopHoc == null ) {
            return null;
        }
        return lopHoc.getLopHocId();
    }

    private String entityLopHocTenLop(PhanCongGiangDay phanCongGiangDay) {
        LopHoc lopHoc = phanCongGiangDay.getLopHoc();
        if ( lopHoc == null ) {
            return null;
        }
        return lopHoc.getTenLop();
    }

    private Short entityMonHocMonHocId(PhanCongGiangDay phanCongGiangDay) {
        MonHoc monHoc = phanCongGiangDay.getMonHoc();
        if ( monHoc == null ) {
            return null;
        }
        return monHoc.getMonHocId();
    }

    private String entityMonHocTenMon(PhanCongGiangDay phanCongGiangDay) {
        MonHoc monHoc = phanCongGiangDay.getMonHoc();
        if ( monHoc == null ) {
            return null;
        }
        return monHoc.getTenMon();
    }

    private Integer entityHocKyHocKyId(PhanCongGiangDay phanCongGiangDay) {
        HocKy hocKy = phanCongGiangDay.getHocKy();
        if ( hocKy == null ) {
            return null;
        }
        return hocKy.getHocKyId();
    }

    private Short entityHocKySoHocKy(PhanCongGiangDay phanCongGiangDay) {
        HocKy hocKy = phanCongGiangDay.getHocKy();
        if ( hocKy == null ) {
            return null;
        }
        return hocKy.getSoHocKy();
    }

    private String entityHocKyNamHocTenNamHoc(PhanCongGiangDay phanCongGiangDay) {
        HocKy hocKy = phanCongGiangDay.getHocKy();
        if ( hocKy == null ) {
            return null;
        }
        NamHoc namHoc = hocKy.getNamHoc();
        if ( namHoc == null ) {
            return null;
        }
        return namHoc.getTenNamHoc();
    }
}
