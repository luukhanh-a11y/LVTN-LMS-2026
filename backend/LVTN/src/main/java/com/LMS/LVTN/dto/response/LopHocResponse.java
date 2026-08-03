package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.TrangThaiLopHoc;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class LopHocResponse {

    private Long lopHocId;
    private String tenLop;
    private Short khoiLop;
    private Integer namHocId;
    private String tenNamHoc; // Flattened
    private Long giaoVienChuNhiemId;
    private String tenGiaoVienChuNhiem; // Flattened
    private Short siSoToiDa;
    private TrangThaiLopHoc trangThai;
    private LocalDateTime ngayTao;
}
