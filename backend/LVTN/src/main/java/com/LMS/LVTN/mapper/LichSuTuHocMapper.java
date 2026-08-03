package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.LichSuTuHocRequest;
import com.LMS.LVTN.dto.response.LichSuTuHocResponse;
import com.LMS.LVTN.entity.LichSuTuHoc;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LichSuTuHocMapper {

    LichSuTuHoc toEntity(LichSuTuHocRequest request);

    @Mapping(source = "hocSinh.hocSinhId", target = "hocSinhId")
    @Mapping(source = "hocSinh.hoTen", target = "hoTenHocSinh")
    @Mapping(source = "dangBai.dangBaiId", target = "dangBaiId")
    @Mapping(source = "dangBai.tenDangBai", target = "tenDangBai")
    @Mapping(source = "dangBai.dapAnChuan", target = "dapAnChuan")
    LichSuTuHocResponse toResponse(LichSuTuHoc entity);

    void updateLichSuTuHoc(LichSuTuHocRequest request, @MappingTarget LichSuTuHoc entity);
}
