package com.titkul.lms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TaoNguoiDungRequest {
    private String role; // GIAO_VIEN, HOC_SINH
    
    // Common
    private String username; // deprecated for GIAO_VIEN/HOC_SINH: username giờ tự sinh (GV+SĐT hoặc HS+Mã HS)
    private String fullName;
    private LocalDate dateOfBirth;

    // Teacher specific
    private String department;
    private String phone; // used for teacher phone or parent phone

    // Student specific
    private String studentCode; // Mã học sinh - bắt buộc, dùng để sinh username
    private Long classId;
    
    // Parent info (if creating Student)
    private String parentName;
    private String parentPhone;
}
