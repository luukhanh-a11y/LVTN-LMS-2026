package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HoSoHocSinhRequest;
import com.LMS.LVTN.dto.response.HoSoHocSinhResponse;
import com.LMS.LVTN.entity.HoSoHocSinh;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HoSoHocSinhMapper {

    HoSoHocSinh toEntity(HoSoHocSinhRequest request);

    @Mapping(source = "nguoiDung.nguoiDungId", target = "nguoiDungId")
    @Mapping(source = "lopHoc.lopHocId", target = "lopHocId")
    HoSoHocSinhResponse toResponse(HoSoHocSinh entity);

    void updateHoSoHocSinh(HoSoHocSinhRequest request, @MappingTarget HoSoHocSinh entity);
}
