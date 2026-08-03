package com.LMS.LVTN.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BaiHocResponse {

    private Integer baiHocId;
    private Integer chuDeId;
    private String tenChuDe; // Flattened
    private Integer bookIndexIdNgoai;
    private String tenBaiHoc;
    private String tieuDe;
    private String slug;
    private Short soTrang;
    private Short soThuTu;
    private LocalDateTime ngayTao;
}
