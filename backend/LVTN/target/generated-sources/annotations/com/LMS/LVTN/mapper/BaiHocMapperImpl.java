package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.BaiHocRequest;
import com.LMS.LVTN.dto.response.BaiHocResponse;
import com.LMS.LVTN.entity.BaiHoc;
import com.LMS.LVTN.entity.ChuDe;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-04T02:43:01+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class BaiHocMapperImpl implements BaiHocMapper {

    @Override
    public BaiHoc toEntity(BaiHocRequest request) {
        if ( request == null ) {
            return null;
        }

        BaiHoc baiHoc = new BaiHoc();

        baiHoc.setBookIndexIdNgoai( request.getBookIndexIdNgoai() );
        baiHoc.setSlug( request.getSlug() );
        baiHoc.setSoThuTu( request.getSoThuTu() );
        baiHoc.setSoTrang( request.getSoTrang() );
        baiHoc.setTenBaiHoc( request.getTenBaiHoc() );
        baiHoc.setTieuDe( request.getTieuDe() );

        return baiHoc;
    }

    @Override
    public BaiHocResponse toResponse(BaiHoc entity) {
        if ( entity == null ) {
            return null;
        }

        BaiHocResponse baiHocResponse = new BaiHocResponse();

        baiHocResponse.setChuDeId( entityChuDeChuDeId( entity ) );
        baiHocResponse.setTenChuDe( entityChuDeTenChuDe( entity ) );
        baiHocResponse.setBaiHocId( entity.getBaiHocId() );
        baiHocResponse.setBookIndexIdNgoai( entity.getBookIndexIdNgoai() );
        baiHocResponse.setNgayTao( entity.getNgayTao() );
        baiHocResponse.setSlug( entity.getSlug() );
        baiHocResponse.setSoThuTu( entity.getSoThuTu() );
        baiHocResponse.setSoTrang( entity.getSoTrang() );
        baiHocResponse.setTenBaiHoc( entity.getTenBaiHoc() );
        baiHocResponse.setTieuDe( entity.getTieuDe() );

        return baiHocResponse;
    }

    @Override
    public void updateBaiHoc(BaiHocRequest request, BaiHoc entity) {
        if ( request == null ) {
            return;
        }

        entity.setBookIndexIdNgoai( request.getBookIndexIdNgoai() );
        entity.setSlug( request.getSlug() );
        entity.setSoThuTu( request.getSoThuTu() );
        entity.setSoTrang( request.getSoTrang() );
        entity.setTenBaiHoc( request.getTenBaiHoc() );
        entity.setTieuDe( request.getTieuDe() );
    }

    private Integer entityChuDeChuDeId(BaiHoc baiHoc) {
        ChuDe chuDe = baiHoc.getChuDe();
        if ( chuDe == null ) {
            return null;
        }
        return chuDe.getChuDeId();
    }

    private String entityChuDeTenChuDe(BaiHoc baiHoc) {
        ChuDe chuDe = baiHoc.getChuDe();
        if ( chuDe == null ) {
            return null;
        }
        return chuDe.getTenChuDe();
    }
}
