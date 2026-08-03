package com.titkul.lms.dto;

import com.titkul.lms.entity.TrangThaiPhieu;
import lombok.Data;

@Data
public class XuLyPhieuHoTroRequest {
    private TrangThaiPhieu status;
    private String adminNote;
}
