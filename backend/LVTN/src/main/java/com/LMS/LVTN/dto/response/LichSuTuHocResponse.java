package com.LMS.LVTN.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class LichSuTuHocResponse {
    private Long tuHocId;
    private Long hocSinhId;
    private String hoTenHocSinh; // flattened
    private Integer dangBaiId;
    private String tenDangBai; // flattened
    private BigDecimal diemSo;
    private String chiTietBaiLam;
    private String dapAnChuan;
    private LocalDateTime thoiGianNop;
}
