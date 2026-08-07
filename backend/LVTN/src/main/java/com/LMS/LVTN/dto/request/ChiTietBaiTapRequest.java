package com.LMS.LVTN.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietBaiTapRequest {
    private Long baiTapId;
    private Integer dangBaiId;
    private Integer thuTu;
    private String cheDoGiaoDien;
}
