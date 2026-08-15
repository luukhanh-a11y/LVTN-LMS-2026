package com.LMS.LVTN.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class NamHocResponse {

    private Integer namHocId;
    private String tenNamHoc;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private String trangThai; // HIEN_TAI, CU, MOI
}
