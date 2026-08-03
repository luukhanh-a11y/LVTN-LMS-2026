package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.TrangThaiLopHoc;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LopHocRequest {

    private String tenLop;
    private Short khoiLop;
    private Integer namHocId;
    private Long giaoVienChuNhiemId;
    private Short siSoToiDa;
    private TrangThaiLopHoc trangThai;
}
