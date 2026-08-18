package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.PhuHuynhHocSinhRequest;
import com.LMS.LVTN.dto.response.HoSoHocSinhResponse;
import com.LMS.LVTN.dto.response.HoSoPhuHuynhResponse;
import com.LMS.LVTN.dto.response.PhuHuynhHocSinhResponse;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.HoSoPhuHuynh;
import com.LMS.LVTN.entity.PhuHuynhHocSinh;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-18T09:48:41+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class PhuHuynhHocSinhMapperImpl implements PhuHuynhHocSinhMapper {

    @Override
    public PhuHuynhHocSinh toEntity(PhuHuynhHocSinhRequest request) {
        if ( request == null ) {
            return null;
        }

        PhuHuynhHocSinh.PhuHuynhHocSinhBuilder phuHuynhHocSinh = PhuHuynhHocSinh.builder();

        phuHuynhHocSinh.quanHe( request.getQuanHe() );

        return phuHuynhHocSinh.build();
    }

    @Override
    public PhuHuynhHocSinhResponse toResponse(PhuHuynhHocSinh entity) {
        if ( entity == null ) {
            return null;
        }

        PhuHuynhHocSinhResponse phuHuynhHocSinhResponse = new PhuHuynhHocSinhResponse();

        phuHuynhHocSinhResponse.setHoSoPhuHuynhResponse( hoSoPhuHuynhToHoSoPhuHuynhResponse( entity.getPhuHuynh() ) );
        phuHuynhHocSinhResponse.setHoSoHocSinhResponse( hoSoHocSinhToHoSoHocSinhResponse( entity.getHocSinh() ) );
        phuHuynhHocSinhResponse.setThoiDiemLienKet( entity.getNgayLienKet() );
        phuHuynhHocSinhResponse.setQuanHe( entity.getQuanHe() );

        return phuHuynhHocSinhResponse;
    }

    @Override
    public void updatePhuHuynhHocSinh(PhuHuynhHocSinhRequest request, PhuHuynhHocSinh entity) {
        if ( request == null ) {
            return;
        }

        entity.setQuanHe( request.getQuanHe() );
    }

    protected HoSoPhuHuynhResponse hoSoPhuHuynhToHoSoPhuHuynhResponse(HoSoPhuHuynh hoSoPhuHuynh) {
        if ( hoSoPhuHuynh == null ) {
            return null;
        }

        HoSoPhuHuynhResponse hoSoPhuHuynhResponse = new HoSoPhuHuynhResponse();

        hoSoPhuHuynhResponse.setPhuHuynhId( hoSoPhuHuynh.getPhuHuynhId() );
        hoSoPhuHuynhResponse.setHoTen( hoSoPhuHuynh.getHoTen() );
        hoSoPhuHuynhResponse.setEmailNhanThongBao( hoSoPhuHuynh.getEmailNhanThongBao() );

        return hoSoPhuHuynhResponse;
    }

    protected HoSoHocSinhResponse hoSoHocSinhToHoSoHocSinhResponse(HoSoHocSinh hoSoHocSinh) {
        if ( hoSoHocSinh == null ) {
            return null;
        }

        HoSoHocSinhResponse hoSoHocSinhResponse = new HoSoHocSinhResponse();

        hoSoHocSinhResponse.setHocSinhId( hoSoHocSinh.getHocSinhId() );
        hoSoHocSinhResponse.setMaHocSinh( hoSoHocSinh.getMaHocSinh() );
        hoSoHocSinhResponse.setHoTen( hoSoHocSinh.getHoTen() );
        hoSoHocSinhResponse.setNgaySinh( hoSoHocSinh.getNgaySinh() );
        hoSoHocSinhResponse.setGioiTinh( hoSoHocSinh.getGioiTinh() );
        hoSoHocSinhResponse.setTongXp( hoSoHocSinh.getTongXp() );

        return hoSoHocSinhResponse;
    }
}
