package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.PhieuHoTroRequest;
import com.LMS.LVTN.dto.response.PhieuHoTroResponse;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.PhieuHoTro;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-04T02:43:01+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class PhieuHoTroMapperImpl implements PhieuHoTroMapper {

    @Override
    public PhieuHoTro toEntity(PhieuHoTroRequest request) {
        if ( request == null ) {
            return null;
        }

        PhieuHoTro phieuHoTro = new PhieuHoTro();

        phieuHoTro.setLoaiYeuCau( request.getLoaiYeuCau() );
        phieuHoTro.setMoTa( request.getMoTa() );

        return phieuHoTro;
    }

    @Override
    public PhieuHoTroResponse toResponse(PhieuHoTro entity) {
        if ( entity == null ) {
            return null;
        }

        PhieuHoTroResponse phieuHoTroResponse = new PhieuHoTroResponse();

        phieuHoTroResponse.setNguoiDungTaoId( entityNguoiDungTaoNguoiDungId( entity ) );
        phieuHoTroResponse.setTenNguoiDungTao( entityNguoiDungTaoTenDangNhap( entity ) );
        phieuHoTroResponse.setNguoiDungLienQuanId( entityNguoiDungLienQuanNguoiDungId( entity ) );
        phieuHoTroResponse.setTenNguoiDungLienQuan( entityNguoiDungLienQuanTenDangNhap( entity ) );
        phieuHoTroResponse.setAdminXuLyId( entityAdminXuLyNguoiDungId( entity ) );
        phieuHoTroResponse.setTenAdminXuLy( entityAdminXuLyTenDangNhap( entity ) );
        phieuHoTroResponse.setGhiChuXuLy( entity.getGhiChuXuLy() );
        phieuHoTroResponse.setLoaiYeuCau( entity.getLoaiYeuCau() );
        phieuHoTroResponse.setMoTa( entity.getMoTa() );
        phieuHoTroResponse.setNgayTao( entity.getNgayTao() );
        phieuHoTroResponse.setNgayXuLy( entity.getNgayXuLy() );
        phieuHoTroResponse.setPhieuId( entity.getPhieuId() );
        phieuHoTroResponse.setTrangThai( entity.getTrangThai() );

        return phieuHoTroResponse;
    }

    @Override
    public void updatePhieuHoTro(PhieuHoTroRequest request, PhieuHoTro entity) {
        if ( request == null ) {
            return;
        }

        entity.setLoaiYeuCau( request.getLoaiYeuCau() );
        entity.setMoTa( request.getMoTa() );
    }

    private String entityNguoiDungTaoNguoiDungId(PhieuHoTro phieuHoTro) {
        NguoiDung nguoiDungTao = phieuHoTro.getNguoiDungTao();
        if ( nguoiDungTao == null ) {
            return null;
        }
        return nguoiDungTao.getNguoiDungId();
    }

    private String entityNguoiDungTaoTenDangNhap(PhieuHoTro phieuHoTro) {
        NguoiDung nguoiDungTao = phieuHoTro.getNguoiDungTao();
        if ( nguoiDungTao == null ) {
            return null;
        }
        return nguoiDungTao.getTenDangNhap();
    }

    private String entityNguoiDungLienQuanNguoiDungId(PhieuHoTro phieuHoTro) {
        NguoiDung nguoiDungLienQuan = phieuHoTro.getNguoiDungLienQuan();
        if ( nguoiDungLienQuan == null ) {
            return null;
        }
        return nguoiDungLienQuan.getNguoiDungId();
    }

    private String entityNguoiDungLienQuanTenDangNhap(PhieuHoTro phieuHoTro) {
        NguoiDung nguoiDungLienQuan = phieuHoTro.getNguoiDungLienQuan();
        if ( nguoiDungLienQuan == null ) {
            return null;
        }
        return nguoiDungLienQuan.getTenDangNhap();
    }

    private String entityAdminXuLyNguoiDungId(PhieuHoTro phieuHoTro) {
        NguoiDung adminXuLy = phieuHoTro.getAdminXuLy();
        if ( adminXuLy == null ) {
            return null;
        }
        return adminXuLy.getNguoiDungId();
    }

    private String entityAdminXuLyTenDangNhap(PhieuHoTro phieuHoTro) {
        NguoiDung adminXuLy = phieuHoTro.getAdminXuLy();
        if ( adminXuLy == null ) {
            return null;
        }
        return adminXuLy.getTenDangNhap();
    }
}
