package com.titkul.lms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ParsedGiaoVienExcelRow {
    private int rowNumber;
    private String teacherCode; // Username
    private String fullName;
    private String phone;
    private String department;
    private LocalDate dateOfBirth;
    
    private boolean valid = true;
    private String errorMsg;
}
