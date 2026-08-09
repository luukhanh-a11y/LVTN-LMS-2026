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
    date = "2026-08-09T22:49:07+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class BaiTapMapperImpl implements BaiTapMapper {

    @Override
    public BaiTap toEntity(BaiTapRequest request) {
        if ( request == null ) {
            return null;
        }

        BaiTap baiTap = new BaiTap();

        baiTap.setTieuDe( request.getTieuDe() );
        baiTap.setMoTa( request.getMoTa() );
        baiTap.setLoaiBaiTap( request.getLoaiBaiTap() );
        baiTap.setThoiDiemBatDau( request.getThoiDiemBatDau() );
        baiTap.setDeadline( request.getDeadline() );
        baiTap.setSoLanNopLaiToiDa( request.getSoLanNopLaiToiDa() );
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
        baiTapResponse.setTieuDe( entity.getTieuDe() );
        baiTapResponse.setMoTa( entity.getMoTa() );
        baiTapResponse.setLoaiBaiTap( entity.getLoaiBaiTap() );
        baiTapResponse.setThoiDiemBatDau( entity.getThoiDiemBatDau() );
        baiTapResponse.setDeadline( entity.getDeadline() );
        baiTapResponse.setSoLanNopLaiToiDa( entity.getSoLanNopLaiToiDa() );
        baiTapResponse.setTrangThai( entity.getTrangThai() );
        baiTapResponse.setNgayTao( entity.getNgayTao() );

        return baiTapResponse;
    }

    @Override
    public void updateBaiTap(BaiTapRequest request, BaiTap entity) {
        if ( request == null ) {
            return;
        }

        entity.setTieuDe( request.getTieuDe() );
        entity.setMoTa( request.getMoTa() );
        entity.setLoaiBaiTap( request.getLoaiBaiTap() );
        entity.setThoiDiemBatDau( request.getThoiDiemBatDau() );
        entity.setDeadline( request.getDeadline() );
        entity.setSoLanNopLaiToiDa( request.getSoLanNopLaiToiDa() );
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
