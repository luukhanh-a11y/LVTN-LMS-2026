package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HoSoPhuHuynhRequest;
import com.LMS.LVTN.dto.response.HoSoPhuHuynhResponse;
import com.LMS.LVTN.entity.HoSoPhuHuynh;
import com.LMS.LVTN.entity.NguoiDung;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-04T02:43:01+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class HoSoPhuHuynhMapperImpl implements HoSoPhuHuynhMapper {

    @Override
    public HoSoPhuHuynh toEntity(HoSoPhuHuynhRequest request) {
        if ( request == null ) {
            return null;
        }

        HoSoPhuHuynh hoSoPhuHuynh = new HoSoPhuHuynh();

        hoSoPhuHuynh.setEmailNhanThongBao( request.getEmailNhanThongBao() );
        hoSoPhuHuynh.setHoTen( request.getHoTen() );

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
        hoSoPhuHuynhResponse.setEmailNhanThongBao( entity.getEmailNhanThongBao() );
        hoSoPhuHuynhResponse.setHoTen( entity.getHoTen() );
        hoSoPhuHuynhResponse.setPhuHuynhId( entity.getPhuHuynhId() );

        return hoSoPhuHuynhResponse;
    }

    @Override
    public void updateHoSoPhuHuynh(HoSoPhuHuynhRequest request, HoSoPhuHuynh entity) {
        if ( request == null ) {
            return;
        }

        entity.setEmailNhanThongBao( request.getEmailNhanThongBao() );
        entity.setHoTen( request.getHoTen() );
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
