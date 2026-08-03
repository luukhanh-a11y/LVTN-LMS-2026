package com.titkul.lms.dto;

import lombok.Data;

@Data
public class HocSinhLopResponse {
    private Long id; // User ID of the student
    private String code;
    private String name;
    private String parentName;
    private String phone;
    private String dob;
    private String evaluation;
    private Integer attendance;
    private Integer badges;
}
