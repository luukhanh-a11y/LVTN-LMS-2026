package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.TienDoHocSinhRequest;
import com.LMS.LVTN.dto.response.TienDoHocSinhResponse;
import com.LMS.LVTN.entity.BaiHoc;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.entity.NamHoc;
import com.LMS.LVTN.entity.TienDoHocSinh;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T16:26:05+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class TienDoHocSinhMapperImpl implements TienDoHocSinhMapper {

    @Override
    public TienDoHocSinh toEntity(TienDoHocSinhRequest request) {
        if ( request == null ) {
            return null;
        }

        TienDoHocSinh tienDoHocSinh = new TienDoHocSinh();

        tienDoHocSinh.setDaHoanThanh( request.getDaHoanThanh() );
        tienDoHocSinh.setLanXemCuoi( request.getLanXemCuoi() );
        tienDoHocSinh.setPhanTramHoanThanh( request.getPhanTramHoanThanh() );
        tienDoHocSinh.setThoiGianHoc( request.getThoiGianHoc() );

        return tienDoHocSinh;
    }

    @Override
    public TienDoHocSinhResponse toResponse(TienDoHocSinh entity) {
        if ( entity == null ) {
            return null;
        }

        TienDoHocSinhResponse tienDoHocSinhResponse = new TienDoHocSinhResponse();

        tienDoHocSinhResponse.setHocSinhId( entityHocSinhHocSinhId( entity ) );
        tienDoHocSinhResponse.setHoTenHocSinh( entityHocSinhHoTen( entity ) );
        tienDoHocSinhResponse.setBaiHocId( entityBaiHocBaiHocId( entity ) );
        tienDoHocSinhResponse.setTenBaiHoc( entityBaiHocTenBaiHoc( entity ) );
        tienDoHocSinhResponse.setHocKyId( entityHocKyHocKyId( entity ) );
        tienDoHocSinhResponse.setSoHocKy( entityHocKySoHocKy( entity ) );
        tienDoHocSinhResponse.setTenNamHoc( entityHocKyNamHocTenNamHoc( entity ) );
        tienDoHocSinhResponse.setDaHoanThanh( entity.getDaHoanThanh() );
        tienDoHocSinhResponse.setLanXemCuoi( entity.getLanXemCuoi() );
        tienDoHocSinhResponse.setPhanTramHoanThanh( entity.getPhanTramHoanThanh() );
        tienDoHocSinhResponse.setThoiGianHoc( entity.getThoiGianHoc() );
        tienDoHocSinhResponse.setTienDoId( entity.getTienDoId() );

        return tienDoHocSinhResponse;
    }

    @Override
    public void updateTienDoHocSinh(TienDoHocSinhRequest request, TienDoHocSinh entity) {
        if ( request == null ) {
            return;
        }

        entity.setDaHoanThanh( request.getDaHoanThanh() );
        entity.setLanXemCuoi( request.getLanXemCuoi() );
        entity.setPhanTramHoanThanh( request.getPhanTramHoanThanh() );
        entity.setThoiGianHoc( request.getThoiGianHoc() );
    }

    private Long entityHocSinhHocSinhId(TienDoHocSinh tienDoHocSinh) {
        HoSoHocSinh hocSinh = tienDoHocSinh.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHocSinhId();
    }

    private String entityHocSinhHoTen(TienDoHocSinh tienDoHocSinh) {
        HoSoHocSinh hocSinh = tienDoHocSinh.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHoTen();
    }

    private Integer entityBaiHocBaiHocId(TienDoHocSinh tienDoHocSinh) {
        BaiHoc baiHoc = tienDoHocSinh.getBaiHoc();
        if ( baiHoc == null ) {
            return null;
        }
        return baiHoc.getBaiHocId();
    }

    private String entityBaiHocTenBaiHoc(TienDoHocSinh tienDoHocSinh) {
        BaiHoc baiHoc = tienDoHocSinh.getBaiHoc();
        if ( baiHoc == null ) {
            return null;
        }
        return baiHoc.getTenBaiHoc();
    }

    private Integer entityHocKyHocKyId(TienDoHocSinh tienDoHocSinh) {
        HocKy hocKy = tienDoHocSinh.getHocKy();
        if ( hocKy == null ) {
            return null;
        }
        return hocKy.getHocKyId();
    }

    private Short entityHocKySoHocKy(TienDoHocSinh tienDoHocSinh) {
        HocKy hocKy = tienDoHocSinh.getHocKy();
        if ( hocKy == null ) {
            return null;
        }
        return hocKy.getSoHocKy();
    }

    private String entityHocKyNamHocTenNamHoc(TienDoHocSinh tienDoHocSinh) {
        HocKy hocKy = tienDoHocSinh.getHocKy();
        if ( hocKy == null ) {
            return null;
        }
        NamHoc namHoc = hocKy.getNamHoc();
        if ( namHoc == null ) {
            return null;
        }
        return namHoc.getTenNamHoc();
    }
}
