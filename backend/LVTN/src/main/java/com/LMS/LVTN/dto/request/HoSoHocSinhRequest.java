package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.GioiTinh;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class HoSoHocSinhRequest {

    private String nguoiDungId;
    private String maHocSinh;
    private String hoTen;
    private LocalDate ngaySinh;
    private GioiTinh gioiTinh;
    private Long lopHocId;
}
