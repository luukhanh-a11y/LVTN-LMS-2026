package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.BaiTapRequest;
import com.LMS.LVTN.dto.response.BaiTapResponse;
import com.LMS.LVTN.entity.BaiTap;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BaiTapMapper {

    BaiTap toEntity(BaiTapRequest request);

    @Mapping(source = "giaoVien.giaoVienId", target = "giaoVienId")
    @Mapping(source = "giaoVien.hoTen", target = "tenGiaoVien")
    @Mapping(source = "lopHoc.lopHocId", target = "lopHocId")
    @Mapping(source = "lopHoc.tenLop", target = "tenLop")
    @Mapping(source = "dangBai.dangBaiId", target = "dangBaiId")
    @Mapping(source = "dangBai.tenDangBai", target = "tenDangBai")
    @Mapping(source = "hocKy.hocKyId", target = "hocKyId")
    @Mapping(source = "hocKy.soHocKy", target = "soHocKy")
    @Mapping(source = "hocKy.namHoc.tenNamHoc", target = "tenNamHoc")
    BaiTapResponse toResponse(BaiTap entity);

    void updateBaiTap(BaiTapRequest request, @org.mapstruct.MappingTarget BaiTap entity);
}
