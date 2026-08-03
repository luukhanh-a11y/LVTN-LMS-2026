package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HocKyRequest;
import com.LMS.LVTN.dto.response.HocKyResponse;
import com.LMS.LVTN.entity.HocKy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HocKyMapper {

    HocKy toEntity(HocKyRequest request);

    @Mapping(source = "namHoc.namHocId", target = "namHocId")
    @Mapping(source = "namHoc.tenNamHoc", target = "tenNamHoc")
    HocKyResponse toResponse(HocKy entity);

    void updateHocKy(HocKyRequest request, @org.mapstruct.MappingTarget HocKy entity);
}
