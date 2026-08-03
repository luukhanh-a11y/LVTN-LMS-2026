package com.LMS.LVTN.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ChuDeResponse {

    private Integer chuDeId;
    private Integer sachId;
    private String tenSach; // Flattened
    private Integer bookIndexIdNgoai;
    private String tenChuDe;
    private String tieuDe;
    private String slug;
    private Short soTrang;
    private Short soThuTu;
    private LocalDateTime ngayTao;
}
