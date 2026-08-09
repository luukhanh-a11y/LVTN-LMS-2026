package com.LMS.LVTN.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentProgressDTO {
    private Long id;
    private String subject;
    private String lesson;
    private boolean isCompleted;
    private short progress;
    private String timeSpent;
}
