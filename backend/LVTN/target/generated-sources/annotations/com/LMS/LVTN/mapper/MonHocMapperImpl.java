package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.MonHocRequest;
import com.LMS.LVTN.dto.response.MonHocResponse;
import com.LMS.LVTN.entity.MonHoc;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T16:26:02+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
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
        monHoc.setMoTa( request.getMoTa() );
        monHoc.setTenMon( request.getTenMon() );
        monHoc.setTrangThai( request.getTrangThai() );

        return monHoc;
    }

    @Override
    public MonHocResponse toResponse(MonHoc entity) {
        if ( entity == null ) {
            return null;
        }

        MonHocResponse monHocResponse = new MonHocResponse();

        monHocResponse.setMaMon( entity.getMaMon() );
        monHocResponse.setMoTa( entity.getMoTa() );
        monHocResponse.setMonHocId( entity.getMonHocId() );
        monHocResponse.setTenMon( entity.getTenMon() );
        monHocResponse.setTrangThai( entity.getTrangThai() );

        return monHocResponse;
    }

    @Override
    public void updateMonHoc(MonHocRequest request, MonHoc entity) {
        if ( request == null ) {
            return;
        }

        entity.setMaMon( request.getMaMon() );
        entity.setMoTa( request.getMoTa() );
        entity.setTenMon( request.getTenMon() );
        entity.setTrangThai( request.getTrangThai() );
    }
}
