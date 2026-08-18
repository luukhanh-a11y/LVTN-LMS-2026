package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HopThuThongBaoRequest;
import com.LMS.LVTN.dto.response.HopThuThongBaoResponse;
import com.LMS.LVTN.entity.HopThuThongBao;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.ThongBao;
import com.LMS.LVTN.enums.LoaiThongBao;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-18T09:48:42+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class HopThuThongBaoMapperImpl implements HopThuThongBaoMapper {

    @Override
    public HopThuThongBao toEntity(HopThuThongBaoRequest request) {
        if ( request == null ) {
            return null;
        }

        HopThuThongBao hopThuThongBao = new HopThuThongBao();

        hopThuThongBao.setDaDoc( request.getDaDoc() );

        return hopThuThongBao;
    }

    @Override
    public HopThuThongBaoResponse toResponse(HopThuThongBao entity) {
        if ( entity == null ) {
            return null;
        }

        HopThuThongBaoResponse hopThuThongBaoResponse = new HopThuThongBaoResponse();

        hopThuThongBaoResponse.setNguoiDungId( entityNguoiDungNguoiDungId( entity ) );
        hopThuThongBaoResponse.setThongBaoId( entityThongBaoThongBaoId( entity ) );
        hopThuThongBaoResponse.setNguoiGuiId( entityThongBaoNguoiGuiNguoiDungId( entity ) );
        hopThuThongBaoResponse.setTenNguoiGui( entityThongBaoNguoiGuiTenDangNhap( entity ) );
        hopThuThongBaoResponse.setTieuDe( entityThongBaoTieuDe( entity ) );
        hopThuThongBaoResponse.setNoiDung( entityThongBaoNoiDung( entity ) );
        hopThuThongBaoResponse.setFileDinhKem( entityThongBaoFileDinhKem( entity ) );
        hopThuThongBaoResponse.setLoaiThongBao( entityThongBaoLoaiThongBao( entity ) );
        hopThuThongBaoResponse.setLaGhim( entityThongBaoLaGhim( entity ) );
        hopThuThongBaoResponse.setNgayDang( entityThongBaoNgayDang( entity ) );
        hopThuThongBaoResponse.setHopThuId( entity.getHopThuId() );
        hopThuThongBaoResponse.setDaDoc( entity.getDaDoc() );
        hopThuThongBaoResponse.setThoiDiemDoc( entity.getThoiDiemDoc() );

        return hopThuThongBaoResponse;
    }

    @Override
    public void updateHopThuThongBao(HopThuThongBaoRequest request, HopThuThongBao entity) {
        if ( request == null ) {
            return;
        }

        entity.setDaDoc( request.getDaDoc() );
    }

    private String entityNguoiDungNguoiDungId(HopThuThongBao hopThuThongBao) {
        NguoiDung nguoiDung = hopThuThongBao.getNguoiDung();
        if ( nguoiDung == null ) {
            return null;
        }
        return nguoiDung.getNguoiDungId();
    }

    private Long entityThongBaoThongBaoId(HopThuThongBao hopThuThongBao) {
        ThongBao thongBao = hopThuThongBao.getThongBao();
        if ( thongBao == null ) {
            return null;
        }
        return thongBao.getThongBaoId();
    }

    private String entityThongBaoNguoiGuiNguoiDungId(HopThuThongBao hopThuThongBao) {
        ThongBao thongBao = hopThuThongBao.getThongBao();
        if ( thongBao == null ) {
            return null;
        }
        NguoiDung nguoiGui = thongBao.getNguoiGui();
        if ( nguoiGui == null ) {
            return null;
        }
        return nguoiGui.getNguoiDungId();
    }

    private String entityThongBaoNguoiGuiTenDangNhap(HopThuThongBao hopThuThongBao) {
        ThongBao thongBao = hopThuThongBao.getThongBao();
        if ( thongBao == null ) {
            return null;
        }
        NguoiDung nguoiGui = thongBao.getNguoiGui();
        if ( nguoiGui == null ) {
            return null;
        }
        return nguoiGui.getTenDangNhap();
    }

    private String entityThongBaoTieuDe(HopThuThongBao hopThuThongBao) {
        ThongBao thongBao = hopThuThongBao.getThongBao();
        if ( thongBao == null ) {
            return null;
        }
        return thongBao.getTieuDe();
    }

    private String entityThongBaoNoiDung(HopThuThongBao hopThuThongBao) {
        ThongBao thongBao = hopThuThongBao.getThongBao();
        if ( thongBao == null ) {
            return null;
        }
        return thongBao.getNoiDung();
    }

    private String entityThongBaoFileDinhKem(HopThuThongBao hopThuThongBao) {
        ThongBao thongBao = hopThuThongBao.getThongBao();
        if ( thongBao == null ) {
            return null;
        }
        return thongBao.getFileDinhKem();
    }

    private LoaiThongBao entityThongBaoLoaiThongBao(HopThuThongBao hopThuThongBao) {
        ThongBao thongBao = hopThuThongBao.getThongBao();
        if ( thongBao == null ) {
            return null;
        }
        return thongBao.getLoaiThongBao();
    }

    private Boolean entityThongBaoLaGhim(HopThuThongBao hopThuThongBao) {
        ThongBao thongBao = hopThuThongBao.getThongBao();
        if ( thongBao == null ) {
            return null;
        }
        return thongBao.getLaGhim();
    }

    private LocalDateTime entityThongBaoNgayDang(HopThuThongBao hopThuThongBao) {
        ThongBao thongBao = hopThuThongBao.getThongBao();
        if ( thongBao == null ) {
            return null;
        }
        return thongBao.getNgayDang();
    }
}
