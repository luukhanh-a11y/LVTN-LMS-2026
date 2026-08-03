package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PhanCongGiangDayRequest {

    private Long giaoVienId;
    private Long lopHocId;
    private Short monHocId;
    private Integer hocKyId;
}
