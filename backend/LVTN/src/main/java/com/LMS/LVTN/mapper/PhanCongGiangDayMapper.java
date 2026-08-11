package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.PhanCongGiangDayRequest;
import com.LMS.LVTN.dto.response.PhanCongGiangDayResponse;
import com.LMS.LVTN.entity.PhanCongGiangDay;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PhanCongGiangDayMapper {

    PhanCongGiangDay toEntity(PhanCongGiangDayRequest request);

    @Mapping(source = "giaoVien.giaoVienId", target = "giaoVienId")
    @Mapping(source = "giaoVien.hoTen", target = "tenGiaoVien")
    @Mapping(source = "lopHoc.lopHocId", target = "lopHocId")
    @Mapping(source = "lopHoc.tenLop", target = "tenLop")
    @Mapping(source = "monHoc.monHocId", target = "monHocId")
    @Mapping(source = "monHoc.maMon", target = "maMon")
    @Mapping(source = "monHoc.tenMon", target = "tenMon")
    @Mapping(source = "hocKy.hocKyId", target = "hocKyId")
    @Mapping(source = "hocKy.soHocKy", target = "soHocKy")
    @Mapping(source = "hocKy.namHoc.tenNamHoc", target = "tenNamHoc")
    PhanCongGiangDayResponse toResponse(PhanCongGiangDay entity);

    void updatePhanCongGiangDay(PhanCongGiangDayRequest request, @org.mapstruct.MappingTarget PhanCongGiangDay entity);
}
