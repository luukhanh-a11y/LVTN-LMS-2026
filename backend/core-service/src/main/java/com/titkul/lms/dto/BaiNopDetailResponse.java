package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BaiNopDetailResponse {
    private Long id;
    private String studentName;
    private String assignmentTitle;
    private String textContent;
    private String attachmentUrl;
    private BigDecimal autoScore;
    private Integer xpEarned;
    private Short attemptNumber;
    private String status;
    private Boolean isLate;
    private String submittedAt;

    // Null nếu chưa được giáo viên chấm (chưa có DanhGiaBaiLam)
    private BigDecimal evaluationScore;
    private String evaluationGrade;
    private String evaluationComment;
    private String evaluationAction;
    private String evaluatedAt;
}
