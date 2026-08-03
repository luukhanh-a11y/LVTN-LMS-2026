package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.LoaiThongBao;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class HopThuThongBaoResponse {

    private Long hopThuId;
    private String nguoiDungId;
    private Long thongBaoId;
    
    // Trạng thái hòm thư cá nhân
    private Boolean daDoc;
    private LocalDateTime thoiDiemDoc;

    // Chi tiết từ Bản Thông Báo gốc (được lồng chép bởi Mapper)
    private String nguoiGuiId;
    private String tenNguoiGui;
    private String tieuDe;
    private String noiDung;
    private String fileDinhKem;
    private LoaiThongBao loaiThongBao;
    private Boolean laGhim;
    private LocalDateTime ngayDang;
}

