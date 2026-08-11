package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.SachRequest;
import com.LMS.LVTN.dto.response.SachResponse;
import com.LMS.LVTN.entity.Sach;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SachMapper {

    Sach toEntity(SachRequest request);

    @Mapping(source = "hocKy.hocKyId", target = "hocKyId")
    SachResponse toResponse(Sach entity);

    void updateSach(SachRequest request, @org.mapstruct.MappingTarget Sach entity);
}
