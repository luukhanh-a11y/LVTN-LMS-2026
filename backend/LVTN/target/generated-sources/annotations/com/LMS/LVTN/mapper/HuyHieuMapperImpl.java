package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HuyHieuRequest;
import com.LMS.LVTN.dto.response.HuyHieuResponse;
import com.LMS.LVTN.entity.HuyHieu;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T16:26:02+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class HuyHieuMapperImpl implements HuyHieuMapper {

    @Override
    public HuyHieu toEntity(HuyHieuRequest request) {
        if ( request == null ) {
            return null;
        }

        HuyHieu huyHieu = new HuyHieu();

        huyHieu.setDieuKien( request.getDieuKien() );
        huyHieu.setIconUrl( request.getIconUrl() );
        huyHieu.setLoai( request.getLoai() );
        huyHieu.setMoTa( request.getMoTa() );
        huyHieu.setTenHuyHieu( request.getTenHuyHieu() );

        return huyHieu;
    }

    @Override
    public HuyHieuResponse toResponse(HuyHieu entity) {
        if ( entity == null ) {
            return null;
        }

        HuyHieuResponse huyHieuResponse = new HuyHieuResponse();

        huyHieuResponse.setDieuKien( entity.getDieuKien() );
        huyHieuResponse.setHuyHieuId( entity.getHuyHieuId() );
        huyHieuResponse.setIconUrl( entity.getIconUrl() );
        huyHieuResponse.setLoai( entity.getLoai() );
        huyHieuResponse.setMoTa( entity.getMoTa() );
        huyHieuResponse.setTenHuyHieu( entity.getTenHuyHieu() );

        return huyHieuResponse;
    }

    @Override
    public void updateHuyHieu(HuyHieuRequest request, HuyHieu entity) {
        if ( request == null ) {
            return;
        }

        entity.setDieuKien( request.getDieuKien() );
        entity.setIconUrl( request.getIconUrl() );
        entity.setLoai( request.getLoai() );
        entity.setMoTa( request.getMoTa() );
        entity.setTenHuyHieu( request.getTenHuyHieu() );
    }
}
