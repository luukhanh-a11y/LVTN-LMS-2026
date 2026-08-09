package com.LMS.LVTN.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AchievementBadgeDTO {
    private Long id;
    private String name;
    private String date;
    private String message;
    private String teacher;
    private String color;
    private String iconUrl;
    private String icon;
}
