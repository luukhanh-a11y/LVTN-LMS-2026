package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.NamHocRequest;
import com.LMS.LVTN.dto.response.NamHocResponse;
import com.LMS.LVTN.entity.NamHoc;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-09T22:49:07+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class NamHocMapperImpl implements NamHocMapper {

    @Override
    public NamHoc toEntity(NamHocRequest request) {
        if ( request == null ) {
            return null;
        }

        NamHoc namHoc = new NamHoc();

        namHoc.setTenNamHoc( request.getTenNamHoc() );
        namHoc.setNgayBatDau( request.getNgayBatDau() );
        namHoc.setNgayKetThuc( request.getNgayKetThuc() );

        return namHoc;
    }

    @Override
    public NamHocResponse toResponse(NamHoc entity) {
        if ( entity == null ) {
            return null;
        }

        NamHocResponse namHocResponse = new NamHocResponse();

        namHocResponse.setNamHocId( entity.getNamHocId() );
        namHocResponse.setTenNamHoc( entity.getTenNamHoc() );
        namHocResponse.setNgayBatDau( entity.getNgayBatDau() );
        namHocResponse.setNgayKetThuc( entity.getNgayKetThuc() );

        return namHocResponse;
    }

    @Override
    public void updateNamHoc(NamHocRequest request, NamHoc entity) {
        if ( request == null ) {
            return;
        }

        entity.setTenNamHoc( request.getTenNamHoc() );
        entity.setNgayBatDau( request.getNgayBatDau() );
        entity.setNgayKetThuc( request.getNgayKetThuc() );
    }
}
