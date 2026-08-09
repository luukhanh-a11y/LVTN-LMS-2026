package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.NguoiDungCreateRequest;
import com.LMS.LVTN.dto.request.NguoiDungRequest;
import com.LMS.LVTN.dto.request.UpDateRoleUserRequest;
import com.LMS.LVTN.dto.request.UpdateTrangThaiUser;
import com.LMS.LVTN.dto.response.NguoiDungResponse;
import com.LMS.LVTN.entity.NguoiDung;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-09T22:58:59+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class NguoiDungMapperImpl implements NguoiDungMapper {

    @Override
    public NguoiDung toEntity(NguoiDungRequest request) {
        if ( request == null ) {
            return null;
        }

        NguoiDung nguoiDung = new NguoiDung();

        nguoiDung.setTenDangNhap( request.getTenDangNhap() );
        nguoiDung.setEmail( request.getEmail() );
        nguoiDung.setSoDienThoai( request.getSoDienThoai() );

        return nguoiDung;
    }

    @Override
    public NguoiDung toEntity(NguoiDungCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        NguoiDung nguoiDung = new NguoiDung();

        nguoiDung.setTenDangNhap( request.getTenDangNhap() );
        nguoiDung.setVaiTro( request.getVaiTro() );
        nguoiDung.setTrangThai( request.getTrangThai() );
        nguoiDung.setEmail( request.getEmail() );
        nguoiDung.setSoDienThoai( request.getSoDienThoai() );

        return nguoiDung;
    }

    @Override
    public NguoiDungResponse toResponse(NguoiDung entity) {
        if ( entity == null ) {
            return null;
        }

        NguoiDungResponse nguoiDungResponse = new NguoiDungResponse();

        nguoiDungResponse.setNguoiDungId( entity.getNguoiDungId() );
        nguoiDungResponse.setTenDangNhap( entity.getTenDangNhap() );
        nguoiDungResponse.setVaiTro( entity.getVaiTro() );
        nguoiDungResponse.setTrangThai( entity.getTrangThai() );
        nguoiDungResponse.setEmail( entity.getEmail() );
        nguoiDungResponse.setSoDienThoai( entity.getSoDienThoai() );

        return nguoiDungResponse;
    }

    @Override
    public void updateThongTinNguoiDung(NguoiDungRequest request, NguoiDung entity) {
        if ( request == null ) {
            return;
        }

        if ( request.getTenDangNhap() != null ) {
            entity.setTenDangNhap( request.getTenDangNhap() );
        }
        if ( request.getEmail() != null ) {
            entity.setEmail( request.getEmail() );
        }
        if ( request.getSoDienThoai() != null ) {
            entity.setSoDienThoai( request.getSoDienThoai() );
        }
    }

    @Override
    public void updateTrangThaiUser(UpdateTrangThaiUser request, NguoiDung entity) {
        if ( request == null ) {
            return;
        }

        entity.setTrangThai( request.getTrangThai() );
    }

    @Override
    public void updateRoleUser(UpDateRoleUserRequest request, NguoiDung entity) {
        if ( request == null ) {
            return;
        }
    }
}
