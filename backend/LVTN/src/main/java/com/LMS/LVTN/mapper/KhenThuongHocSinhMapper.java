package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.KhenThuongHocSinhRequest;
import com.LMS.LVTN.dto.response.KhenThuongHocSinhResponse;
import com.LMS.LVTN.entity.KhenThuongHocSinh;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface KhenThuongHocSinhMapper {

    KhenThuongHocSinh toEntity(KhenThuongHocSinhRequest request);

    @Mapping(source = "hocSinh.hocSinhId", target = "hocSinhId")
    @Mapping(source = "hocSinh.hoTen", target = "hoTenHocSinh")
    @Mapping(source = "huyHieu.huyHieuId", target = "huyHieuId")
    @Mapping(source = "huyHieu.tenHuyHieu", target = "tenHuyHieu")
    @Mapping(source = "giaoVien.giaoVienId", target = "giaoVienId")
    @Mapping(source = "giaoVien.hoTen", target = "tenGiaoVien")
    KhenThuongHocSinhResponse toResponse(KhenThuongHocSinh entity);

    void updateKhenThuongHocSinh(KhenThuongHocSinhRequest request, @org.mapstruct.MappingTarget KhenThuongHocSinh entity);
}
