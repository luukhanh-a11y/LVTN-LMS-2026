package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.NamHocRequest;
import com.LMS.LVTN.dto.response.NamHocResponse;
import com.LMS.LVTN.entity.NamHoc;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NamHocMapper {

    NamHoc toEntity(NamHocRequest request);

    NamHocResponse toResponse(NamHoc entity);

    void updateNamHoc(NamHocRequest request, @org.mapstruct.MappingTarget NamHoc entity);
}
