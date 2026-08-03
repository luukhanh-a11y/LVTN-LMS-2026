package com.titkul.lms.dto;

import lombok.Data;

@Data
public class GoiYAiBaiTapRequest {
    private Integer grade;
    private Integer subjectId;
    private String topicHint;
}
