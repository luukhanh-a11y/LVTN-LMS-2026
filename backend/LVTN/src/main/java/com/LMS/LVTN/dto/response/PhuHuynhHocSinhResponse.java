package com.LMS.LVTN.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhuHuynhHocSinhResponse {
    private HoSoPhuHuynhResponse hoSoPhuHuynhResponse;
    private HoSoHocSinhResponse hoSoHocSinhResponse;
    private String quanHe;
    private LocalDateTime thoiDiemLienKet;
}
