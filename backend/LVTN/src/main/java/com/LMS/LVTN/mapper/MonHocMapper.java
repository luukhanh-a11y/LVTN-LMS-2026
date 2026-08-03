package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.MonHocRequest;
import com.LMS.LVTN.dto.response.MonHocResponse;
import com.LMS.LVTN.entity.MonHoc;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MonHocMapper {

    MonHoc toEntity(MonHocRequest request);

    MonHocResponse toResponse(MonHoc entity);

    void updateMonHoc(MonHocRequest request, @org.mapstruct.MappingTarget MonHoc entity);
}
