package com.LMS.LVTN.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HocKyResponse {

    private Integer hocKyId;
    private Integer namHocId;
    private String tenNamHoc; // Flattened
    private Short soHocKy;
}
