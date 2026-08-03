package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HuyHieuRequest;
import com.LMS.LVTN.dto.response.HuyHieuResponse;
import com.LMS.LVTN.entity.HuyHieu;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HuyHieuMapper {

    HuyHieu toEntity(HuyHieuRequest request);

    HuyHieuResponse toResponse(HuyHieu entity);

    void updateHuyHieu(HuyHieuRequest request, @org.mapstruct.MappingTarget HuyHieu entity);
}
