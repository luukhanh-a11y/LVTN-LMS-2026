package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class LichSuTuHocRequest {
    private Long hocSinhId;
    private Integer dangBaiId;
    private String chiTietBaiLam;
}
