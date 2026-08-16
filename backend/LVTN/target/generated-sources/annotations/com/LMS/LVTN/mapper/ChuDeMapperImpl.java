package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.ChuDeRequest;
import com.LMS.LVTN.dto.response.ChuDeResponse;
import com.LMS.LVTN.entity.ChuDe;
import com.LMS.LVTN.entity.Sach;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T16:26:02+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
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
        chuDe.setSlug( request.getSlug() );
        chuDe.setSoThuTu( request.getSoThuTu() );
        chuDe.setSoTrang( request.getSoTrang() );
        chuDe.setTenChuDe( request.getTenChuDe() );
        chuDe.setTieuDe( request.getTieuDe() );

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
        chuDeResponse.setBookIndexIdNgoai( entity.getBookIndexIdNgoai() );
        chuDeResponse.setChuDeId( entity.getChuDeId() );
        chuDeResponse.setNgayTao( entity.getNgayTao() );
        chuDeResponse.setSlug( entity.getSlug() );
        chuDeResponse.setSoThuTu( entity.getSoThuTu() );
        chuDeResponse.setSoTrang( entity.getSoTrang() );
        chuDeResponse.setTenChuDe( entity.getTenChuDe() );
        chuDeResponse.setTieuDe( entity.getTieuDe() );

        return chuDeResponse;
    }

    @Override
    public void updateChuDe(ChuDeRequest request, ChuDe entity) {
        if ( request == null ) {
            return;
        }

        entity.setBookIndexIdNgoai( request.getBookIndexIdNgoai() );
        entity.setSlug( request.getSlug() );
        entity.setSoThuTu( request.getSoThuTu() );
        entity.setSoTrang( request.getSoTrang() );
        entity.setTenChuDe( request.getTenChuDe() );
        entity.setTieuDe( request.getTieuDe() );
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
