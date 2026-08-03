package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.TrangThaiPhieu;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PhieuHoTroResponse {

    private Long phieuId;
    private String nguoiDungTaoId;
    private String tenNguoiDungTao; // Flattened
    private String nguoiDungLienQuanId;
    private String tenNguoiDungLienQuan; // Flattened
    private String loaiYeuCau;
    private String moTa;
    private String adminXuLyId;
    private String tenAdminXuLy; // Flattened
    private TrangThaiPhieu trangThai;
    private String ghiChuXuLy;
    private LocalDateTime ngayTao;
    private LocalDateTime ngayXuLy;
}
