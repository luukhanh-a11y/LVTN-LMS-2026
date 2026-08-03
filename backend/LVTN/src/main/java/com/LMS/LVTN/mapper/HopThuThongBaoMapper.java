package com.LMS.LVTN.mapper;

import com.LMS.LVTN.dto.request.HopThuThongBaoRequest;
import com.LMS.LVTN.dto.response.HopThuThongBaoResponse;
import com.LMS.LVTN.entity.HopThuThongBao;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HopThuThongBaoMapper {

    HopThuThongBao toEntity(HopThuThongBaoRequest request);

    @Mapping(source = "nguoiDung.nguoiDungId", target = "nguoiDungId")
    @Mapping(source = "thongBao.thongBaoId", target = "thongBaoId")
    @Mapping(source = "thongBao.nguoiGui.nguoiDungId", target = "nguoiGuiId")
    @Mapping(source = "thongBao.nguoiGui.tenDangNhap", target = "tenNguoiGui")
    @Mapping(source = "thongBao.tieuDe", target = "tieuDe")
    @Mapping(source = "thongBao.noiDung", target = "noiDung")
    @Mapping(source = "thongBao.fileDinhKem", target = "fileDinhKem")
    @Mapping(source = "thongBao.loaiThongBao", target = "loaiThongBao")
    @Mapping(source = "thongBao.laGhim", target = "laGhim")
    @Mapping(source = "thongBao.ngayDang", target = "ngayDang")
    HopThuThongBaoResponse toResponse(HopThuThongBao entity);

    void updateHopThuThongBao(HopThuThongBaoRequest request, @org.mapstruct.MappingTarget HopThuThongBao entity);
}

