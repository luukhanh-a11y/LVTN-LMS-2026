package com.LMS.LVTN.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminDashboardResponse {
    private long totalStudents;
    private long totalTeachers;
    private long totalParents;
    private long totalClasses;
    private long activeClasses;
    private List<Long> trafficData;
    private List<String> systemWarnings;
}
