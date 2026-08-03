package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.ChuDeRequest;
import com.LMS.LVTN.dto.response.ChuDeResponse;
import com.LMS.LVTN.entity.ChuDe;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ChuDeMapper {

    ChuDe toEntity(ChuDeRequest request);

    @Mapping(source = "sach.sachId", target = "sachId")
    @Mapping(source = "sach.tenSach", target = "tenSach")
    ChuDeResponse toResponse(ChuDe entity);

    void updateChuDe(ChuDeRequest request, @org.mapstruct.MappingTarget ChuDe entity);
}
