package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.KetQuaCuoiNamRequest;
import com.LMS.LVTN.dto.response.KetQuaCuoiNamResponse;
import com.LMS.LVTN.entity.KetQuaCuoiNam;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface KetQuaCuoiNamMapper {

    KetQuaCuoiNam toEntity(KetQuaCuoiNamRequest request);

    @Mapping(source = "hocSinh.hocSinhId", target = "hocSinhId")
    @Mapping(source = "hocSinh.hoTen", target = "hoTenHocSinh")
    @Mapping(source = "lopHoc.lopHocId", target = "lopHocId")
    @Mapping(source = "lopHoc.tenLop", target = "tenLop")
    @Mapping(source = "giaoVienXet.giaoVienId", target = "giaoVienXetId")
    @Mapping(source = "giaoVienXet.hoTen", target = "tenGiaoVienXet")
    KetQuaCuoiNamResponse toResponse(KetQuaCuoiNam entity);

    void updateKetQuaCuoiNam(KetQuaCuoiNamRequest request, @org.mapstruct.MappingTarget KetQuaCuoiNam entity);
}
