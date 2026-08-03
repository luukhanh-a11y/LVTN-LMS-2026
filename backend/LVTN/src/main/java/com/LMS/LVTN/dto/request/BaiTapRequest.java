package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.LoaiBaiTap;
import com.LMS.LVTN.enums.TrangThaiBaiTap;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BaiTapRequest {

    private Long giaoVienId;
    private Long lopHocId;
    private Integer dangBaiId;
    private Integer hocKyId;
    private String tieuDe;
    private String moTa;
    private LoaiBaiTap loaiBaiTap;
    private LocalDateTime thoiDiemBatDau;
    private LocalDateTime deadline;
    private Boolean choNopLai;
    private Short soLanNopLaiToiDa;
    private TrangThaiBaiTap trangThai;
}
