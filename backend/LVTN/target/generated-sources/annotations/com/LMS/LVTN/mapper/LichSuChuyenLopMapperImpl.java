package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.LichSuChuyenLopRequest;
import com.LMS.LVTN.dto.response.LichSuChuyenLopResponse;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.LichSuChuyenLop;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.entity.NguoiDung;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T22:52:20+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class LichSuChuyenLopMapperImpl implements LichSuChuyenLopMapper {

    @Override
    public LichSuChuyenLop toEntity(LichSuChuyenLopRequest request) {
        if ( request == null ) {
            return null;
        }

        LichSuChuyenLop lichSuChuyenLop = new LichSuChuyenLop();

        lichSuChuyenLop.setNamHocCu( request.getNamHocCu() );
        lichSuChuyenLop.setNamHocMoi( request.getNamHocMoi() );
        lichSuChuyenLop.setLyDo( request.getLyDo() );
        lichSuChuyenLop.setGhiChu( request.getGhiChu() );

        return lichSuChuyenLop;
    }

    @Override
    public LichSuChuyenLopResponse toResponse(LichSuChuyenLop entity) {
        if ( entity == null ) {
            return null;
        }

        LichSuChuyenLopResponse lichSuChuyenLopResponse = new LichSuChuyenLopResponse();

        lichSuChuyenLopResponse.setHocSinhId( entityHocSinhHocSinhId( entity ) );
        lichSuChuyenLopResponse.setHoTenHocSinh( entityHocSinhHoTen( entity ) );
        lichSuChuyenLopResponse.setLopCuId( entityLopCuLopHocId( entity ) );
        lichSuChuyenLopResponse.setTenLopCu( entityLopCuTenLop( entity ) );
        lichSuChuyenLopResponse.setLopMoiId( entityLopMoiLopHocId( entity ) );
        lichSuChuyenLopResponse.setTenLopMoi( entityLopMoiTenLop( entity ) );
        lichSuChuyenLopResponse.setNguoiThucHienId( entityNguoiThucHienNguoiDungId( entity ) );
        lichSuChuyenLopResponse.setTenNguoiThucHien( entityNguoiThucHienTenDangNhap( entity ) );
        lichSuChuyenLopResponse.setChuyenLopId( entity.getChuyenLopId() );
        lichSuChuyenLopResponse.setNamHocCu( entity.getNamHocCu() );
        lichSuChuyenLopResponse.setNamHocMoi( entity.getNamHocMoi() );
        lichSuChuyenLopResponse.setLyDo( entity.getLyDo() );
        lichSuChuyenLopResponse.setGhiChu( entity.getGhiChu() );
        lichSuChuyenLopResponse.setThoiDiemChuyen( entity.getThoiDiemChuyen() );

        return lichSuChuyenLopResponse;
    }

    @Override
    public void updateLichSuChuyenLop(LichSuChuyenLopRequest request, LichSuChuyenLop entity) {
        if ( request == null ) {
            return;
        }

        entity.setNamHocCu( request.getNamHocCu() );
        entity.setNamHocMoi( request.getNamHocMoi() );
        entity.setLyDo( request.getLyDo() );
        entity.setGhiChu( request.getGhiChu() );
    }

    private Long entityHocSinhHocSinhId(LichSuChuyenLop lichSuChuyenLop) {
        HoSoHocSinh hocSinh = lichSuChuyenLop.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHocSinhId();
    }

    private String entityHocSinhHoTen(LichSuChuyenLop lichSuChuyenLop) {
        HoSoHocSinh hocSinh = lichSuChuyenLop.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHoTen();
    }

    private Long entityLopCuLopHocId(LichSuChuyenLop lichSuChuyenLop) {
        LopHoc lopCu = lichSuChuyenLop.getLopCu();
        if ( lopCu == null ) {
            return null;
        }
        return lopCu.getLopHocId();
    }

    private String entityLopCuTenLop(LichSuChuyenLop lichSuChuyenLop) {
        LopHoc lopCu = lichSuChuyenLop.getLopCu();
        if ( lopCu == null ) {
            return null;
        }
        return lopCu.getTenLop();
    }

    private Long entityLopMoiLopHocId(LichSuChuyenLop lichSuChuyenLop) {
        LopHoc lopMoi = lichSuChuyenLop.getLopMoi();
        if ( lopMoi == null ) {
            return null;
        }
        return lopMoi.getLopHocId();
    }

    private String entityLopMoiTenLop(LichSuChuyenLop lichSuChuyenLop) {
        LopHoc lopMoi = lichSuChuyenLop.getLopMoi();
        if ( lopMoi == null ) {
            return null;
        }
        return lopMoi.getTenLop();
    }

    private String entityNguoiThucHienNguoiDungId(LichSuChuyenLop lichSuChuyenLop) {
        NguoiDung nguoiThucHien = lichSuChuyenLop.getNguoiThucHien();
        if ( nguoiThucHien == null ) {
            return null;
        }
        return nguoiThucHien.getNguoiDungId();
    }

    private String entityNguoiThucHienTenDangNhap(LichSuChuyenLop lichSuChuyenLop) {
        NguoiDung nguoiThucHien = lichSuChuyenLop.getNguoiThucHien();
        if ( nguoiThucHien == null ) {
            return null;
        }
        return nguoiThucHien.getTenDangNhap();
    }
}
