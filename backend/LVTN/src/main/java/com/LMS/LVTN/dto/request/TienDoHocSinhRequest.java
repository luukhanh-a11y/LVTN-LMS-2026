package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TienDoHocSinhRequest {

    private Long hocSinhId;
    private Integer baiHocId;
    private Integer hocKyId;
    private Short phanTramHoanThanh;
    private Integer thoiGianHoc;
    private LocalDateTime lanXemCuoi;
    private Boolean daHoanThanh;
}
