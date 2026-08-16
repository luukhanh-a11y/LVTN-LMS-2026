package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.ChuDeRequest;
import com.LMS.LVTN.dto.response.ChuDeResponse;
import com.LMS.LVTN.entity.ChuDe;
import com.LMS.LVTN.entity.Sach;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T22:52:20+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class ChuDeMapperImpl implements ChuDeMapper {

    @Override
    public ChuDe toEntity(ChuDeRequest request) {
        if ( request == null ) {
            return null;
        }

        ChuDe chuDe = new ChuDe();

        chuDe.setBookIndexIdNgoai( request.getBookIndexIdNgoai() );
        chuDe.setTenChuDe( request.getTenChuDe() );
        chuDe.setTieuDe( request.getTieuDe() );
        chuDe.setSlug( request.getSlug() );
        chuDe.setSoTrang( request.getSoTrang() );
        chuDe.setSoThuTu( request.getSoThuTu() );

        return chuDe;
    }

    @Override
    public ChuDeResponse toResponse(ChuDe entity) {
        if ( entity == null ) {
            return null;
        }

        ChuDeResponse chuDeResponse = new ChuDeResponse();

        chuDeResponse.setSachId( entitySachSachId( entity ) );
        chuDeResponse.setTenSach( entitySachTenSach( entity ) );
        chuDeResponse.setChuDeId( entity.getChuDeId() );
        chuDeResponse.setBookIndexIdNgoai( entity.getBookIndexIdNgoai() );
        chuDeResponse.setTenChuDe( entity.getTenChuDe() );
        chuDeResponse.setTieuDe( entity.getTieuDe() );
        chuDeResponse.setSlug( entity.getSlug() );
        chuDeResponse.setSoTrang( entity.getSoTrang() );
        chuDeResponse.setSoThuTu( entity.getSoThuTu() );
        chuDeResponse.setNgayTao( entity.getNgayTao() );

        return chuDeResponse;
    }

    @Override
    public void updateChuDe(ChuDeRequest request, ChuDe entity) {
        if ( request == null ) {
            return;
        }

        entity.setBookIndexIdNgoai( request.getBookIndexIdNgoai() );
        entity.setTenChuDe( request.getTenChuDe() );
        entity.setTieuDe( request.getTieuDe() );
        entity.setSlug( request.getSlug() );
        entity.setSoTrang( request.getSoTrang() );
        entity.setSoThuTu( request.getSoThuTu() );
    }

    private Integer entitySachSachId(ChuDe chuDe) {
        Sach sach = chuDe.getSach();
        if ( sach == null ) {
            return null;
        }
        return sach.getSachId();
    }

    private String entitySachTenSach(ChuDe chuDe) {
        Sach sach = chuDe.getSach();
        if ( sach == null ) {
            return null;
        }
        return sach.getTenSach();
    }
}
