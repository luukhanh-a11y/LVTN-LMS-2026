package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.LoImportRequest;
import com.LMS.LVTN.dto.response.LoImportResponse;
import com.LMS.LVTN.entity.LoImport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LoImportMapper {

    LoImport toEntity(LoImportRequest request);

    @Mapping(source = "nguoiThucHien.nguoiDungId", target = "nguoiThucHienId")
    @Mapping(source = "nguoiThucHien.tenDangNhap", target = "tenNguoiThucHien")
    LoImportResponse toResponse(LoImport entity);

    void updateLoImport(LoImportRequest request, @org.mapstruct.MappingTarget LoImport entity);
}
