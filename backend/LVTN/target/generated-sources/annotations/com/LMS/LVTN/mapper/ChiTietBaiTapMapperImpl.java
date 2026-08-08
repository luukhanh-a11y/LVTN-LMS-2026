package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.ChiTietBaiTapRequest;
import com.LMS.LVTN.dto.response.ChiTietBaiTapResponse;
import com.LMS.LVTN.entity.BaiTap;
import com.LMS.LVTN.entity.ChiTietBaiTap;
import com.LMS.LVTN.entity.DangBai;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-08T11:16:16+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class ChiTietBaiTapMapperImpl implements ChiTietBaiTapMapper {

    @Override
    public ChiTietBaiTap toEntity(ChiTietBaiTapRequest request) {
        if ( request == null ) {
            return null;
        }

        ChiTietBaiTap chiTietBaiTap = new ChiTietBaiTap();

        chiTietBaiTap.setThuTu( request.getThuTu() );
        chiTietBaiTap.setCheDoGiaoDien( request.getCheDoGiaoDien() );

        return chiTietBaiTap;
    }

    @Override
    public ChiTietBaiTapResponse toResponse(ChiTietBaiTap entity) {
        if ( entity == null ) {
            return null;
        }

        ChiTietBaiTapResponse.ChiTietBaiTapResponseBuilder chiTietBaiTapResponse = ChiTietBaiTapResponse.builder();

        chiTietBaiTapResponse.baiTapId( entityBaiTapBaiTapId( entity ) );
        chiTietBaiTapResponse.dangBaiId( entityDangBaiDangBaiId( entity ) );
        chiTietBaiTapResponse.id( entity.getId() );
        chiTietBaiTapResponse.thuTu( entity.getThuTu() );
        chiTietBaiTapResponse.cheDoGiaoDien( entity.getCheDoGiaoDien() );

        return chiTietBaiTapResponse.build();
    }

    @Override
    public void updateChiTietBaiTap(ChiTietBaiTapRequest request, ChiTietBaiTap entity) {
        if ( request == null ) {
            return;
        }

        entity.setThuTu( request.getThuTu() );
        entity.setCheDoGiaoDien( request.getCheDoGiaoDien() );
    }

    private Long entityBaiTapBaiTapId(ChiTietBaiTap chiTietBaiTap) {
        BaiTap baiTap = chiTietBaiTap.getBaiTap();
        if ( baiTap == null ) {
            return null;
        }
        return baiTap.getBaiTapId();
    }

    private Integer entityDangBaiDangBaiId(ChiTietBaiTap chiTietBaiTap) {
        DangBai dangBai = chiTietBaiTap.getDangBai();
        if ( dangBai == null ) {
            return null;
        }
        return dangBai.getDangBaiId();
    }
}
