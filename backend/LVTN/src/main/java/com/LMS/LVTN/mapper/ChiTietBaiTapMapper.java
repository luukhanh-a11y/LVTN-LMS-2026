package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.ChiTietBaiTapRequest;
import com.LMS.LVTN.dto.response.ChiTietBaiTapResponse;
import com.LMS.LVTN.entity.ChiTietBaiTap;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ChiTietBaiTapMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "baiTap", ignore = true)
    @Mapping(target = "dangBai", ignore = true)
    ChiTietBaiTap toEntity(ChiTietBaiTapRequest request);

    @Mapping(source = "baiTap.baiTapId", target = "baiTapId")
    @Mapping(source = "dangBai.dangBaiId", target = "dangBaiId")
    ChiTietBaiTapResponse toResponse(ChiTietBaiTap entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "baiTap", ignore = true)
    @Mapping(target = "dangBai", ignore = true)
    void updateChiTietBaiTap(ChiTietBaiTapRequest request, @org.mapstruct.MappingTarget ChiTietBaiTap entity);
}
