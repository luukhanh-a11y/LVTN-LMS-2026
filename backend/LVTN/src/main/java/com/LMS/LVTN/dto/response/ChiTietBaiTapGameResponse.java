package com.LMS.LVTN.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietBaiTapGameResponse {
    private Long id;
    private Integer dangBaiId;
    private Integer thuTu;
    private String cheDoGiaoDien;
    private Object duLieuGame;
}
