package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BaiTapResponse {
    private Long id;
    private String title;
    private String subject;
    private String type;
    private String status;
    private String deadline;
    private String timeRemaining;
    private boolean isLate;
}
