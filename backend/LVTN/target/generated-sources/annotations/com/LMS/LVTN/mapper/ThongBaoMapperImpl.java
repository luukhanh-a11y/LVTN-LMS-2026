package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.ThongBaoRequest;
import com.LMS.LVTN.dto.response.ThongBaoResponse;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.ThongBao;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-09T22:49:07+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class ThongBaoMapperImpl implements ThongBaoMapper {

    @Override
    public ThongBao toEntity(ThongBaoRequest request) {
        if ( request == null ) {
            return null;
        }

        ThongBao thongBao = new ThongBao();

        thongBao.setTieuDe( request.getTieuDe() );
        thongBao.setNoiDung( request.getNoiDung() );
        thongBao.setFileDinhKem( request.getFileDinhKem() );
        thongBao.setLoaiThongBao( request.getLoaiThongBao() );
        thongBao.setLaGhim( request.getLaGhim() );

        return thongBao;
    }

    @Override
    public ThongBaoResponse toResponse(ThongBao entity) {
        if ( entity == null ) {
            return null;
        }

        ThongBaoResponse thongBaoResponse = new ThongBaoResponse();

        thongBaoResponse.setNguoiGuiId( entityNguoiGuiNguoiDungId( entity ) );
        thongBaoResponse.setTenNguoiGui( entityNguoiGuiTenDangNhap( entity ) );
        thongBaoResponse.setThongBaoId( entity.getThongBaoId() );
        thongBaoResponse.setTieuDe( entity.getTieuDe() );
        thongBaoResponse.setNoiDung( entity.getNoiDung() );
        thongBaoResponse.setFileDinhKem( entity.getFileDinhKem() );
        thongBaoResponse.setLoaiThongBao( entity.getLoaiThongBao() );
        thongBaoResponse.setLaGhim( entity.getLaGhim() );
        thongBaoResponse.setNgayDang( entity.getNgayDang() );

        return thongBaoResponse;
    }

    @Override
    public void updateThongBao(ThongBaoRequest request, ThongBao entity) {
        if ( request == null ) {
            return;
        }

        entity.setTieuDe( request.getTieuDe() );
        entity.setNoiDung( request.getNoiDung() );
        entity.setFileDinhKem( request.getFileDinhKem() );
        entity.setLoaiThongBao( request.getLoaiThongBao() );
        entity.setLaGhim( request.getLaGhim() );
    }

    private String entityNguoiGuiNguoiDungId(ThongBao thongBao) {
        NguoiDung nguoiGui = thongBao.getNguoiGui();
        if ( nguoiGui == null ) {
            return null;
        }
        return nguoiGui.getNguoiDungId();
    }

    private String entityNguoiGuiTenDangNhap(ThongBao thongBao) {
        NguoiDung nguoiGui = thongBao.getNguoiGui();
        if ( nguoiGui == null ) {
            return null;
        }
        return nguoiGui.getTenDangNhap();
    }
}
