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
    date = "2026-08-09T22:49:06+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
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
        danhGiaBaiLam.setXepLoai( request.getXepLoai() );
        danhGiaBaiLam.setNhanXet( request.getNhanXet() );
        danhGiaBaiLam.setHanhDong( request.getHanhDong() );

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
        danhGiaBaiLamResponse.setXepLoai( entity.getXepLoai() );
        danhGiaBaiLamResponse.setNhanXet( entity.getNhanXet() );
        danhGiaBaiLamResponse.setHanhDong( entity.getHanhDong() );
        danhGiaBaiLamResponse.setThoiDiemCham( entity.getThoiDiemCham() );

        return danhGiaBaiLamResponse;
    }

    @Override
    public void updateDanhGiaBaiLam(DanhGiaBaiLamRequest request, DanhGiaBaiLam entity) {
        if ( request == null ) {
            return;
        }

        entity.setDiemSo( request.getDiemSo() );
        entity.setXepLoai( request.getXepLoai() );
        entity.setNhanXet( request.getNhanXet() );
        entity.setHanhDong( request.getHanhDong() );
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
