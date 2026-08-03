package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HoSoPhuHuynhRequest;
import com.LMS.LVTN.dto.response.HoSoPhuHuynhResponse;
import com.LMS.LVTN.entity.HoSoPhuHuynh;
import com.LMS.LVTN.entity.NguoiDung;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-30T21:55:01+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class HoSoPhuHuynhMapperImpl implements HoSoPhuHuynhMapper {

    @Override
    public HoSoPhuHuynh toEntity(HoSoPhuHuynhRequest request) {
        if ( request == null ) {
            return null;
        }

        HoSoPhuHuynh hoSoPhuHuynh = new HoSoPhuHuynh();

        hoSoPhuHuynh.setHoTen( request.getHoTen() );
        hoSoPhuHuynh.setEmailNhanThongBao( request.getEmailNhanThongBao() );

        return hoSoPhuHuynh;
    }

    @Override
    public HoSoPhuHuynhResponse toResponse(HoSoPhuHuynh entity) {
        if ( entity == null ) {
            return null;
        }

        HoSoPhuHuynhResponse hoSoPhuHuynhResponse = new HoSoPhuHuynhResponse();

        hoSoPhuHuynhResponse.setNguoiDungId( entityNguoiDungNguoiDungId( entity ) );
        hoSoPhuHuynhResponse.setSoDienThoai( entityNguoiDungSoDienThoai( entity ) );
        hoSoPhuHuynhResponse.setPhuHuynhId( entity.getPhuHuynhId() );
        hoSoPhuHuynhResponse.setHoTen( entity.getHoTen() );
        hoSoPhuHuynhResponse.setEmailNhanThongBao( entity.getEmailNhanThongBao() );

        return hoSoPhuHuynhResponse;
    }

    @Override
    public void updateHoSoPhuHuynh(HoSoPhuHuynhRequest request, HoSoPhuHuynh entity) {
        if ( request == null ) {
            return;
        }

        entity.setHoTen( request.getHoTen() );
        entity.setEmailNhanThongBao( request.getEmailNhanThongBao() );
    }

    private String entityNguoiDungNguoiDungId(HoSoPhuHuynh hoSoPhuHuynh) {
        NguoiDung nguoiDung = hoSoPhuHuynh.getNguoiDung();
        if ( nguoiDung == null ) {
            return null;
        }
        return nguoiDung.getNguoiDungId();
    }

    private String entityNguoiDungSoDienThoai(HoSoPhuHuynh hoSoPhuHuynh) {
        NguoiDung nguoiDung = hoSoPhuHuynh.getNguoiDung();
        if ( nguoiDung == null ) {
            return null;
        }
        return nguoiDung.getSoDienThoai();
    }
}
