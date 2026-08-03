package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.DangBaiRequest;
import com.LMS.LVTN.dto.response.DangBaiResponse;
import com.LMS.LVTN.dto.response.DangBaiStudentResponse;
import com.LMS.LVTN.entity.BaiHoc;
import com.LMS.LVTN.entity.DangBai;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-03T17:23:44+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class DangBaiMapperImpl extends DangBaiMapper {

    @Override
    public DangBai toEntity(DangBaiRequest request) {
        if ( request == null ) {
            return null;
        }

        DangBai dangBai = new DangBai();

        dangBai.setBookIndexIdNgoai( request.getBookIndexIdNgoai() );
        dangBai.setTenDangBai( request.getTenDangBai() );
        dangBai.setSlug( request.getSlug() );
        dangBai.setSoTrang( request.getSoTrang() );
        dangBai.setSoThuTu( request.getSoThuTu() );
        dangBai.setLoaiNoiDung( request.getLoaiNoiDung() );
        dangBai.setNguonGoc( request.getNguonGoc() );
        dangBai.setH5pNoiDungId( request.getH5pNoiDungId() );
        dangBai.setXpThuong( request.getXpThuong() );
        dangBai.setDuLieuGame( request.getDuLieuGame() );
        dangBai.setDapAnChuan( request.getDapAnChuan() );

        customMapping( request, dangBai );

        return dangBai;
    }

    @Override
    public DangBaiResponse toResponse(DangBai entity) {
        if ( entity == null ) {
            return null;
        }

        DangBaiResponse dangBaiResponse = new DangBaiResponse();

        dangBaiResponse.setBaiHocId( entityBaiHocBaiHocId( entity ) );
        dangBaiResponse.setTenBaiHoc( entityBaiHocTenBaiHoc( entity ) );
        dangBaiResponse.setGiaoVienId( entityGiaoVienGiaoVienId( entity ) );
        dangBaiResponse.setTenGiaoVien( entityGiaoVienHoTen( entity ) );
        dangBaiResponse.setDangBaiId( entity.getDangBaiId() );
        dangBaiResponse.setBookIndexIdNgoai( entity.getBookIndexIdNgoai() );
        dangBaiResponse.setTenDangBai( entity.getTenDangBai() );
        dangBaiResponse.setSlug( entity.getSlug() );
        dangBaiResponse.setSoTrang( entity.getSoTrang() );
        dangBaiResponse.setSoThuTu( entity.getSoThuTu() );
        dangBaiResponse.setLoaiNoiDung( entity.getLoaiNoiDung() );
        dangBaiResponse.setNguonGoc( entity.getNguonGoc() );
        dangBaiResponse.setH5pNoiDungId( entity.getH5pNoiDungId() );
        dangBaiResponse.setXpThuong( entity.getXpThuong() );
        dangBaiResponse.setDuLieuGame( entity.getDuLieuGame() );
        dangBaiResponse.setDapAnChuan( entity.getDapAnChuan() );
        dangBaiResponse.setNgayTao( entity.getNgayTao() );

        return dangBaiResponse;
    }

    @Override
    public DangBaiStudentResponse toStudentResponse(DangBai entity) {
        if ( entity == null ) {
            return null;
        }

        DangBaiStudentResponse dangBaiStudentResponse = new DangBaiStudentResponse();

        dangBaiStudentResponse.setBaiHocId( entityBaiHocBaiHocId( entity ) );
        dangBaiStudentResponse.setTenBaiHoc( entityBaiHocTenBaiHoc( entity ) );
        dangBaiStudentResponse.setGiaoVienId( entityGiaoVienGiaoVienId( entity ) );
        dangBaiStudentResponse.setTenGiaoVien( entityGiaoVienHoTen( entity ) );
        dangBaiStudentResponse.setDangBaiId( entity.getDangBaiId() );
        dangBaiStudentResponse.setBookIndexIdNgoai( entity.getBookIndexIdNgoai() );
        dangBaiStudentResponse.setTenDangBai( entity.getTenDangBai() );
        dangBaiStudentResponse.setSlug( entity.getSlug() );
        dangBaiStudentResponse.setSoTrang( entity.getSoTrang() );
        dangBaiStudentResponse.setSoThuTu( entity.getSoThuTu() );
        dangBaiStudentResponse.setLoaiNoiDung( entity.getLoaiNoiDung() );
        dangBaiStudentResponse.setNguonGoc( entity.getNguonGoc() );
        dangBaiStudentResponse.setH5pNoiDungId( entity.getH5pNoiDungId() );
        dangBaiStudentResponse.setXpThuong( entity.getXpThuong() );
        dangBaiStudentResponse.setDuLieuGame( entity.getDuLieuGame() );
        dangBaiStudentResponse.setNgayTao( entity.getNgayTao() );

        return dangBaiStudentResponse;
    }

    @Override
    public void updateEntityFromRequest(DangBaiRequest request, DangBai dangBai) {
        if ( request == null ) {
            return;
        }

        dangBai.setBaiHoc( mapBaiHoc( request.getBaiHocId() ) );
        dangBai.setGiaoVien( mapGiaoVien( request.getGiaoVienId() ) );
        dangBai.setBookIndexIdNgoai( request.getBookIndexIdNgoai() );
        dangBai.setTenDangBai( request.getTenDangBai() );
        dangBai.setSlug( request.getSlug() );
        dangBai.setSoTrang( request.getSoTrang() );
        dangBai.setSoThuTu( request.getSoThuTu() );
        dangBai.setLoaiNoiDung( request.getLoaiNoiDung() );
        dangBai.setNguonGoc( request.getNguonGoc() );
        dangBai.setH5pNoiDungId( request.getH5pNoiDungId() );
        dangBai.setXpThuong( request.getXpThuong() );
        dangBai.setDuLieuGame( request.getDuLieuGame() );
        dangBai.setDapAnChuan( request.getDapAnChuan() );

        customMapping( request, dangBai );
    }

    private Integer entityBaiHocBaiHocId(DangBai dangBai) {
        BaiHoc baiHoc = dangBai.getBaiHoc();
        if ( baiHoc == null ) {
            return null;
        }
        return baiHoc.getBaiHocId();
    }

    private String entityBaiHocTenBaiHoc(DangBai dangBai) {
        BaiHoc baiHoc = dangBai.getBaiHoc();
        if ( baiHoc == null ) {
            return null;
        }
        return baiHoc.getTenBaiHoc();
    }

    private Long entityGiaoVienGiaoVienId(DangBai dangBai) {
        HoSoGiaoVien giaoVien = dangBai.getGiaoVien();
        if ( giaoVien == null ) {
            return null;
        }
        return giaoVien.getGiaoVienId();
    }

    private String entityGiaoVienHoTen(DangBai dangBai) {
        HoSoGiaoVien giaoVien = dangBai.getGiaoVien();
        if ( giaoVien == null ) {
            return null;
        }
        return giaoVien.getHoTen();
    }
}
