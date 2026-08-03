package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BaiNopTuLuanResultResponse {
    private Long submissionId;
    private String status;
    private Boolean isLate;
}
