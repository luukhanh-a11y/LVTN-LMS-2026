package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.BaiNopRequest;
import com.LMS.LVTN.dto.response.BaiNopResponse;
import com.LMS.LVTN.entity.BaiNop;
import com.LMS.LVTN.entity.BaiTap;
import com.LMS.LVTN.entity.HoSoHocSinh;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-04T01:11:46+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class BaiNopMapperImpl implements BaiNopMapper {

    @Override
    public BaiNop toEntity(BaiNopRequest request) {
        if ( request == null ) {
            return null;
        }

        BaiNop baiNop = new BaiNop();

        baiNop.setNoiDungText( request.getNoiDungText() );
        baiNop.setFileDinhKem( request.getFileDinhKem() );
        baiNop.setDiemTuDong( request.getDiemTuDong() );
        baiNop.setXpNhanDuoc( request.getXpNhanDuoc() );
        baiNop.setChiTietBaiLam( request.getChiTietBaiLam() );
        baiNop.setSoLanLam( request.getSoLanLam() );
        baiNop.setTrangThai( request.getTrangThai() );
        baiNop.setLaNopTre( request.getLaNopTre() );
        baiNop.setThoiDiemNop( request.getThoiDiemNop() );

        return baiNop;
    }

    @Override
    public BaiNopResponse toResponse(BaiNop entity) {
        if ( entity == null ) {
            return null;
        }

        BaiNopResponse baiNopResponse = new BaiNopResponse();

        baiNopResponse.setBaiTapId( entityBaiTapBaiTapId( entity ) );
        baiNopResponse.setTieuDeBaiTap( entityBaiTapTieuDe( entity ) );
        baiNopResponse.setHocSinhId( entityHocSinhHocSinhId( entity ) );
        baiNopResponse.setHoTenHocSinh( entityHocSinhHoTen( entity ) );
        baiNopResponse.setBaiNopId( entity.getBaiNopId() );
        baiNopResponse.setNoiDungText( entity.getNoiDungText() );
        baiNopResponse.setFileDinhKem( entity.getFileDinhKem() );
        baiNopResponse.setDiemTuDong( entity.getDiemTuDong() );
        baiNopResponse.setXpNhanDuoc( entity.getXpNhanDuoc() );
        baiNopResponse.setChiTietBaiLam( entity.getChiTietBaiLam() );
        baiNopResponse.setSoLanLam( entity.getSoLanLam() );
        baiNopResponse.setTrangThai( entity.getTrangThai() );
        baiNopResponse.setLaNopTre( entity.getLaNopTre() );
        baiNopResponse.setThoiDiemNop( entity.getThoiDiemNop() );

        return baiNopResponse;
    }

    @Override
    public void updateBaiNop(BaiNopRequest request, BaiNop entity) {
        if ( request == null ) {
            return;
        }

        if ( request.getNoiDungText() != null ) {
            entity.setNoiDungText( request.getNoiDungText() );
        }
        if ( request.getFileDinhKem() != null ) {
            entity.setFileDinhKem( request.getFileDinhKem() );
        }
        if ( request.getDiemTuDong() != null ) {
            entity.setDiemTuDong( request.getDiemTuDong() );
        }
        if ( request.getXpNhanDuoc() != null ) {
            entity.setXpNhanDuoc( request.getXpNhanDuoc() );
        }
        if ( request.getChiTietBaiLam() != null ) {
            entity.setChiTietBaiLam( request.getChiTietBaiLam() );
        }
        if ( request.getSoLanLam() != null ) {
            entity.setSoLanLam( request.getSoLanLam() );
        }
        if ( request.getTrangThai() != null ) {
            entity.setTrangThai( request.getTrangThai() );
        }
        if ( request.getLaNopTre() != null ) {
            entity.setLaNopTre( request.getLaNopTre() );
        }
        if ( request.getThoiDiemNop() != null ) {
            entity.setThoiDiemNop( request.getThoiDiemNop() );
        }
    }

    private Long entityBaiTapBaiTapId(BaiNop baiNop) {
        BaiTap baiTap = baiNop.getBaiTap();
        if ( baiTap == null ) {
            return null;
        }
        return baiTap.getBaiTapId();
    }

    private String entityBaiTapTieuDe(BaiNop baiNop) {
        BaiTap baiTap = baiNop.getBaiTap();
        if ( baiTap == null ) {
            return null;
        }
        return baiTap.getTieuDe();
    }

    private Long entityHocSinhHocSinhId(BaiNop baiNop) {
        HoSoHocSinh hocSinh = baiNop.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHocSinhId();
    }

    private String entityHocSinhHoTen(BaiNop baiNop) {
        HoSoHocSinh hocSinh = baiNop.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHoTen();
    }
}
