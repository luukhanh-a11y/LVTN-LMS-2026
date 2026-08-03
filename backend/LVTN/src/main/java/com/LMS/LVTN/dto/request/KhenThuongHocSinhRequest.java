package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.NguonCap;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class KhenThuongHocSinhRequest {

    private Long hocSinhId;
    private Integer huyHieuId;
    private Long giaoVienId;
    private String thuKhen;
    private NguonCap nguonCap;
}
