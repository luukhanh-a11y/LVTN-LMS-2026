package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.BaiTapRequest;
import com.LMS.LVTN.dto.response.BaiTapResponse;
import com.LMS.LVTN.entity.BaiTap;
import com.LMS.LVTN.entity.DangBai;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.entity.NamHoc;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T16:26:07+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class BaiTapMapperImpl implements BaiTapMapper {

    @Override
    public BaiTap toEntity(BaiTapRequest request) {
        if ( request == null ) {
            return null;
        }

        BaiTap baiTap = new BaiTap();

        baiTap.setDeadline( request.getDeadline() );
        baiTap.setLoaiBaiTap( request.getLoaiBaiTap() );
        baiTap.setMoTa( request.getMoTa() );
        baiTap.setSoLanNopLaiToiDa( request.getSoLanNopLaiToiDa() );
        baiTap.setThoiDiemBatDau( request.getThoiDiemBatDau() );
        baiTap.setTieuDe( request.getTieuDe() );
        baiTap.setTrangThai( request.getTrangThai() );

        return baiTap;
    }

    @Override
    public BaiTapResponse toResponse(BaiTap entity) {
        if ( entity == null ) {
            return null;
        }

        BaiTapResponse baiTapResponse = new BaiTapResponse();

        baiTapResponse.setGiaoVienId( entityGiaoVienGiaoVienId( entity ) );
        baiTapResponse.setTenGiaoVien( entityGiaoVienHoTen( entity ) );
        baiTapResponse.setLopHocId( entityLopHocLopHocId( entity ) );
        baiTapResponse.setTenLop( entityLopHocTenLop( entity ) );
        baiTapResponse.setDangBaiId( entityDangBaiDangBaiId( entity ) );
        baiTapResponse.setTenDangBai( entityDangBaiTenDangBai( entity ) );
        baiTapResponse.setHocKyId( entityHocKyHocKyId( entity ) );
        baiTapResponse.setSoHocKy( entityHocKySoHocKy( entity ) );
        baiTapResponse.setTenNamHoc( entityHocKyNamHocTenNamHoc( entity ) );
        baiTapResponse.setBaiTapId( entity.getBaiTapId() );
        baiTapResponse.setDeadline( entity.getDeadline() );
        baiTapResponse.setLoaiBaiTap( entity.getLoaiBaiTap() );
        baiTapResponse.setMoTa( entity.getMoTa() );
        baiTapResponse.setNgayTao( entity.getNgayTao() );
        baiTapResponse.setSoLanNopLaiToiDa( entity.getSoLanNopLaiToiDa() );
        baiTapResponse.setThoiDiemBatDau( entity.getThoiDiemBatDau() );
        baiTapResponse.setTieuDe( entity.getTieuDe() );
        baiTapResponse.setTrangThai( entity.getTrangThai() );

        return baiTapResponse;
    }

    @Override
    public void updateBaiTap(BaiTapRequest request, BaiTap entity) {
        if ( request == null ) {
            return;
        }

        entity.setDeadline( request.getDeadline() );
        entity.setLoaiBaiTap( request.getLoaiBaiTap() );
        entity.setMoTa( request.getMoTa() );
        entity.setSoLanNopLaiToiDa( request.getSoLanNopLaiToiDa() );
        entity.setThoiDiemBatDau( request.getThoiDiemBatDau() );
        entity.setTieuDe( request.getTieuDe() );
        entity.setTrangThai( request.getTrangThai() );
    }

    private Long entityGiaoVienGiaoVienId(BaiTap baiTap) {
        HoSoGiaoVien giaoVien = baiTap.getGiaoVien();
        if ( giaoVien == null ) {
            return null;
        }
        return giaoVien.getGiaoVienId();
    }

    private String entityGiaoVienHoTen(BaiTap baiTap) {
        HoSoGiaoVien giaoVien = baiTap.getGiaoVien();
        if ( giaoVien == null ) {
            return null;
        }
        return giaoVien.getHoTen();
    }

    private Long entityLopHocLopHocId(BaiTap baiTap) {
        LopHoc lopHoc = baiTap.getLopHoc();
        if ( lopHoc == null ) {
            return null;
        }
        return lopHoc.getLopHocId();
    }

    private String entityLopHocTenLop(BaiTap baiTap) {
        LopHoc lopHoc = baiTap.getLopHoc();
        if ( lopHoc == null ) {
            return null;
        }
        return lopHoc.getTenLop();
    }

    private Integer entityDangBaiDangBaiId(BaiTap baiTap) {
        DangBai dangBai = baiTap.getDangBai();
        if ( dangBai == null ) {
            return null;
        }
        return dangBai.getDangBaiId();
    }

    private String entityDangBaiTenDangBai(BaiTap baiTap) {
        DangBai dangBai = baiTap.getDangBai();
        if ( dangBai == null ) {
            return null;
        }
        return dangBai.getTenDangBai();
    }

    private Integer entityHocKyHocKyId(BaiTap baiTap) {
        HocKy hocKy = baiTap.getHocKy();
        if ( hocKy == null ) {
            return null;
        }
        return hocKy.getHocKyId();
    }

    private Short entityHocKySoHocKy(BaiTap baiTap) {
        HocKy hocKy = baiTap.getHocKy();
        if ( hocKy == null ) {
            return null;
        }
        return hocKy.getSoHocKy();
    }

    private String entityHocKyNamHocTenNamHoc(BaiTap baiTap) {
        HocKy hocKy = baiTap.getHocKy();
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
