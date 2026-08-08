package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.PhieuHoTroRequest;
import com.LMS.LVTN.dto.response.PhieuHoTroResponse;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.PhieuHoTro;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-08T11:16:16+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
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
        phieuHoTro.setTrangThai( request.getTrangThai() );
        phieuHoTro.setGhiChuXuLy( request.getGhiChuXuLy() );

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
        phieuHoTroResponse.setPhieuId( entity.getPhieuId() );
        phieuHoTroResponse.setLoaiYeuCau( entity.getLoaiYeuCau() );
        phieuHoTroResponse.setMoTa( entity.getMoTa() );
        phieuHoTroResponse.setTrangThai( entity.getTrangThai() );
        phieuHoTroResponse.setGhiChuXuLy( entity.getGhiChuXuLy() );
        phieuHoTroResponse.setNgayTao( entity.getNgayTao() );
        phieuHoTroResponse.setNgayXuLy( entity.getNgayXuLy() );

        return phieuHoTroResponse;
    }

    @Override
    public void updatePhieuHoTro(PhieuHoTroRequest request, PhieuHoTro entity) {
        if ( request == null ) {
            return;
        }

        if ( request.getLoaiYeuCau() != null ) {
            entity.setLoaiYeuCau( request.getLoaiYeuCau() );
        }
        if ( request.getMoTa() != null ) {
            entity.setMoTa( request.getMoTa() );
        }
        if ( request.getTrangThai() != null ) {
            entity.setTrangThai( request.getTrangThai() );
        }
        if ( request.getGhiChuXuLy() != null ) {
            entity.setGhiChuXuLy( request.getGhiChuXuLy() );
        }
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
