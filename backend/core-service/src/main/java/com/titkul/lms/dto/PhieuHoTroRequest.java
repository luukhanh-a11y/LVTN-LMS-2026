package com.titkul.lms.dto;

import lombok.Data;

@Data
public class PhieuHoTroRequest {
    private Long studentId;
    private String type;
    private String description;
}
