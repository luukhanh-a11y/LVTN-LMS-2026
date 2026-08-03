// Force recompile
package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.DangBaiRequest;
import com.LMS.LVTN.dto.response.DangBaiResponse;
import com.LMS.LVTN.dto.response.DangBaiStudentResponse;
import com.LMS.LVTN.entity.DangBai;
import com.LMS.LVTN.entity.BaiHoc;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.repository.BaiHocRepository;
import com.LMS.LVTN.repository.HoSoGiaoVienRepository;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.enums.LoaiNoiDung;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class DangBaiMapper {

    @Autowired
    protected BaiHocRepository baiHocRepository;

    @Autowired
    protected HoSoGiaoVienRepository hoSoGiaoVienRepository;

    public abstract DangBai toEntity(DangBaiRequest request);

    @Mapping(source = "baiHoc.baiHocId", target = "baiHocId")
    @Mapping(source = "baiHoc.tenBaiHoc", target = "tenBaiHoc")
    @Mapping(source = "giaoVien.giaoVienId", target = "giaoVienId")
    @Mapping(source = "giaoVien.hoTen", target = "tenGiaoVien")
    public abstract DangBaiResponse toResponse(DangBai entity);

    @Mapping(source = "baiHoc.baiHocId", target = "baiHocId")
    @Mapping(source = "baiHoc.tenBaiHoc", target = "tenBaiHoc")
    @Mapping(source = "giaoVien.giaoVienId", target = "giaoVienId")
    @Mapping(source = "giaoVien.hoTen", target = "tenGiaoVien")
    public abstract DangBaiStudentResponse toStudentResponse(DangBai entity);

    @Mapping(target = "dangBaiId", ignore = true)
    @Mapping(target = "baiHoc", source = "baiHocId")
    @Mapping(target = "giaoVien", source = "giaoVienId")
    public abstract void updateEntityFromRequest(DangBaiRequest request, @MappingTarget DangBai dangBai);

    protected BaiHoc mapBaiHoc(Integer baiHocId) {
        if (baiHocId == null) {
            return null;
        }
        return baiHocRepository.findById(baiHocId)
                .orElseThrow(() -> new AppExceptions(Errorcode.BAI_HOC_NOT_FOUND));
    }

    protected HoSoGiaoVien mapGiaoVien(Long giaoVienId) {
        if (giaoVienId == null) {
            return null;
        }
        return hoSoGiaoVienRepository.findById(giaoVienId)
                .orElse(null);
    }

    @AfterMapping
    protected void customMapping(DangBaiRequest request, @MappingTarget DangBai dangBai) {
        if (request.getLoaiNoiDung() != LoaiNoiDung.JSON_TEXT) {
            dangBai.setDuLieuGame(request.getDuLieuGame());
            dangBai.setDapAnChuan(request.getDapAnChuan());
        }
    }
}
