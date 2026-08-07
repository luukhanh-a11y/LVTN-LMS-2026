package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.PhieuHoTroRequest;
import com.LMS.LVTN.dto.response.PhieuHoTroResponse;
import com.LMS.LVTN.entity.PhieuHoTro;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface PhieuHoTroMapper {

    PhieuHoTro toEntity(PhieuHoTroRequest request);

    @Mapping(source = "nguoiDungTao.nguoiDungId", target = "nguoiDungTaoId")
    @Mapping(source = "nguoiDungTao.tenDangNhap", target = "tenNguoiDungTao")
    @Mapping(source = "nguoiDungLienQuan.nguoiDungId", target = "nguoiDungLienQuanId")
    @Mapping(source = "nguoiDungLienQuan.tenDangNhap", target = "tenNguoiDungLienQuan")
    @Mapping(source = "adminXuLy.nguoiDungId", target = "adminXuLyId")
    @Mapping(source = "adminXuLy.tenDangNhap", target = "tenAdminXuLy")
    PhieuHoTroResponse toResponse(PhieuHoTro entity);

    void updatePhieuHoTro(PhieuHoTroRequest request, @org.mapstruct.MappingTarget PhieuHoTro entity);
}
