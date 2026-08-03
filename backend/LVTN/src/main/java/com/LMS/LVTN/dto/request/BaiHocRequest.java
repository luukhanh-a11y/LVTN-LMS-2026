package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BaiHocRequest {

    private Integer chuDeId;
    private Integer bookIndexIdNgoai;
    private String tenBaiHoc;
    private String tieuDe;
    private String slug;
    private Short soTrang;
    private Short soThuTu;
}
