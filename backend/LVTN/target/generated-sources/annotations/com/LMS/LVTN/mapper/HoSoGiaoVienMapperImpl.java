package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HoSoGiaoVienRequest;
import com.LMS.LVTN.dto.response.HoSoGiaoVienResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.NguoiDung;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-18T06:25:39+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class HoSoGiaoVienMapperImpl implements HoSoGiaoVienMapper {

    @Override
    public HoSoGiaoVien toEntity(HoSoGiaoVienRequest request) {
        if ( request == null ) {
            return null;
        }

        HoSoGiaoVien hoSoGiaoVien = new HoSoGiaoVien();

        hoSoGiaoVien.setMaGiaoVien( request.getMaGiaoVien() );
        hoSoGiaoVien.setHoTen( request.getHoTen() );
        hoSoGiaoVien.setBoMon( request.getBoMon() );
        hoSoGiaoVien.setNgaySinh( request.getNgaySinh() );
        hoSoGiaoVien.setGioiTinh( request.getGioiTinh() );

        return hoSoGiaoVien;
    }

    @Override
    public HoSoGiaoVienResponse toResponse(HoSoGiaoVien entity) {
        if ( entity == null ) {
            return null;
        }

        HoSoGiaoVienResponse hoSoGiaoVienResponse = new HoSoGiaoVienResponse();

        hoSoGiaoVienResponse.setNguoiDungId( entityNguoiDungNguoiDungId( entity ) );
        hoSoGiaoVienResponse.setGiaoVienId( entity.getGiaoVienId() );
        hoSoGiaoVienResponse.setMaGiaoVien( entity.getMaGiaoVien() );
        hoSoGiaoVienResponse.setHoTen( entity.getHoTen() );
        hoSoGiaoVienResponse.setBoMon( entity.getBoMon() );
        hoSoGiaoVienResponse.setNgaySinh( entity.getNgaySinh() );
        hoSoGiaoVienResponse.setGioiTinh( entity.getGioiTinh() );

        return hoSoGiaoVienResponse;
    }

    @Override
    public void updateHoSoGiaoVien(HoSoGiaoVienRequest request, HoSoGiaoVien entity) {
        if ( request == null ) {
            return;
        }

        entity.setMaGiaoVien( request.getMaGiaoVien() );
        entity.setHoTen( request.getHoTen() );
        entity.setBoMon( request.getBoMon() );
        entity.setNgaySinh( request.getNgaySinh() );
        entity.setGioiTinh( request.getGioiTinh() );
    }

    private String entityNguoiDungNguoiDungId(HoSoGiaoVien hoSoGiaoVien) {
        NguoiDung nguoiDung = hoSoGiaoVien.getNguoiDung();
        if ( nguoiDung == null ) {
            return null;
        }
        return nguoiDung.getNguoiDungId();
    }
}
