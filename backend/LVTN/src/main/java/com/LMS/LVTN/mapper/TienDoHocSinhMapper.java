package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.TienDoHocSinhRequest;
import com.LMS.LVTN.dto.response.TienDoHocSinhResponse;
import com.LMS.LVTN.entity.TienDoHocSinh;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TienDoHocSinhMapper {

    TienDoHocSinh toEntity(TienDoHocSinhRequest request);

    @Mapping(source = "hocSinh.hocSinhId", target = "hocSinhId")
    @Mapping(source = "hocSinh.hoTen", target = "hoTenHocSinh")
    @Mapping(source = "baiHoc.baiHocId", target = "baiHocId")
    @Mapping(source = "baiHoc.tenBaiHoc", target = "tenBaiHoc")
    @Mapping(source = "hocKy.hocKyId", target = "hocKyId")
    @Mapping(source = "hocKy.soHocKy", target = "soHocKy")
    @Mapping(source = "hocKy.namHoc.tenNamHoc", target = "tenNamHoc")
    TienDoHocSinhResponse toResponse(TienDoHocSinh entity);

    void updateTienDoHocSinh(TienDoHocSinhRequest request, @org.mapstruct.MappingTarget TienDoHocSinh entity);
}
