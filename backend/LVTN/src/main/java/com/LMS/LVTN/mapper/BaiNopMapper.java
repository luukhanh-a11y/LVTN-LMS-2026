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
    @Mapping(source = "danhGiaBaiLam.danhGiaId", target = "danhGiaId")
    @Mapping(source = "danhGiaBaiLam.diemSo", target = "diemDanhGia")
    @Mapping(source = "danhGiaBaiLam.xepLoai", target = "xepLoaiDanhGia")
    @Mapping(source = "danhGiaBaiLam.nhanXet", target = "nhanXetDanhGia")
    @Mapping(source = "danhGiaBaiLam.hanhDong", target = "hanhDongDanhGia")
    BaiNopResponse toResponse(BaiNop entity);

    void updateBaiNop(BaiNopRequest request, @org.mapstruct.MappingTarget BaiNop entity);
}
