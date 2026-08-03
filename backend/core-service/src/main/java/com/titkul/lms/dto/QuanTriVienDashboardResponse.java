package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuanTriVienDashboardResponse {
    private long totalStudents;
    private long totalTeachers;
    private long totalParents;
    private long totalClasses;
    private long activeClasses;
    private java.util.List<Integer> trafficData;
    private java.util.List<String> systemWarnings;
}
