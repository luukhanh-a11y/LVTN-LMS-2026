package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.NguoiDungCreateRequest;
import com.LMS.LVTN.dto.request.NguoiDungRequest;
import com.LMS.LVTN.dto.request.UpDateRoleUserRequest;
import com.LMS.LVTN.dto.request.UpdateTrangThaiUser;
import com.LMS.LVTN.dto.response.NguoiDungResponse;
import com.LMS.LVTN.entity.NguoiDung;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.AfterMapping;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NguoiDungMapper {

    NguoiDung toEntity(NguoiDungRequest request);

    NguoiDung toEntity(NguoiDungCreateRequest request);

    NguoiDungResponse toResponse(NguoiDung entity);

    void updateThongTinNguoiDung(NguoiDungRequest request, @MappingTarget NguoiDung entity);

    void updateTrangThaiUser(UpdateTrangThaiUser request, @MappingTarget NguoiDung entity);

    void updateRoleUser(UpDateRoleUserRequest request, @MappingTarget NguoiDung entity);

}
