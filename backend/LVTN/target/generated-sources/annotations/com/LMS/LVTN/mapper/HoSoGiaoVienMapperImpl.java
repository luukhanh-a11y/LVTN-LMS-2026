package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HoSoGiaoVienRequest;
import com.LMS.LVTN.dto.response.HoSoGiaoVienResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.NguoiDung;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-04T02:43:00+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class HoSoGiaoVienMapperImpl implements HoSoGiaoVienMapper {

    @Override
    public HoSoGiaoVien toEntity(HoSoGiaoVienRequest request) {
        if ( request == null ) {
            return null;
        }

        HoSoGiaoVien hoSoGiaoVien = new HoSoGiaoVien();

        hoSoGiaoVien.setBoMon( request.getBoMon() );
        hoSoGiaoVien.setGioiTinh( request.getGioiTinh() );
        hoSoGiaoVien.setHoTen( request.getHoTen() );
        hoSoGiaoVien.setMaGiaoVien( request.getMaGiaoVien() );
        hoSoGiaoVien.setNgaySinh( request.getNgaySinh() );

        return hoSoGiaoVien;
    }

    @Override
    public HoSoGiaoVienResponse toResponse(HoSoGiaoVien entity) {
        if ( entity == null ) {
            return null;
        }

        HoSoGiaoVienResponse hoSoGiaoVienResponse = new HoSoGiaoVienResponse();

        hoSoGiaoVienResponse.setNguoiDungId( entityNguoiDungNguoiDungId( entity ) );
        hoSoGiaoVienResponse.setBoMon( entity.getBoMon() );
        hoSoGiaoVienResponse.setGiaoVienId( entity.getGiaoVienId() );
        hoSoGiaoVienResponse.setGioiTinh( entity.getGioiTinh() );
        hoSoGiaoVienResponse.setHoTen( entity.getHoTen() );
        hoSoGiaoVienResponse.setMaGiaoVien( entity.getMaGiaoVien() );
        hoSoGiaoVienResponse.setNgaySinh( entity.getNgaySinh() );

        return hoSoGiaoVienResponse;
    }

    @Override
    public void updateHoSoGiaoVien(HoSoGiaoVienRequest request, HoSoGiaoVien entity) {
        if ( request == null ) {
            return;
        }

        entity.setBoMon( request.getBoMon() );
        entity.setGioiTinh( request.getGioiTinh() );
        entity.setHoTen( request.getHoTen() );
        entity.setMaGiaoVien( request.getMaGiaoVien() );
        entity.setNgaySinh( request.getNgaySinh() );
    }

    private String entityNguoiDungNguoiDungId(HoSoGiaoVien hoSoGiaoVien) {
        NguoiDung nguoiDung = hoSoGiaoVien.getNguoiDung();
        if ( nguoiDung == null ) {
            return null;
        }
        return nguoiDung.getNguoiDungId();
    }
}
