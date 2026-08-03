package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HopThuThongBaoRequest {

    private String nguoiDungId;
    private Long thongBaoId;
    private Boolean daDoc;
}

