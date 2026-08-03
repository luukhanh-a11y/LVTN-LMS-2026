package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.BaiHocRequest;
import com.LMS.LVTN.dto.response.BaiHocResponse;
import com.LMS.LVTN.entity.BaiHoc;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BaiHocMapper {

    BaiHoc toEntity(BaiHocRequest request);

    @Mapping(source = "chuDe.chuDeId", target = "chuDeId")
    @Mapping(source = "chuDe.tenChuDe", target = "tenChuDe")
    BaiHocResponse toResponse(BaiHoc entity);

    void updateBaiHoc(BaiHocRequest request, @MappingTarget BaiHoc entity);
}
