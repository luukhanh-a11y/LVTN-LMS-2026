package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.LyDoChuyenLop;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class LichSuChuyenLopResponse {

    private Long chuyenLopId;
    private Long hocSinhId;
    private String hoTenHocSinh; // Flattened
    private Long lopCuId;
    private String tenLopCu; // Flattened
    private Long lopMoiId;
    private String tenLopMoi; // Flattened
    private String namHocCu;
    private String namHocMoi;
    private LyDoChuyenLop lyDo;
    private String ghiChu;
    private Long nguoiThucHienId;
    private String tenNguoiThucHien; // Flattened
    private LocalDateTime thoiDiemChuyen;
}
