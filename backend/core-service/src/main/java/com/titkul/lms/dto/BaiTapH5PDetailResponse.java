package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BaiTapH5PDetailResponse {
    private Long assignmentId;
    private String title;
    private String h5pContentId;
    private Integer xpReward;
    private Boolean allowResubmit;
    private Integer maxResubmitCount;
    private Integer attemptsUsed;
    private Boolean canSubmit;
    private String deadline;
    private Boolean isPastDeadline;
}
