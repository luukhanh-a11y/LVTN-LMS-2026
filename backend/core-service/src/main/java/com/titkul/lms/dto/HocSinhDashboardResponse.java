package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class HocSinhDashboardResponse {
    private String fullName;
    private String className;
    private String academicYear;
    private Integer totalXp;
    private List<EvaluationDto> recentEvaluations;
    private List<UpcomingTaskDto> upcomingTasks;
    private List<NotificationDto> recentNotifications;
    private List<SubjectProgressDto> subjects;

    @Data
    @Builder
    public static class EvaluationDto {
        private String assignmentTitle;
        private String score;
        private String grade;
        private String comment;
        private String evaluatedAt;
    }

    @Data
    @Builder
    public static class UpcomingTaskDto {
        private Long id;
        private String title;
        private String subject;
        private String time;
    }

    @Data
    @Builder
    public static class NotificationDto {
        private Long id;
        private String title;
        private boolean isNew;
        private String content;
        private String date;
        private String type;
        private boolean pinned;
    }

    @Data
    @Builder
    public static class SubjectProgressDto {
        private String id;
        private String name;
        private String desc;
        private String icon;
        private String color;
        private String btnColor;
        private String trackColor;
        private String barColor;
        private Integer progress;
    }
}
