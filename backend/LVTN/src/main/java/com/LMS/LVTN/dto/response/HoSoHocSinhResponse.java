package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.GioiTinh;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class HoSoHocSinhResponse {

    private Long hocSinhId;
    private String nguoiDungId;
    private Long lopHocId;
    private String maHocSinh;
    private String hoTen;
    private LocalDate ngaySinh;
    private GioiTinh gioiTinh;
    private String anhDaiDienUrl;
    private Integer tongXp;
}
