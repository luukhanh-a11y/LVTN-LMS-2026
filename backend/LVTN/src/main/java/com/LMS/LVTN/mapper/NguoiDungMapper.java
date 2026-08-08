package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.NguoiDungCreateRequest;
import com.LMS.LVTN.dto.request.NguoiDungRequest;
import com.LMS.LVTN.dto.request.UpDateRoleUserRequest;
import com.LMS.LVTN.dto.request.UpdateTrangThaiUser;
import com.LMS.LVTN.dto.response.NguoiDungResponse;
import com.LMS.LVTN.entity.NguoiDung;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.AfterMapping;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NguoiDungMapper {

    NguoiDung toEntity(NguoiDungRequest request);

    NguoiDung toEntity(NguoiDungCreateRequest request);

    NguoiDungResponse toResponse(NguoiDung entity);

    // Cập nhật hồ sơ thường chỉ gửi 1-2 field (vd chỉ soDienThoai/email) — IGNORE để
    // không set null các field còn lại (tenDangNhap NOT NULL/UNIQUE, dễ vỡ constraint).
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateThongTinNguoiDung(NguoiDungRequest request, @MappingTarget NguoiDung entity);

    void updateTrangThaiUser(UpdateTrangThaiUser request, @MappingTarget NguoiDung entity);

    void updateRoleUser(UpDateRoleUserRequest request, @MappingTarget NguoiDung entity);

}
