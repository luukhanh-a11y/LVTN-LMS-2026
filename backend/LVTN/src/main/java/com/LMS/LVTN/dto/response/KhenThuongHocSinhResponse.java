package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.NguonCap;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class KhenThuongHocSinhResponse {

    private Long khenThuongId;
    private Long hocSinhId;
    private String hoTenHocSinh; // Flattened
    private Integer huyHieuId;
    private String tenHuyHieu; // Flattened
    private Long giaoVienId;
    private String tenGiaoVien; // Flattened
    private String thuKhen;
    private NguonCap nguonCap;
    private LocalDateTime thoiDiemTrao;
    private Boolean daGuiEmail;
}
