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
    date = "2026-08-07T23:40:25+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class BaiNopMapperImpl implements BaiNopMapper {

    @Override
    public BaiNop toEntity(BaiNopRequest request) {
        if ( request == null ) {
            return null;
        }

        BaiNop baiNop = new BaiNop();

        baiNop.setChiTietBaiLam( request.getChiTietBaiLam() );
        baiNop.setFileDinhKem( request.getFileDinhKem() );
        baiNop.setNoiDungText( request.getNoiDungText() );

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
        baiNopResponse.setChiTietBaiLam( entity.getChiTietBaiLam() );
        baiNopResponse.setDiemTuDong( entity.getDiemTuDong() );
        baiNopResponse.setFileDinhKem( entity.getFileDinhKem() );
        baiNopResponse.setLaNopTre( entity.getLaNopTre() );
        baiNopResponse.setNoiDungText( entity.getNoiDungText() );
        baiNopResponse.setSoLanLam( entity.getSoLanLam() );
        baiNopResponse.setThoiDiemNop( entity.getThoiDiemNop() );
        baiNopResponse.setTrangThai( entity.getTrangThai() );
        baiNopResponse.setXpNhanDuoc( entity.getXpNhanDuoc() );

        return baiNopResponse;
    }

    @Override
    public void updateBaiNop(BaiNopRequest request, BaiNop entity) {
        if ( request == null ) {
            return;
        }

        if ( request.getChiTietBaiLam() != null ) {
            entity.setChiTietBaiLam( request.getChiTietBaiLam() );
        }
        if ( request.getFileDinhKem() != null ) {
            entity.setFileDinhKem( request.getFileDinhKem() );
        }
        if ( request.getNoiDungText() != null ) {
            entity.setNoiDungText( request.getNoiDungText() );
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
