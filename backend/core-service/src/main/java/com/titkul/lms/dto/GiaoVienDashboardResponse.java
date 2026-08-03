package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GiaoVienDashboardResponse {
    private String fullName;
    private int classesCount;
    private String homeroomClass;
    private String department;
    private long totalAssignments;
}
