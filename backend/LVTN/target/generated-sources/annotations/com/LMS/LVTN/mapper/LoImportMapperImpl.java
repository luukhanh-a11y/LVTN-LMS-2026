package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.LoImportRequest;
import com.LMS.LVTN.dto.response.LoImportResponse;
import com.LMS.LVTN.entity.LoImport;
import com.LMS.LVTN.entity.NguoiDung;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-09T22:58:58+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class LoImportMapperImpl implements LoImportMapper {

    @Override
    public LoImport toEntity(LoImportRequest request) {
        if ( request == null ) {
            return null;
        }

        LoImport loImport = new LoImport();

        loImport.setLoaiImport( request.getLoaiImport() );
        loImport.setTenFile( request.getTenFile() );

        return loImport;
    }

    @Override
    public LoImportResponse toResponse(LoImport entity) {
        if ( entity == null ) {
            return null;
        }

        LoImportResponse loImportResponse = new LoImportResponse();

        loImportResponse.setNguoiThucHienId( entityNguoiThucHienNguoiDungId( entity ) );
        loImportResponse.setTenNguoiThucHien( entityNguoiThucHienTenDangNhap( entity ) );
        loImportResponse.setLoId( entity.getLoId() );
        loImportResponse.setLoaiImport( entity.getLoaiImport() );
        loImportResponse.setTenFile( entity.getTenFile() );
        loImportResponse.setTrangThai( entity.getTrangThai() );
        loImportResponse.setSoThanhCong( entity.getSoThanhCong() );
        loImportResponse.setChiTietLoi( entity.getChiTietLoi() );
        loImportResponse.setTomTatKetQua( entity.getTomTatKetQua() );
        loImportResponse.setThoiDiemImport( entity.getThoiDiemImport() );

        return loImportResponse;
    }

    @Override
    public void updateLoImport(LoImportRequest request, LoImport entity) {
        if ( request == null ) {
            return;
        }

        entity.setLoaiImport( request.getLoaiImport() );
        entity.setTenFile( request.getTenFile() );
    }

    private String entityNguoiThucHienNguoiDungId(LoImport loImport) {
        NguoiDung nguoiThucHien = loImport.getNguoiThucHien();
        if ( nguoiThucHien == null ) {
            return null;
        }
        return nguoiThucHien.getNguoiDungId();
    }

    private String entityNguoiThucHienTenDangNhap(LoImport loImport) {
        NguoiDung nguoiThucHien = loImport.getNguoiThucHien();
        if ( nguoiThucHien == null ) {
            return null;
        }
        return nguoiThucHien.getTenDangNhap();
    }
}
