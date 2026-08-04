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
    date = "2026-08-04T22:31:49+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class NguoiDungMapperImpl implements NguoiDungMapper {

    @Override
    public NguoiDung toEntity(NguoiDungRequest request) {
        if ( request == null ) {
            return null;
        }

        NguoiDung nguoiDung = new NguoiDung();

        nguoiDung.setEmail( request.getEmail() );
        nguoiDung.setSoDienThoai( request.getSoDienThoai() );
        nguoiDung.setTenDangNhap( request.getTenDangNhap() );

        return nguoiDung;
    }

    @Override
    public NguoiDung toEntity(NguoiDungCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        NguoiDung nguoiDung = new NguoiDung();

        nguoiDung.setEmail( request.getEmail() );
        nguoiDung.setSoDienThoai( request.getSoDienThoai() );
        nguoiDung.setTenDangNhap( request.getTenDangNhap() );
        nguoiDung.setTrangThai( request.getTrangThai() );
        nguoiDung.setVaiTro( request.getVaiTro() );

        return nguoiDung;
    }

    @Override
    public NguoiDungResponse toResponse(NguoiDung entity) {
        if ( entity == null ) {
            return null;
        }

        NguoiDungResponse nguoiDungResponse = new NguoiDungResponse();

        nguoiDungResponse.setEmail( entity.getEmail() );
        nguoiDungResponse.setNguoiDungId( entity.getNguoiDungId() );
        nguoiDungResponse.setSoDienThoai( entity.getSoDienThoai() );
        nguoiDungResponse.setTenDangNhap( entity.getTenDangNhap() );
        nguoiDungResponse.setTrangThai( entity.getTrangThai() );
        nguoiDungResponse.setVaiTro( entity.getVaiTro() );

        return nguoiDungResponse;
    }

    @Override
    public void updateThongTinNguoiDung(NguoiDungRequest request, NguoiDung entity) {
        if ( request == null ) {
            return;
        }

        entity.setEmail( request.getEmail() );
        entity.setSoDienThoai( request.getSoDienThoai() );
        entity.setTenDangNhap( request.getTenDangNhap() );
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
