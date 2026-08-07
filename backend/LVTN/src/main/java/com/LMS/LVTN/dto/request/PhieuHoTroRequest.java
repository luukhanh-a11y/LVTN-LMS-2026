package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.TrangThaiPhieu;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PhieuHoTroRequest {

    private String nguoiDungTaoId;
    private String nguoiDungLienQuanId;
    private String loaiYeuCau;
    private String moTa;

    // Các trường phục vụ admin xử lý phiếu
    private String adminXuLyId;
    private TrangThaiPhieu trangThai;
    private String ghiChuXuLy;
}

