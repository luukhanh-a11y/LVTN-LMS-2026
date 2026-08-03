package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.GioiTinh;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class HoSoGiaoVienResponse {

    private Long giaoVienId;
    private String nguoiDungId;
    private String maGiaoVien;
    private String hoTen;
    private String boMon;
    private LocalDate ngaySinh;
    private GioiTinh gioiTinh;
    private String anhDaiDienUrl;
}
