package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.SachRequest;
import com.LMS.LVTN.dto.response.SachResponse;
import com.LMS.LVTN.entity.MonHoc;
import com.LMS.LVTN.entity.Sach;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-30T21:55:01+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class SachMapperImpl implements SachMapper {

    @Override
    public Sach toEntity(SachRequest request) {
        if ( request == null ) {
            return null;
        }

        Sach sach = new Sach();

        sach.setBookIdNgoai( request.getBookIdNgoai() );
        sach.setLoaiSach( request.getLoaiSach() );
        sach.setBoSach( request.getBoSach() );
        sach.setKhoiLop( request.getKhoiLop() );
        sach.setHocKy( request.getHocKy() );
        sach.setTenSach( request.getTenSach() );
        sach.setSlug( request.getSlug() );
        sach.setMoTa( request.getMoTa() );
        sach.setAnhBiaUrl( request.getAnhBiaUrl() );
        sach.setTongSoTrang( request.getTongSoTrang() );
        sach.setNamXuatBan( request.getNamXuatBan() );
        sach.setBanQuyen( request.getBanQuyen() );
        sach.setBanBienSoan( request.getBanBienSoan() );
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
        sachResponse.setSachId( entity.getSachId() );
        sachResponse.setBookIdNgoai( entity.getBookIdNgoai() );
        sachResponse.setLoaiSach( entity.getLoaiSach() );
        sachResponse.setBoSach( entity.getBoSach() );
        sachResponse.setKhoiLop( entity.getKhoiLop() );
        sachResponse.setHocKy( entity.getHocKy() );
        sachResponse.setTenSach( entity.getTenSach() );
        sachResponse.setSlug( entity.getSlug() );
        sachResponse.setMoTa( entity.getMoTa() );
        sachResponse.setAnhBiaUrl( entity.getAnhBiaUrl() );
        sachResponse.setTongSoTrang( entity.getTongSoTrang() );
        sachResponse.setNamXuatBan( entity.getNamXuatBan() );
        sachResponse.setBanQuyen( entity.getBanQuyen() );
        sachResponse.setBanBienSoan( entity.getBanBienSoan() );
        sachResponse.setTrangThai( entity.getTrangThai() );
        sachResponse.setNgayTao( entity.getNgayTao() );
        sachResponse.setNgayCapNhat( entity.getNgayCapNhat() );

        return sachResponse;
    }

    @Override
    public void updateSach(SachRequest request, Sach entity) {
        if ( request == null ) {
            return;
        }

        entity.setBookIdNgoai( request.getBookIdNgoai() );
        entity.setLoaiSach( request.getLoaiSach() );
        entity.setBoSach( request.getBoSach() );
        entity.setKhoiLop( request.getKhoiLop() );
        entity.setHocKy( request.getHocKy() );
        entity.setTenSach( request.getTenSach() );
        entity.setSlug( request.getSlug() );
        entity.setMoTa( request.getMoTa() );
        entity.setAnhBiaUrl( request.getAnhBiaUrl() );
        entity.setTongSoTrang( request.getTongSoTrang() );
        entity.setNamXuatBan( request.getNamXuatBan() );
        entity.setBanQuyen( request.getBanQuyen() );
        entity.setBanBienSoan( request.getBanBienSoan() );
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
