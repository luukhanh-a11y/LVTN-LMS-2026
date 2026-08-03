package com.titkul.lms.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PhuHuynhDashboardResponse {
    private String fullName;
    private int childrenCount;
    private List<ChildDto> children;
    private List<ActivityDto> recentActivities;
    private List<AlertDto> alerts;
    private List<AnnouncementDto> announcements;

    @Data
    @Builder
    public static class ChildDto {
        private Long id;
        private String studentName;
        private String className;
    }

    @Data
    @Builder
    public static class ActivityDto {
        private String title;
        private String type;
        private String badge;
    }

    @Data
    @Builder
    public static class AlertDto {
        private String title;
        private String description;
    }

    @Data
    @Builder
    public static class AnnouncementDto {
        private String title;
        private String content;
        private String date;
        private String tag;
    }
}
