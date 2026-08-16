package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.LopHocRequest;
import com.LMS.LVTN.dto.response.LopHocResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.entity.NamHoc;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T16:26:02+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class LopHocMapperImpl implements LopHocMapper {

    @Override
    public LopHoc toEntity(LopHocRequest request) {
        if ( request == null ) {
            return null;
        }

        LopHoc lopHoc = new LopHoc();

        lopHoc.setKhoiLop( request.getKhoiLop() );
        lopHoc.setSiSoToiDa( request.getSiSoToiDa() );
        lopHoc.setTenLop( request.getTenLop() );
        lopHoc.setTrangThai( request.getTrangThai() );

        return lopHoc;
    }

    @Override
    public LopHocResponse toResponse(LopHoc entity) {
        if ( entity == null ) {
            return null;
        }

        LopHocResponse lopHocResponse = new LopHocResponse();

        lopHocResponse.setNamHocId( entityNamHocNamHocId( entity ) );
        lopHocResponse.setTenNamHoc( entityNamHocTenNamHoc( entity ) );
        lopHocResponse.setGiaoVienChuNhiemId( entityGiaoVienChuNhiemGiaoVienId( entity ) );
        lopHocResponse.setTenGiaoVienChuNhiem( entityGiaoVienChuNhiemHoTen( entity ) );
        lopHocResponse.setKhoiLop( entity.getKhoiLop() );
        lopHocResponse.setLopHocId( entity.getLopHocId() );
        lopHocResponse.setSiSoToiDa( entity.getSiSoToiDa() );
        lopHocResponse.setTenLop( entity.getTenLop() );
        lopHocResponse.setTrangThai( entity.getTrangThai() );

        return lopHocResponse;
    }

    @Override
    public void updateLopHoc(LopHocRequest request, LopHoc entity) {
        if ( request == null ) {
            return;
        }

        entity.setKhoiLop( request.getKhoiLop() );
        entity.setSiSoToiDa( request.getSiSoToiDa() );
        entity.setTenLop( request.getTenLop() );
        entity.setTrangThai( request.getTrangThai() );
    }

    private Integer entityNamHocNamHocId(LopHoc lopHoc) {
        NamHoc namHoc = lopHoc.getNamHoc();
        if ( namHoc == null ) {
            return null;
        }
        return namHoc.getNamHocId();
    }

    private String entityNamHocTenNamHoc(LopHoc lopHoc) {
        NamHoc namHoc = lopHoc.getNamHoc();
        if ( namHoc == null ) {
            return null;
        }
        return namHoc.getTenNamHoc();
    }

    private Long entityGiaoVienChuNhiemGiaoVienId(LopHoc lopHoc) {
        HoSoGiaoVien giaoVienChuNhiem = lopHoc.getGiaoVienChuNhiem();
        if ( giaoVienChuNhiem == null ) {
            return null;
        }
        return giaoVienChuNhiem.getGiaoVienId();
    }

    private String entityGiaoVienChuNhiemHoTen(LopHoc lopHoc) {
        HoSoGiaoVien giaoVienChuNhiem = lopHoc.getGiaoVienChuNhiem();
        if ( giaoVienChuNhiem == null ) {
            return null;
        }
        return giaoVienChuNhiem.getHoTen();
    }
}
