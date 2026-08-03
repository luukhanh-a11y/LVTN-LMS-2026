package com.titkul.lms.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PhieuHoTroResponse {
    private Long id;
    private Long teacherId;
    private String teacherName;
    private Long studentId;
    private String studentName;
    private String type;
    private String description;
    private String status;
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
}
