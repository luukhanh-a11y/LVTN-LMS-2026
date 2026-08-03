package com.titkul.lms.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BaiTapRequest {
    private String title;
    private String description;
    private Long classId;
    private Long teacherId;
    private String type;
    private LocalDateTime deadline;
    private Integer maxResubmitCount;
    private Integer lessonId;
    private Integer contentNodeId;
    private Long hocLieuId;
    private Integer semesterId;
}
