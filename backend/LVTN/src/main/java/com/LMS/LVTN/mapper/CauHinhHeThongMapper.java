package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.CauHinhHeThongRequest;
import com.LMS.LVTN.dto.response.CauHinhHeThongResponse;
import com.LMS.LVTN.entity.CauHinhHeThong;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface CauHinhHeThongMapper {

    CauHinhHeThong toEntity(CauHinhHeThongRequest request);

    @Mapping(source = "hocKyHienTai.hocKyId", target = "hocKyHienTaiId")
    @Mapping(source = "hocKyHienTai.soHocKy", target = "soHocKyHienTai")
    @Mapping(source = "hocKyHienTai.namHoc.tenNamHoc", target = "tenNamHocHienTai")
    CauHinhHeThongResponse toResponse(CauHinhHeThong entity);

    void updateCauHinhHeThong(CauHinhHeThongRequest request, @MappingTarget CauHinhHeThong entity);
}
