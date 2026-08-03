package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BaiTapTuLuanDetailResponse {
    private Long assignmentId;
    private String title;
    private String description;
    private String deadline;
    private Boolean isPastDeadline;
    private Boolean allowResubmit;
    private Integer maxResubmitCount;
    private Integer attemptsUsed;
    private Boolean canSubmit;
    private String draftText;
    private String draftAttachmentUrl;
}
