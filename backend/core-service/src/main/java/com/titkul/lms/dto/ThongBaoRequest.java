package com.titkul.lms.dto;

import lombok.Data;

@Data
public class ThongBaoRequest {
    private String title;
    private String content;
    private String audience; // TAT_CA | PHU_HUYNH | HOC_SINH
    private Boolean pinned;
    private Long classId; // optional — mặc định lớp GVCN đầu tiên của giáo viên
}
