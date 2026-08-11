
package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.PhuHuynhHocSinhRequest;
import com.LMS.LVTN.dto.response.PhuHuynhHocSinhResponse;
import com.LMS.LVTN.entity.PhuHuynhHocSinh;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PhuHuynhHocSinhMapper {

    PhuHuynhHocSinh toEntity(PhuHuynhHocSinhRequest request);

    @Mapping(source = "phuHuynh", target = "hoSoPhuHuynhResponse")
    @Mapping(source = "hocSinh", target = "hoSoHocSinhResponse")
    @Mapping(source = "ngayLienKet", target = "thoiDiemLienKet")
    PhuHuynhHocSinhResponse toResponse(PhuHuynhHocSinh entity);

    void updatePhuHuynhHocSinh(PhuHuynhHocSinhRequest request, @MappingTarget PhuHuynhHocSinh entity);
}
