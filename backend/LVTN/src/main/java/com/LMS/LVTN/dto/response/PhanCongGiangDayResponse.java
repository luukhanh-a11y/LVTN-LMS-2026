package com.LMS.LVTN.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PhanCongGiangDayResponse {

    private Long phanCongId;
    private Long giaoVienId;
    private String tenGiaoVien; // Flattened
    private Long lopHocId;
    private String tenLop; // Flattened
    private Integer monHocId;
    private String maMon;
    private String tenMon; // Flattened
    private Integer hocKyId;
    private Short soHocKy; // Flattened
    private String tenNamHoc; // Flattened
    private LocalDateTime ngayPhanCong;
}
