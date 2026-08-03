package com.titkul.lms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ParsedHocSinhExcelRow {
    private int rowNumber;
    private String className;
    private String studentCode;
    private String studentName;
    private LocalDate studentDob;
    
    private String parentName;
    private String parentPhone;
    private String parentEmail;
    
    private String errorMsg;
    private boolean isValid = true;
}
