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
    date = "2026-08-04T02:43:02+0700",
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
        dangBai.setDapAnChuan( request.getDapAnChuan() );
        dangBai.setDuLieuGame( request.getDuLieuGame() );
        dangBai.setH5pNoiDungId( request.getH5pNoiDungId() );
        dangBai.setLoaiNoiDung( request.getLoaiNoiDung() );
        dangBai.setNguonGoc( request.getNguonGoc() );
        dangBai.setSlug( request.getSlug() );
        dangBai.setSoThuTu( request.getSoThuTu() );
        dangBai.setSoTrang( request.getSoTrang() );
        dangBai.setTenDangBai( request.getTenDangBai() );
        dangBai.setXpThuong( request.getXpThuong() );

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
        dangBaiResponse.setBookIndexIdNgoai( entity.getBookIndexIdNgoai() );
        dangBaiResponse.setDangBaiId( entity.getDangBaiId() );
        dangBaiResponse.setDapAnChuan( entity.getDapAnChuan() );
        dangBaiResponse.setDuLieuGame( entity.getDuLieuGame() );
        dangBaiResponse.setH5pNoiDungId( entity.getH5pNoiDungId() );
        dangBaiResponse.setLoaiNoiDung( entity.getLoaiNoiDung() );
        dangBaiResponse.setNgayTao( entity.getNgayTao() );
        dangBaiResponse.setNguonGoc( entity.getNguonGoc() );
        dangBaiResponse.setSlug( entity.getSlug() );
        dangBaiResponse.setSoThuTu( entity.getSoThuTu() );
        dangBaiResponse.setSoTrang( entity.getSoTrang() );
        dangBaiResponse.setTenDangBai( entity.getTenDangBai() );
        dangBaiResponse.setXpThuong( entity.getXpThuong() );

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
        dangBaiStudentResponse.setBookIndexIdNgoai( entity.getBookIndexIdNgoai() );
        dangBaiStudentResponse.setDangBaiId( entity.getDangBaiId() );
        dangBaiStudentResponse.setDuLieuGame( entity.getDuLieuGame() );
        dangBaiStudentResponse.setH5pNoiDungId( entity.getH5pNoiDungId() );
        dangBaiStudentResponse.setLoaiNoiDung( entity.getLoaiNoiDung() );
        dangBaiStudentResponse.setNgayTao( entity.getNgayTao() );
        dangBaiStudentResponse.setNguonGoc( entity.getNguonGoc() );
        dangBaiStudentResponse.setSlug( entity.getSlug() );
        dangBaiStudentResponse.setSoThuTu( entity.getSoThuTu() );
        dangBaiStudentResponse.setSoTrang( entity.getSoTrang() );
        dangBaiStudentResponse.setTenDangBai( entity.getTenDangBai() );
        dangBaiStudentResponse.setXpThuong( entity.getXpThuong() );

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
        dangBai.setDapAnChuan( request.getDapAnChuan() );
        dangBai.setDuLieuGame( request.getDuLieuGame() );
        dangBai.setH5pNoiDungId( request.getH5pNoiDungId() );
        dangBai.setLoaiNoiDung( request.getLoaiNoiDung() );
        dangBai.setNguonGoc( request.getNguonGoc() );
        dangBai.setSlug( request.getSlug() );
        dangBai.setSoThuTu( request.getSoThuTu() );
        dangBai.setSoTrang( request.getSoTrang() );
        dangBai.setTenDangBai( request.getTenDangBai() );
        dangBai.setXpThuong( request.getXpThuong() );

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
