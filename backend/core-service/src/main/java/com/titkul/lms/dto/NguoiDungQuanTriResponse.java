package com.titkul.lms.dto;

import lombok.Data;

@Data
public class NguoiDungQuanTriResponse {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private String role;
    private String status;
    private boolean requirePasswordChange;
    private java.time.LocalDateTime lastLogin;
    private java.time.LocalDateTime createdAt;
    
    // Aggregated fields
    private String fullName;
    private String className;
    private Long classId;
    private java.util.List<Long> classIds = new java.util.ArrayList<>();
}
