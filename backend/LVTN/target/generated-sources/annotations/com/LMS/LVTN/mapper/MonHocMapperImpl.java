package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.MonHocRequest;
import com.LMS.LVTN.dto.response.MonHocResponse;
import com.LMS.LVTN.entity.MonHoc;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T22:52:20+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class MonHocMapperImpl implements MonHocMapper {

    @Override
    public MonHoc toEntity(MonHocRequest request) {
        if ( request == null ) {
            return null;
        }

        MonHoc monHoc = new MonHoc();

        monHoc.setMaMon( request.getMaMon() );
        monHoc.setTenMon( request.getTenMon() );
        monHoc.setMoTa( request.getMoTa() );
        monHoc.setTrangThai( request.getTrangThai() );

        return monHoc;
    }

    @Override
    public MonHocResponse toResponse(MonHoc entity) {
        if ( entity == null ) {
            return null;
        }

        MonHocResponse monHocResponse = new MonHocResponse();

        monHocResponse.setMonHocId( entity.getMonHocId() );
        monHocResponse.setMaMon( entity.getMaMon() );
        monHocResponse.setTenMon( entity.getTenMon() );
        monHocResponse.setMoTa( entity.getMoTa() );
        monHocResponse.setTrangThai( entity.getTrangThai() );

        return monHocResponse;
    }

    @Override
    public void updateMonHoc(MonHocRequest request, MonHoc entity) {
        if ( request == null ) {
            return;
        }

        entity.setMaMon( request.getMaMon() );
        entity.setTenMon( request.getTenMon() );
        entity.setMoTa( request.getMoTa() );
        entity.setTrangThai( request.getTrangThai() );
    }
}
