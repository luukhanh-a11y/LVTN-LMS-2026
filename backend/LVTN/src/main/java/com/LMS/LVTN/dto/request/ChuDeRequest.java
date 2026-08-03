package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChuDeRequest {

    private Integer sachId;
    private Integer bookIndexIdNgoai;
    private String tenChuDe;
    private String tieuDe;
    private String slug;
    private Short soTrang;
    private Short soThuTu;
}
