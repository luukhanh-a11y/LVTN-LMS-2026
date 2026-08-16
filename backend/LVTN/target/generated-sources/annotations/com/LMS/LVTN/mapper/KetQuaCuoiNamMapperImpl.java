package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.KetQuaCuoiNamRequest;
import com.LMS.LVTN.dto.response.KetQuaCuoiNamResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.KetQuaCuoiNam;
import com.LMS.LVTN.entity.LopHoc;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-16T16:26:06+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class KetQuaCuoiNamMapperImpl implements KetQuaCuoiNamMapper {

    @Override
    public KetQuaCuoiNam toEntity(KetQuaCuoiNamRequest request) {
        if ( request == null ) {
            return null;
        }

        KetQuaCuoiNam ketQuaCuoiNam = new KetQuaCuoiNam();

        ketQuaCuoiNam.setDuocXetDacCach( request.getDuocXetDacCach() );
        ketQuaCuoiNam.setGhiChu( request.getGhiChu() );
        ketQuaCuoiNam.setKetQuaHocTap( request.getKetQuaHocTap() );
        ketQuaCuoiNam.setKetQuaRenLuyen( request.getKetQuaRenLuyen() );
        ketQuaCuoiNam.setLyDoDacCach( request.getLyDoDacCach() );
        ketQuaCuoiNam.setNamHoc( request.getNamHoc() );
        ketQuaCuoiNam.setNgayXet( request.getNgayXet() );
        ketQuaCuoiNam.setQuyetDinh( request.getQuyetDinh() );

        return ketQuaCuoiNam;
    }

    @Override
    public KetQuaCuoiNamResponse toResponse(KetQuaCuoiNam entity) {
        if ( entity == null ) {
            return null;
        }

        KetQuaCuoiNamResponse ketQuaCuoiNamResponse = new KetQuaCuoiNamResponse();

        ketQuaCuoiNamResponse.setHocSinhId( entityHocSinhHocSinhId( entity ) );
        ketQuaCuoiNamResponse.setHoTenHocSinh( entityHocSinhHoTen( entity ) );
        ketQuaCuoiNamResponse.setLopHocId( entityLopHocLopHocId( entity ) );
        ketQuaCuoiNamResponse.setTenLop( entityLopHocTenLop( entity ) );
        ketQuaCuoiNamResponse.setGiaoVienXetId( entityGiaoVienXetGiaoVienId( entity ) );
        ketQuaCuoiNamResponse.setTenGiaoVienXet( entityGiaoVienXetHoTen( entity ) );
        ketQuaCuoiNamResponse.setDaDuyet( entity.getDaDuyet() );
        ketQuaCuoiNamResponse.setDuocXetDacCach( entity.getDuocXetDacCach() );
        ketQuaCuoiNamResponse.setGhiChu( entity.getGhiChu() );
        ketQuaCuoiNamResponse.setKetQuaHocTap( entity.getKetQuaHocTap() );
        ketQuaCuoiNamResponse.setKetQuaId( entity.getKetQuaId() );
        ketQuaCuoiNamResponse.setKetQuaRenLuyen( entity.getKetQuaRenLuyen() );
        ketQuaCuoiNamResponse.setLyDoDacCach( entity.getLyDoDacCach() );
        ketQuaCuoiNamResponse.setNamHoc( entity.getNamHoc() );
        ketQuaCuoiNamResponse.setNgayXet( entity.getNgayXet() );
        ketQuaCuoiNamResponse.setQuyetDinh( entity.getQuyetDinh() );

        return ketQuaCuoiNamResponse;
    }

    @Override
    public void updateKetQuaCuoiNam(KetQuaCuoiNamRequest request, KetQuaCuoiNam entity) {
        if ( request == null ) {
            return;
        }

        entity.setDuocXetDacCach( request.getDuocXetDacCach() );
        entity.setGhiChu( request.getGhiChu() );
        entity.setKetQuaHocTap( request.getKetQuaHocTap() );
        entity.setKetQuaRenLuyen( request.getKetQuaRenLuyen() );
        entity.setLyDoDacCach( request.getLyDoDacCach() );
        entity.setNamHoc( request.getNamHoc() );
        entity.setNgayXet( request.getNgayXet() );
        entity.setQuyetDinh( request.getQuyetDinh() );
    }

    private Long entityHocSinhHocSinhId(KetQuaCuoiNam ketQuaCuoiNam) {
        HoSoHocSinh hocSinh = ketQuaCuoiNam.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHocSinhId();
    }

    private String entityHocSinhHoTen(KetQuaCuoiNam ketQuaCuoiNam) {
        HoSoHocSinh hocSinh = ketQuaCuoiNam.getHocSinh();
        if ( hocSinh == null ) {
            return null;
        }
        return hocSinh.getHoTen();
    }

    private Long entityLopHocLopHocId(KetQuaCuoiNam ketQuaCuoiNam) {
        LopHoc lopHoc = ketQuaCuoiNam.getLopHoc();
        if ( lopHoc == null ) {
            return null;
        }
        return lopHoc.getLopHocId();
    }

    private String entityLopHocTenLop(KetQuaCuoiNam ketQuaCuoiNam) {
        LopHoc lopHoc = ketQuaCuoiNam.getLopHoc();
        if ( lopHoc == null ) {
            return null;
        }
        return lopHoc.getTenLop();
    }

    private Long entityGiaoVienXetGiaoVienId(KetQuaCuoiNam ketQuaCuoiNam) {
        HoSoGiaoVien giaoVienXet = ketQuaCuoiNam.getGiaoVienXet();
        if ( giaoVienXet == null ) {
            return null;
        }
        return giaoVienXet.getGiaoVienId();
    }

    private String entityGiaoVienXetHoTen(KetQuaCuoiNam ketQuaCuoiNam) {
        HoSoGiaoVien giaoVienXet = ketQuaCuoiNam.getGiaoVienXet();
        if ( giaoVienXet == null ) {
            return null;
        }
        return giaoVienXet.getHoTen();
    }
}
