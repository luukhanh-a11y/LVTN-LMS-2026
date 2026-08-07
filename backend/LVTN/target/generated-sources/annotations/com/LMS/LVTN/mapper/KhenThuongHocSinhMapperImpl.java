package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.KhenThuongHocSinhRequest;
import com.LMS.LVTN.dto.response.KhenThuongHocSinhResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.HuyHieu;
import com.LMS.LVTN.entity.KhenThuongHocSinh;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-07T23:40:25+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class KhenThuongHocSinhMapperImpl implements KhenThuongHocSinhMapper {

    @Override
    public KhenThuongHocSinh toEntity(KhenThuongHocSinhRequest request) {
        if ( request == null ) {
            return null;
        }

        KhenThuongHocSinh khenThuongHocSinh = new KhenThuongHocSinh();

        khenThuongHocSinh.setNguonCap( request.getNguonCap() );
        khenThuongHocSinh.setThuKhen( request.getThuKhen() );

        return khenThuongHocSinh;
    }

    @Override
    public KhenThuongHocSinhResponse toResponse(KhenThuongHocSinh entity) {
        if ( entity == null ) {
            return null;
        }

        KhenThuongHocSinhResponse khenThuongHocSinhResponse = new KhenThuongHocSinhResponse();

        khenThuongHocSinhResponse.setHocSinhId( entityHocSinhHocSinhId( entity ) );
        khenThuongHocSinhResponse.setHoTenHocSinh( entityHocSinhHoTen( entity ) );
        khenThuongHocSinhResponse.setHuyHieuId( entityHuyHieuHuyHieuId( entity ) );
        khenThuongHocSinhResponse.setTenHuyHieu( entityHuyHieuTenHuyHieu( entity ) );
        khenThuongHocSinhResponse.setGiaoVienId( entityGiaoVienGiaoVienId( entity ) );
        khenThuongHocSinhResponse.setTenGiaoVien( entityGiaoVienHoTen( entity ) );
        khenThuongHocSinhResponse.setDaGuiEmail( entity.getDaGuiEmail() );
        khenThuongHocSinhResponse.setKhenThuongId( entity.getKhenThuongId() );
        khenThuongHocSinhResponse.setNguonCap( entity.getNguonCap() );
        khenThuongHocSinhResponse.setThoiDiemTrao( entity.getThoiDiemTrao() );
        khenThuongHocSinhResponse.setThuKhen( entity.getThuKhen() );

        return khenThuongHocSinhResponse;
    }

    @Override
    public void updateKhenThuongHocSinh(KhenThuongHocSinhRequest request, KhenThuongHocSinh entity) {
        if ( request == null ) {
            return;
        }

        entity.setNguonCap( request.getNguonCap() );
        entity.setThuKhen( request.getThuKhen() );
    }

    private Long entityHocSinhHocSinhId(KhenThuongHocSinh khenThuongHocSinh) {
        HoSoHocSinh hocSinh = khenThuongHocSinh.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHocSinhId();
    }

    private String entityHocSinhHoTen(KhenThuongHocSinh khenThuongHocSinh) {
        HoSoHocSinh hocSinh = khenThuongHocSinh.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHoTen();
    }

    private Integer entityHuyHieuHuyHieuId(KhenThuongHocSinh khenThuongHocSinh) {
        HuyHieu huyHieu = khenThuongHocSinh.getHuyHieu();
        if ( huyHieu == null ) {
            return null;
        }
        return huyHieu.getHuyHieuId();
    }

    private String entityHuyHieuTenHuyHieu(KhenThuongHocSinh khenThuongHocSinh) {
        HuyHieu huyHieu = khenThuongHocSinh.getHuyHieu();
        if ( huyHieu == null ) {
            return null;
        }
        return huyHieu.getTenHuyHieu();
    }

    private Long entityGiaoVienGiaoVienId(KhenThuongHocSinh khenThuongHocSinh) {
        HoSoGiaoVien giaoVien = khenThuongHocSinh.getGiaoVien();
        if ( giaoVien == null ) {
            return null;
        }
        return giaoVien.getGiaoVienId();
    }

    private String entityGiaoVienHoTen(KhenThuongHocSinh khenThuongHocSinh) {
        HoSoGiaoVien giaoVien = khenThuongHocSinh.getGiaoVien();
        if ( giaoVien == null ) {
            return null;
        }
        return giaoVien.getHoTen();
    }
}
