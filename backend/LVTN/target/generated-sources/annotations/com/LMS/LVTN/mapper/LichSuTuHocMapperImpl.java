package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.LichSuTuHocRequest;
import com.LMS.LVTN.dto.response.LichSuTuHocResponse;
import com.LMS.LVTN.entity.DangBai;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.LichSuTuHoc;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T16:26:07+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class LichSuTuHocMapperImpl implements LichSuTuHocMapper {

    @Override
    public LichSuTuHoc toEntity(LichSuTuHocRequest request) {
        if ( request == null ) {
            return null;
        }

        LichSuTuHoc lichSuTuHoc = new LichSuTuHoc();

        lichSuTuHoc.setChiTietBaiLam( request.getChiTietBaiLam() );

        return lichSuTuHoc;
    }

    @Override
    public LichSuTuHocResponse toResponse(LichSuTuHoc entity) {
        if ( entity == null ) {
            return null;
        }

        LichSuTuHocResponse lichSuTuHocResponse = new LichSuTuHocResponse();

        lichSuTuHocResponse.setHocSinhId( entityHocSinhHocSinhId( entity ) );
        lichSuTuHocResponse.setHoTenHocSinh( entityHocSinhHoTen( entity ) );
        lichSuTuHocResponse.setDangBaiId( entityDangBaiDangBaiId( entity ) );
        lichSuTuHocResponse.setTenDangBai( entityDangBaiTenDangBai( entity ) );
        lichSuTuHocResponse.setDapAnChuan( entityDangBaiDapAnChuan( entity ) );
        lichSuTuHocResponse.setChiTietBaiLam( entity.getChiTietBaiLam() );
        lichSuTuHocResponse.setDiemSo( entity.getDiemSo() );
        lichSuTuHocResponse.setThoiGianNop( entity.getThoiGianNop() );
        lichSuTuHocResponse.setTuHocId( entity.getTuHocId() );

        return lichSuTuHocResponse;
    }

    @Override
    public void updateLichSuTuHoc(LichSuTuHocRequest request, LichSuTuHoc entity) {
        if ( request == null ) {
            return;
        }

        entity.setChiTietBaiLam( request.getChiTietBaiLam() );
    }

    private Long entityHocSinhHocSinhId(LichSuTuHoc lichSuTuHoc) {
        HoSoHocSinh hocSinh = lichSuTuHoc.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHocSinhId();
    }

    private String entityHocSinhHoTen(LichSuTuHoc lichSuTuHoc) {
        HoSoHocSinh hocSinh = lichSuTuHoc.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHoTen();
    }

    private Integer entityDangBaiDangBaiId(LichSuTuHoc lichSuTuHoc) {
        DangBai dangBai = lichSuTuHoc.getDangBai();
        if ( dangBai == null ) {
            return null;
        }
        return dangBai.getDangBaiId();
    }

    private String entityDangBaiTenDangBai(LichSuTuHoc lichSuTuHoc) {
        DangBai dangBai = lichSuTuHoc.getDangBai();
        if ( dangBai == null ) {
            return null;
        }
        return dangBai.getTenDangBai();
    }

    private String entityDangBaiDapAnChuan(LichSuTuHoc lichSuTuHoc) {
        DangBai dangBai = lichSuTuHoc.getDangBai();
        if ( dangBai == null ) {
            return null;
        }
        return dangBai.getDapAnChuan();
    }
}
