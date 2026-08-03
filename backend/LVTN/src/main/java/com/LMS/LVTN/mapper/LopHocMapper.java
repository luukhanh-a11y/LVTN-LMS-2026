package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.LopHocRequest;
import com.LMS.LVTN.dto.response.LopHocResponse;
import com.LMS.LVTN.entity.LopHoc;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LopHocMapper {

    LopHoc toEntity(LopHocRequest request);

    @Mapping(source = "namHoc.namHocId", target = "namHocId")
    @Mapping(source = "namHoc.tenNamHoc", target = "tenNamHoc")
    @Mapping(source = "giaoVienChuNhiem.giaoVienId", target = "giaoVienChuNhiemId")
    @Mapping(source = "giaoVienChuNhiem.hoTen", target = "tenGiaoVienChuNhiem")
    LopHocResponse toResponse(LopHoc entity);

    void updateLopHoc(LopHocRequest request, @org.mapstruct.MappingTarget LopHoc entity);
}
