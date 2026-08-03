package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HuyHieuRequest;
import com.LMS.LVTN.dto.response.HuyHieuResponse;
import com.LMS.LVTN.entity.HuyHieu;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-30T21:55:01+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class HuyHieuMapperImpl implements HuyHieuMapper {

    @Override
    public HuyHieu toEntity(HuyHieuRequest request) {
        if ( request == null ) {
            return null;
        }

        HuyHieu huyHieu = new HuyHieu();

        huyHieu.setTenHuyHieu( request.getTenHuyHieu() );
        huyHieu.setMoTa( request.getMoTa() );
        huyHieu.setIconUrl( request.getIconUrl() );
        huyHieu.setLoai( request.getLoai() );
        huyHieu.setDieuKien( request.getDieuKien() );

        return huyHieu;
    }

    @Override
    public HuyHieuResponse toResponse(HuyHieu entity) {
        if ( entity == null ) {
            return null;
        }

        HuyHieuResponse huyHieuResponse = new HuyHieuResponse();

        huyHieuResponse.setHuyHieuId( entity.getHuyHieuId() );
        huyHieuResponse.setTenHuyHieu( entity.getTenHuyHieu() );
        huyHieuResponse.setMoTa( entity.getMoTa() );
        huyHieuResponse.setIconUrl( entity.getIconUrl() );
        huyHieuResponse.setLoai( entity.getLoai() );
        huyHieuResponse.setDieuKien( entity.getDieuKien() );

        return huyHieuResponse;
    }

    @Override
    public void updateHuyHieu(HuyHieuRequest request, HuyHieu entity) {
        if ( request == null ) {
            return;
        }

        entity.setTenHuyHieu( request.getTenHuyHieu() );
        entity.setMoTa( request.getMoTa() );
        entity.setIconUrl( request.getIconUrl() );
        entity.setLoai( request.getLoai() );
        entity.setDieuKien( request.getDieuKien() );
    }
}
