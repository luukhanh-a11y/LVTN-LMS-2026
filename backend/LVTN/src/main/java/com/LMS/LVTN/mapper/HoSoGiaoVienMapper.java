package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HoSoGiaoVienRequest;
import com.LMS.LVTN.dto.response.HoSoGiaoVienResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HoSoGiaoVienMapper {

    HoSoGiaoVien toEntity(HoSoGiaoVienRequest request);

    @Mapping(source = "nguoiDung.nguoiDungId", target = "nguoiDungId")
    HoSoGiaoVienResponse toResponse(HoSoGiaoVien entity);

    void updateHoSoGiaoVien(HoSoGiaoVienRequest request, @org.mapstruct.MappingTarget HoSoGiaoVien entity);
}
