package com.titkul.lms.dto;

import lombok.Data;

@Data
public class DanhGiaRequest {
    private Long teacherId;     // ID của giáo viên chấm bài
    private String grade;       // XepLoai: HOAN_THANH_TOT, HOAN_THANH, CHUA_HOAN_THANH
    private String comment;     // Nhận xét
    private String action;      // HanhDongDanhGia: DUYET, YC_LAM_LAI
    private String reason;      // Lý do (khi yêu cầu làm lại)
}
