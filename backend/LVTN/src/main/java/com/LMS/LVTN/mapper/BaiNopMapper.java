package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.BaiNopRequest;
import com.LMS.LVTN.dto.response.BaiNopResponse;
import com.LMS.LVTN.entity.BaiNop;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface BaiNopMapper {

    BaiNop toEntity(BaiNopRequest request);

    @Mapping(source = "baiTap.baiTapId", target = "baiTapId")
    @Mapping(source = "baiTap.tieuDe", target = "tieuDeBaiTap")
    @Mapping(source = "hocSinh.hocSinhId", target = "hocSinhId")
    @Mapping(source = "hocSinh.hoTen", target = "hoTenHocSinh")
    BaiNopResponse toResponse(BaiNop entity);

    void updateBaiNop(BaiNopRequest request, @org.mapstruct.MappingTarget BaiNop entity);
}
