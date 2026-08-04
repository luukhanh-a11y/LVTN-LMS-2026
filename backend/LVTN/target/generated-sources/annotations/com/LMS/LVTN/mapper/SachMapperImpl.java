package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.SachRequest;
import com.LMS.LVTN.dto.response.SachResponse;
import com.LMS.LVTN.entity.MonHoc;
import com.LMS.LVTN.entity.Sach;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-04T22:31:48+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class SachMapperImpl implements SachMapper {

    @Override
    public Sach toEntity(SachRequest request) {
        if ( request == null ) {
            return null;
        }

        Sach sach = new Sach();

        sach.setAnhBiaUrl( request.getAnhBiaUrl() );
        sach.setBanBienSoan( request.getBanBienSoan() );
        sach.setBanQuyen( request.getBanQuyen() );
        sach.setBoSach( request.getBoSach() );
        sach.setBookIdNgoai( request.getBookIdNgoai() );
        sach.setHocKy( request.getHocKy() );
        sach.setKhoiLop( request.getKhoiLop() );
        sach.setLoaiSach( request.getLoaiSach() );
        sach.setMoTa( request.getMoTa() );
        sach.setNamXuatBan( request.getNamXuatBan() );
        sach.setSlug( request.getSlug() );
        sach.setTenSach( request.getTenSach() );
        sach.setTongSoTrang( request.getTongSoTrang() );
        sach.setTrangThai( request.getTrangThai() );

        return sach;
    }

    @Override
    public SachResponse toResponse(Sach entity) {
        if ( entity == null ) {
            return null;
        }

        SachResponse sachResponse = new SachResponse();

        sachResponse.setMonHocId( entityMonHocMonHocId( entity ) );
        sachResponse.setTenMonHoc( entityMonHocTenMon( entity ) );
        sachResponse.setAnhBiaUrl( entity.getAnhBiaUrl() );
        sachResponse.setBanBienSoan( entity.getBanBienSoan() );
        sachResponse.setBanQuyen( entity.getBanQuyen() );
        sachResponse.setBoSach( entity.getBoSach() );
        sachResponse.setBookIdNgoai( entity.getBookIdNgoai() );
        sachResponse.setHocKy( entity.getHocKy() );
        sachResponse.setKhoiLop( entity.getKhoiLop() );
        sachResponse.setLoaiSach( entity.getLoaiSach() );
        sachResponse.setMoTa( entity.getMoTa() );
        sachResponse.setNamXuatBan( entity.getNamXuatBan() );
        sachResponse.setNgayCapNhat( entity.getNgayCapNhat() );
        sachResponse.setNgayTao( entity.getNgayTao() );
        sachResponse.setSachId( entity.getSachId() );
        sachResponse.setSlug( entity.getSlug() );
        sachResponse.setTenSach( entity.getTenSach() );
        sachResponse.setTongSoTrang( entity.getTongSoTrang() );
        sachResponse.setTrangThai( entity.getTrangThai() );

        return sachResponse;
    }

    @Override
    public void updateSach(SachRequest request, Sach entity) {
        if ( request == null ) {
            return;
        }

        entity.setAnhBiaUrl( request.getAnhBiaUrl() );
        entity.setBanBienSoan( request.getBanBienSoan() );
        entity.setBanQuyen( request.getBanQuyen() );
        entity.setBoSach( request.getBoSach() );
        entity.setBookIdNgoai( request.getBookIdNgoai() );
        entity.setHocKy( request.getHocKy() );
        entity.setKhoiLop( request.getKhoiLop() );
        entity.setLoaiSach( request.getLoaiSach() );
        entity.setMoTa( request.getMoTa() );
        entity.setNamXuatBan( request.getNamXuatBan() );
        entity.setSlug( request.getSlug() );
        entity.setTenSach( request.getTenSach() );
        entity.setTongSoTrang( request.getTongSoTrang() );
        entity.setTrangThai( request.getTrangThai() );
    }

    private Short entityMonHocMonHocId(Sach sach) {
        MonHoc monHoc = sach.getMonHoc();
        if ( monHoc == null ) {
            return null;
        }
        return monHoc.getMonHocId();
    }

    private String entityMonHocTenMon(Sach sach) {
        MonHoc monHoc = sach.getMonHoc();
        if ( monHoc == null ) {
            return null;
        }
        return monHoc.getTenMon();
    }
}
