package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DangBaiDetailResponse {
    private Integer id;
    private String title;
    private String h5pContentId;
    private Integer xpReward;
    private Boolean completed;
    private String loaiNoiDung;
    private String loai;
    private Object cauHinh;
}
