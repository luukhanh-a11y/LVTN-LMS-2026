package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.CauHinhHeThongRequest;
import com.LMS.LVTN.dto.response.CauHinhHeThongResponse;
import com.LMS.LVTN.entity.CauHinhHeThong;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.entity.NamHoc;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-30T21:55:01+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class CauHinhHeThongMapperImpl implements CauHinhHeThongMapper {

    @Override
    public CauHinhHeThong toEntity(CauHinhHeThongRequest request) {
        if ( request == null ) {
            return null;
        }

        CauHinhHeThong cauHinhHeThong = new CauHinhHeThong();

        cauHinhHeThong.setTenTruong( request.getTenTruong() );
        cauHinhHeThong.setLogoUrl( request.getLogoUrl() );
        cauHinhHeThong.setDiaChi( request.getDiaChi() );
        cauHinhHeThong.setHotline( request.getHotline() );
        cauHinhHeThong.setEmailLienHe( request.getEmailLienHe() );

        return cauHinhHeThong;
    }

    @Override
    public CauHinhHeThongResponse toResponse(CauHinhHeThong entity) {
        if ( entity == null ) {
            return null;
        }

        CauHinhHeThongResponse cauHinhHeThongResponse = new CauHinhHeThongResponse();

        cauHinhHeThongResponse.setHocKyHienTaiId( entityHocKyHienTaiHocKyId( entity ) );
        cauHinhHeThongResponse.setSoHocKyHienTai( entityHocKyHienTaiSoHocKy( entity ) );
        cauHinhHeThongResponse.setTenNamHocHienTai( entityHocKyHienTaiNamHocTenNamHoc( entity ) );
        cauHinhHeThongResponse.setCauHinhId( entity.getCauHinhId() );
        cauHinhHeThongResponse.setTenTruong( entity.getTenTruong() );
        cauHinhHeThongResponse.setLogoUrl( entity.getLogoUrl() );
        cauHinhHeThongResponse.setDiaChi( entity.getDiaChi() );
        cauHinhHeThongResponse.setHotline( entity.getHotline() );
        cauHinhHeThongResponse.setEmailLienHe( entity.getEmailLienHe() );

        return cauHinhHeThongResponse;
    }

    @Override
    public void updateCauHinhHeThong(CauHinhHeThongRequest request, CauHinhHeThong entity) {
        if ( request == null ) {
            return;
        }

        entity.setTenTruong( request.getTenTruong() );
        entity.setLogoUrl( request.getLogoUrl() );
        entity.setDiaChi( request.getDiaChi() );
        entity.setHotline( request.getHotline() );
        entity.setEmailLienHe( request.getEmailLienHe() );
    }

    private Integer entityHocKyHienTaiHocKyId(CauHinhHeThong cauHinhHeThong) {
        HocKy hocKyHienTai = cauHinhHeThong.getHocKyHienTai();
        if ( hocKyHienTai == null ) {
            return null;
        }
        return hocKyHienTai.getHocKyId();
    }

    private Short entityHocKyHienTaiSoHocKy(CauHinhHeThong cauHinhHeThong) {
        HocKy hocKyHienTai = cauHinhHeThong.getHocKyHienTai();
        if ( hocKyHienTai == null ) {
            return null;
        }
        return hocKyHienTai.getSoHocKy();
    }

    private String entityHocKyHienTaiNamHocTenNamHoc(CauHinhHeThong cauHinhHeThong) {
        HocKy hocKyHienTai = cauHinhHeThong.getHocKyHienTai();
        if ( hocKyHienTai == null ) {
            return null;
        }
        NamHoc namHoc = hocKyHienTai.getNamHoc();
        if ( namHoc == null ) {
            return null;
        }
        return namHoc.getTenNamHoc();
    }
}
