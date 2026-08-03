package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HoSoPhuHuynhRequest;
import com.LMS.LVTN.dto.response.HoSoPhuHuynhResponse;
import com.LMS.LVTN.entity.HoSoPhuHuynh;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HoSoPhuHuynhMapper {

    HoSoPhuHuynh toEntity(HoSoPhuHuynhRequest request);

    @Mapping(source = "nguoiDung.nguoiDungId", target = "nguoiDungId")
    @Mapping(source = "nguoiDung.soDienThoai", target = "soDienThoai")
    HoSoPhuHuynhResponse toResponse(HoSoPhuHuynh entity);

    void updateHoSoPhuHuynh(HoSoPhuHuynhRequest request, @org.mapstruct.MappingTarget HoSoPhuHuynh entity);
}
