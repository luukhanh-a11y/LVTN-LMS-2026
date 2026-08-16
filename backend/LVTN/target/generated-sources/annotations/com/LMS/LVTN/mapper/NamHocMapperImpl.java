package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.NamHocRequest;
import com.LMS.LVTN.dto.response.NamHocResponse;
import com.LMS.LVTN.entity.NamHoc;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T16:26:05+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class NamHocMapperImpl implements NamHocMapper {

    @Override
    public NamHoc toEntity(NamHocRequest request) {
        if ( request == null ) {
            return null;
        }

        NamHoc namHoc = new NamHoc();

        namHoc.setNgayBatDau( request.getNgayBatDau() );
        namHoc.setNgayKetThuc( request.getNgayKetThuc() );
        namHoc.setTenNamHoc( request.getTenNamHoc() );

        return namHoc;
    }

    @Override
    public NamHocResponse toResponse(NamHoc entity) {
        if ( entity == null ) {
            return null;
        }

        NamHocResponse namHocResponse = new NamHocResponse();

        namHocResponse.setNamHocId( entity.getNamHocId() );
        namHocResponse.setNgayBatDau( entity.getNgayBatDau() );
        namHocResponse.setNgayKetThuc( entity.getNgayKetThuc() );
        namHocResponse.setTenNamHoc( entity.getTenNamHoc() );

        return namHocResponse;
    }

    @Override
    public void updateNamHoc(NamHocRequest request, NamHoc entity) {
        if ( request == null ) {
            return;
        }

        entity.setNgayBatDau( request.getNgayBatDau() );
        entity.setNgayKetThuc( request.getNgayKetThuc() );
        entity.setTenNamHoc( request.getTenNamHoc() );
    }
}
