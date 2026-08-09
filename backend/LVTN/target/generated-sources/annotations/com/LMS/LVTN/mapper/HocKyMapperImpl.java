package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HocKyRequest;
import com.LMS.LVTN.dto.response.HocKyResponse;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.entity.NamHoc;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-09T22:58:59+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class HocKyMapperImpl implements HocKyMapper {

    @Override
    public HocKy toEntity(HocKyRequest request) {
        if ( request == null ) {
            return null;
        }

        HocKy hocKy = new HocKy();

        hocKy.setSoHocKy( request.getSoHocKy() );

        return hocKy;
    }

    @Override
    public HocKyResponse toResponse(HocKy entity) {
        if ( entity == null ) {
            return null;
        }

        HocKyResponse hocKyResponse = new HocKyResponse();

        hocKyResponse.setNamHocId( entityNamHocNamHocId( entity ) );
        hocKyResponse.setTenNamHoc( entityNamHocTenNamHoc( entity ) );
        hocKyResponse.setHocKyId( entity.getHocKyId() );
        hocKyResponse.setSoHocKy( entity.getSoHocKy() );

        return hocKyResponse;
    }

    @Override
    public void updateHocKy(HocKyRequest request, HocKy entity) {
        if ( request == null ) {
            return;
        }

        entity.setSoHocKy( request.getSoHocKy() );
    }

    private Integer entityNamHocNamHocId(HocKy hocKy) {
        NamHoc namHoc = hocKy.getNamHoc();
        if ( namHoc == null ) {
            return null;
        }
        return namHoc.getNamHocId();
    }

    private String entityNamHocTenNamHoc(HocKy hocKy) {
        NamHoc namHoc = hocKy.getNamHoc();
        if ( namHoc == null ) {
            return null;
        }
        return namHoc.getTenNamHoc();
    }
}
