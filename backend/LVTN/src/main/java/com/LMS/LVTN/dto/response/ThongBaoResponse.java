package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.LoaiThongBao;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ThongBaoResponse {

    private Long thongBaoId;
    private String nguoiGuiId;
    private String tenNguoiGui; // Flattened
    private String tieuDe;
    private String noiDung;
    private String fileDinhKem;
    private LoaiThongBao loaiThongBao;
    private Boolean laGhim;
    private LocalDateTime ngayDang;
}
