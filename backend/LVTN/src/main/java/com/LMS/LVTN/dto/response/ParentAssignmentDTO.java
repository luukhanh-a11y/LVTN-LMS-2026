package com.LMS.LVTN.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentAssignmentDTO {
    private Long id;
    private String title;
    private LocalDateTime assignedDate;
    private LocalDateTime dueDate;
    private Integer xpReward;
    private Boolean completed;
    private String subjectName;
    private String type;
    private String status;
}
