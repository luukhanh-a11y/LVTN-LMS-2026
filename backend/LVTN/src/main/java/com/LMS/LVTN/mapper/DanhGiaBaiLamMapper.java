package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.DanhGiaBaiLamRequest;
import com.LMS.LVTN.dto.response.DanhGiaBaiLamResponse;
import com.LMS.LVTN.entity.DanhGiaBaiLam;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DanhGiaBaiLamMapper {

    DanhGiaBaiLam toEntity(DanhGiaBaiLamRequest request);

    @Mapping(source = "baiNop.baiNopId", target = "baiNopId")
    @Mapping(source = "giaoVien.giaoVienId", target = "giaoVienId")
    @Mapping(source = "giaoVien.hoTen", target = "tenGiaoVien")
    DanhGiaBaiLamResponse toResponse(DanhGiaBaiLam entity);

    void updateDanhGiaBaiLam(DanhGiaBaiLamRequest request, @org.mapstruct.MappingTarget DanhGiaBaiLam entity);
}
