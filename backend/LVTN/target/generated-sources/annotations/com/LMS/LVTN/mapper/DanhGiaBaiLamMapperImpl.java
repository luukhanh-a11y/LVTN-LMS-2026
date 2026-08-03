package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.DanhGiaBaiLamRequest;
import com.LMS.LVTN.dto.response.DanhGiaBaiLamResponse;
import com.LMS.LVTN.entity.BaiNop;
import com.LMS.LVTN.entity.DanhGiaBaiLam;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-04T02:43:01+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class DanhGiaBaiLamMapperImpl implements DanhGiaBaiLamMapper {

    @Override
    public DanhGiaBaiLam toEntity(DanhGiaBaiLamRequest request) {
        if ( request == null ) {
            return null;
        }

        DanhGiaBaiLam danhGiaBaiLam = new DanhGiaBaiLam();

        danhGiaBaiLam.setDiemSo( request.getDiemSo() );
        danhGiaBaiLam.setHanhDong( request.getHanhDong() );
        danhGiaBaiLam.setNhanXet( request.getNhanXet() );
        danhGiaBaiLam.setXepLoai( request.getXepLoai() );

        return danhGiaBaiLam;
    }

    @Override
    public DanhGiaBaiLamResponse toResponse(DanhGiaBaiLam entity) {
        if ( entity == null ) {
            return null;
        }

        DanhGiaBaiLamResponse danhGiaBaiLamResponse = new DanhGiaBaiLamResponse();

        danhGiaBaiLamResponse.setBaiNopId( entityBaiNopBaiNopId( entity ) );
        danhGiaBaiLamResponse.setGiaoVienId( entityGiaoVienGiaoVienId( entity ) );
        danhGiaBaiLamResponse.setTenGiaoVien( entityGiaoVienHoTen( entity ) );
        danhGiaBaiLamResponse.setDanhGiaId( entity.getDanhGiaId() );
        danhGiaBaiLamResponse.setDiemSo( entity.getDiemSo() );
        danhGiaBaiLamResponse.setHanhDong( entity.getHanhDong() );
        danhGiaBaiLamResponse.setNhanXet( entity.getNhanXet() );
        danhGiaBaiLamResponse.setThoiDiemCham( entity.getThoiDiemCham() );
        danhGiaBaiLamResponse.setXepLoai( entity.getXepLoai() );

        return danhGiaBaiLamResponse;
    }

    @Override
    public void updateDanhGiaBaiLam(DanhGiaBaiLamRequest request, DanhGiaBaiLam entity) {
        if ( request == null ) {
            return;
        }

        entity.setDiemSo( request.getDiemSo() );
        entity.setHanhDong( request.getHanhDong() );
        entity.setNhanXet( request.getNhanXet() );
        entity.setXepLoai( request.getXepLoai() );
    }

    private Long entityBaiNopBaiNopId(DanhGiaBaiLam danhGiaBaiLam) {
        BaiNop baiNop = danhGiaBaiLam.getBaiNop();
        if ( baiNop == null ) {
            return null;
        }
        return baiNop.getBaiNopId();
    }

    private Long entityGiaoVienGiaoVienId(DanhGiaBaiLam danhGiaBaiLam) {
        HoSoGiaoVien giaoVien = danhGiaBaiLam.getGiaoVien();
        if ( giaoVien == null ) {
            return null;
        }
        return giaoVien.getGiaoVienId();
    }

    private String entityGiaoVienHoTen(DanhGiaBaiLam danhGiaBaiLam) {
        HoSoGiaoVien giaoVien = danhGiaBaiLam.getGiaoVien();
        if ( giaoVien == null ) {
            return null;
        }
        return giaoVien.getHoTen();
    }
}
