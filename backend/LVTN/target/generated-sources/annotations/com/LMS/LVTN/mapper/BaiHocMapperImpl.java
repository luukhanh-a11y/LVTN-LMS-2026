package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.BaiHocRequest;
import com.LMS.LVTN.dto.response.BaiHocResponse;
import com.LMS.LVTN.entity.BaiHoc;
import com.LMS.LVTN.entity.ChuDe;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-30T21:55:01+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
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
        baiHoc.setTenBaiHoc( request.getTenBaiHoc() );
        baiHoc.setTieuDe( request.getTieuDe() );
        baiHoc.setSlug( request.getSlug() );
        baiHoc.setSoTrang( request.getSoTrang() );
        baiHoc.setSoThuTu( request.getSoThuTu() );

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
        baiHocResponse.setTenBaiHoc( entity.getTenBaiHoc() );
        baiHocResponse.setTieuDe( entity.getTieuDe() );
        baiHocResponse.setSlug( entity.getSlug() );
        baiHocResponse.setSoTrang( entity.getSoTrang() );
        baiHocResponse.setSoThuTu( entity.getSoThuTu() );
        baiHocResponse.setNgayTao( entity.getNgayTao() );

        return baiHocResponse;
    }

    @Override
    public void updateBaiHoc(BaiHocRequest request, BaiHoc entity) {
        if ( request == null ) {
            return;
        }

        entity.setBookIndexIdNgoai( request.getBookIndexIdNgoai() );
        entity.setTenBaiHoc( request.getTenBaiHoc() );
        entity.setTieuDe( request.getTieuDe() );
        entity.setSlug( request.getSlug() );
        entity.setSoTrang( request.getSoTrang() );
        entity.setSoThuTu( request.getSoThuTu() );
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
