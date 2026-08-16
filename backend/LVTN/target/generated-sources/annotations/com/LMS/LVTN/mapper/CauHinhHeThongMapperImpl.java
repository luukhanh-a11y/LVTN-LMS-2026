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
    date = "2026-08-16T16:26:03+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class CauHinhHeThongMapperImpl implements CauHinhHeThongMapper {

    @Override
    public CauHinhHeThong toEntity(CauHinhHeThongRequest request) {
        if ( request == null ) {
            return null;
        }

        CauHinhHeThong cauHinhHeThong = new CauHinhHeThong();

        cauHinhHeThong.setDiaChi( request.getDiaChi() );
        cauHinhHeThong.setEmailLienHe( request.getEmailLienHe() );
        cauHinhHeThong.setHotline( request.getHotline() );
        cauHinhHeThong.setLogoUrl( request.getLogoUrl() );
        cauHinhHeThong.setTenTruong( request.getTenTruong() );

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
        cauHinhHeThongResponse.setDanhGiaCuoiNamDangMo( entity.getDanhGiaCuoiNamDangMo() );
        cauHinhHeThongResponse.setDiaChi( entity.getDiaChi() );
        cauHinhHeThongResponse.setEmailLienHe( entity.getEmailLienHe() );
        cauHinhHeThongResponse.setHotline( entity.getHotline() );
        cauHinhHeThongResponse.setLogoUrl( entity.getLogoUrl() );
        cauHinhHeThongResponse.setNamHocDanhGia( entity.getNamHocDanhGia() );
        cauHinhHeThongResponse.setTenTruong( entity.getTenTruong() );

        return cauHinhHeThongResponse;
    }

    @Override
    public void updateCauHinhHeThong(CauHinhHeThongRequest request, CauHinhHeThong entity) {
        if ( request == null ) {
            return;
        }

        if ( request.getDiaChi() != null ) {
            entity.setDiaChi( request.getDiaChi() );
        }
        if ( request.getEmailLienHe() != null ) {
            entity.setEmailLienHe( request.getEmailLienHe() );
        }
        if ( request.getHotline() != null ) {
            entity.setHotline( request.getHotline() );
        }
        if ( request.getLogoUrl() != null ) {
            entity.setLogoUrl( request.getLogoUrl() );
        }
        if ( request.getTenTruong() != null ) {
            entity.setTenTruong( request.getTenTruong() );
        }
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
