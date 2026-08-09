package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HoSoHocSinhRequest;
import com.LMS.LVTN.dto.response.HoSoHocSinhResponse;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.entity.NguoiDung;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-09T19:35:17+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class HoSoHocSinhMapperImpl implements HoSoHocSinhMapper {

    @Override
    public HoSoHocSinh toEntity(HoSoHocSinhRequest request) {
        if ( request == null ) {
            return null;
        }

        HoSoHocSinh hoSoHocSinh = new HoSoHocSinh();

        hoSoHocSinh.setMaHocSinh( request.getMaHocSinh() );
        hoSoHocSinh.setHoTen( request.getHoTen() );
        hoSoHocSinh.setNgaySinh( request.getNgaySinh() );
        hoSoHocSinh.setGioiTinh( request.getGioiTinh() );

        return hoSoHocSinh;
    }

    @Override
    public HoSoHocSinhResponse toResponse(HoSoHocSinh entity) {
        if ( entity == null ) {
            return null;
        }

        HoSoHocSinhResponse hoSoHocSinhResponse = new HoSoHocSinhResponse();

        hoSoHocSinhResponse.setNguoiDungId( entityNguoiDungNguoiDungId( entity ) );
        hoSoHocSinhResponse.setLopHocId( entityLopHocLopHocId( entity ) );
        hoSoHocSinhResponse.setHocSinhId( entity.getHocSinhId() );
        hoSoHocSinhResponse.setMaHocSinh( entity.getMaHocSinh() );
        hoSoHocSinhResponse.setHoTen( entity.getHoTen() );
        hoSoHocSinhResponse.setNgaySinh( entity.getNgaySinh() );
        hoSoHocSinhResponse.setGioiTinh( entity.getGioiTinh() );
        hoSoHocSinhResponse.setTongXp( entity.getTongXp() );

        return hoSoHocSinhResponse;
    }

    @Override
    public void updateHoSoHocSinh(HoSoHocSinhRequest request, HoSoHocSinh entity) {
        if ( request == null ) {
            return;
        }

        entity.setMaHocSinh( request.getMaHocSinh() );
        entity.setHoTen( request.getHoTen() );
        entity.setNgaySinh( request.getNgaySinh() );
        entity.setGioiTinh( request.getGioiTinh() );
    }

    private String entityNguoiDungNguoiDungId(HoSoHocSinh hoSoHocSinh) {
        NguoiDung nguoiDung = hoSoHocSinh.getNguoiDung();
        if ( nguoiDung == null ) {
            return null;
        }
        return nguoiDung.getNguoiDungId();
    }

    private Long entityLopHocLopHocId(HoSoHocSinh hoSoHocSinh) {
        LopHoc lopHoc = hoSoHocSinh.getLopHoc();
        if ( lopHoc == null ) {
            return null;
        }
        return lopHoc.getLopHocId();
    }
}
