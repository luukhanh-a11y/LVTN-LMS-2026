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
    date = "2026-08-17T04:21:30+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Oracle Corporation)"
)
@Component
public class KetQuaCuoiNamMapperImpl implements KetQuaCuoiNamMapper {

    @Override
    public KetQuaCuoiNam toEntity(KetQuaCuoiNamRequest request) {
        if ( request == null ) {
            return null;
        }

        KetQuaCuoiNam ketQuaCuoiNam = new KetQuaCuoiNam();

        ketQuaCuoiNam.setNamHoc( request.getNamHoc() );
        ketQuaCuoiNam.setKetQuaHocTap( request.getKetQuaHocTap() );
        ketQuaCuoiNam.setKetQuaRenLuyen( request.getKetQuaRenLuyen() );
        ketQuaCuoiNam.setQuyetDinh( request.getQuyetDinh() );
        ketQuaCuoiNam.setDuocXetDacCach( request.getDuocXetDacCach() );
        ketQuaCuoiNam.setLyDoDacCach( request.getLyDoDacCach() );
        ketQuaCuoiNam.setNgayXet( request.getNgayXet() );
        ketQuaCuoiNam.setGhiChu( request.getGhiChu() );

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
        ketQuaCuoiNamResponse.setKetQuaId( entity.getKetQuaId() );
        ketQuaCuoiNamResponse.setNamHoc( entity.getNamHoc() );
        ketQuaCuoiNamResponse.setKetQuaHocTap( entity.getKetQuaHocTap() );
        ketQuaCuoiNamResponse.setKetQuaRenLuyen( entity.getKetQuaRenLuyen() );
        ketQuaCuoiNamResponse.setQuyetDinh( entity.getQuyetDinh() );
        ketQuaCuoiNamResponse.setDuocXetDacCach( entity.getDuocXetDacCach() );
        ketQuaCuoiNamResponse.setLyDoDacCach( entity.getLyDoDacCach() );
        ketQuaCuoiNamResponse.setNgayXet( entity.getNgayXet() );
        ketQuaCuoiNamResponse.setGhiChu( entity.getGhiChu() );
        ketQuaCuoiNamResponse.setDaDuyet( entity.getDaDuyet() );

        return ketQuaCuoiNamResponse;
    }

    @Override
    public void updateKetQuaCuoiNam(KetQuaCuoiNamRequest request, KetQuaCuoiNam entity) {
        if ( request == null ) {
            return;
        }

        entity.setNamHoc( request.getNamHoc() );
        entity.setKetQuaHocTap( request.getKetQuaHocTap() );
        entity.setKetQuaRenLuyen( request.getKetQuaRenLuyen() );
        entity.setQuyetDinh( request.getQuyetDinh() );
        entity.setDuocXetDacCach( request.getDuocXetDacCach() );
        entity.setLyDoDacCach( request.getLyDoDacCach() );
        entity.setNgayXet( request.getNgayXet() );
        entity.setGhiChu( request.getGhiChu() );
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
