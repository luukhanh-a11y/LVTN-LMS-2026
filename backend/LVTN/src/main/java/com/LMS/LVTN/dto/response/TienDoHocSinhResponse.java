package com.LMS.LVTN.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TienDoHocSinhResponse {

    private Long tienDoId;
    private Long hocSinhId;
    private String hoTenHocSinh; // Flattened
    private Integer baiHocId;
    private String tenBaiHoc; // Flattened
    private Integer hocKyId;
    private Short soHocKy; // Flattened
    private String tenNamHoc; // Flattened
    private Short phanTramHoanThanh;
    private Integer thoiGianHoc;
    private LocalDateTime lanXemCuoi;
    private Boolean daHoanThanh;
}
