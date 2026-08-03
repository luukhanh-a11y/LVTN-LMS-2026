package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BaiNopH5PResultResponse {
    private Long submissionId;
    private BigDecimal score;
    private Integer xpEarned;
    private Integer totalXp;
    private String status;
    private Boolean isLate;
}
