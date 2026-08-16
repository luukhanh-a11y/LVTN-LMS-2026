package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.ThongBaoRequest;
import com.LMS.LVTN.dto.response.ThongBaoResponse;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.ThongBao;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T16:26:02+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class ThongBaoMapperImpl implements ThongBaoMapper {

    @Override
    public ThongBao toEntity(ThongBaoRequest request) {
        if ( request == null ) {
            return null;
        }

        ThongBao thongBao = new ThongBao();

        thongBao.setFileDinhKem( request.getFileDinhKem() );
        thongBao.setLaGhim( request.getLaGhim() );
        thongBao.setLoaiThongBao( request.getLoaiThongBao() );
        thongBao.setNoiDung( request.getNoiDung() );
        thongBao.setTieuDe( request.getTieuDe() );

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
        thongBaoResponse.setFileDinhKem( entity.getFileDinhKem() );
        thongBaoResponse.setLaGhim( entity.getLaGhim() );
        thongBaoResponse.setLoaiThongBao( entity.getLoaiThongBao() );
        thongBaoResponse.setNgayDang( entity.getNgayDang() );
        thongBaoResponse.setNoiDung( entity.getNoiDung() );
        thongBaoResponse.setThongBaoId( entity.getThongBaoId() );
        thongBaoResponse.setTieuDe( entity.getTieuDe() );

        return thongBaoResponse;
    }

    @Override
    public void updateThongBao(ThongBaoRequest request, ThongBao entity) {
        if ( request == null ) {
            return;
        }

        entity.setFileDinhKem( request.getFileDinhKem() );
        entity.setLaGhim( request.getLaGhim() );
        entity.setLoaiThongBao( request.getLoaiThongBao() );
        entity.setNoiDung( request.getNoiDung() );
        entity.setTieuDe( request.getTieuDe() );
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
