package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.ThongBaoRequest;
import com.LMS.LVTN.dto.response.ThongBaoResponse;
import com.LMS.LVTN.entity.ThongBao;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ThongBaoMapper {

    ThongBao toEntity(ThongBaoRequest request);

    @Mapping(source = "nguoiGui.nguoiDungId", target = "nguoiGuiId")
    @Mapping(source = "nguoiGui.tenDangNhap", target = "tenNguoiGui")
    ThongBaoResponse toResponse(ThongBao entity);

    void updateThongBao(ThongBaoRequest request, @org.mapstruct.MappingTarget ThongBao entity);
}
