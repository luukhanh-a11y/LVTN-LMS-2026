package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.LichSuChuyenLopRequest;
import com.LMS.LVTN.dto.response.LichSuChuyenLopResponse;
import com.LMS.LVTN.entity.LichSuChuyenLop;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LichSuChuyenLopMapper {

    LichSuChuyenLop toEntity(LichSuChuyenLopRequest request);

    @Mapping(source = "hocSinh.hocSinhId", target = "hocSinhId")
    @Mapping(source = "hocSinh.hoTen", target = "hoTenHocSinh")
    @Mapping(source = "lopCu.lopHocId", target = "lopCuId")
    @Mapping(source = "lopCu.tenLop", target = "tenLopCu")
    @Mapping(source = "lopMoi.lopHocId", target = "lopMoiId")
    @Mapping(source = "lopMoi.tenLop", target = "tenLopMoi")
    @Mapping(source = "nguoiThucHien.nguoiDungId", target = "nguoiThucHienId")
    @Mapping(source = "nguoiThucHien.tenDangNhap", target = "tenNguoiThucHien")
    LichSuChuyenLopResponse toResponse(LichSuChuyenLop entity);

    void updateLichSuChuyenLop(LichSuChuyenLopRequest request, @org.mapstruct.MappingTarget LichSuChuyenLop entity);
}
