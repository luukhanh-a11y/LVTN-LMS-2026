package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.LoaiBaiTap;
import com.LMS.LVTN.enums.TrangThaiBaiTap;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BaiTapResponse {

    private Long baiTapId;
    private Long giaoVienId;
    private String tenGiaoVien; // Flattened
    private Long lopHocId;
    private String tenLop; // Flattened
    private Integer dangBaiId;
    private String tenDangBai; // Flattened
    private Integer hocKyId;
    private Short soHocKy; // Flattened
    private String tenNamHoc; // Flattened
    private String tieuDe;
    private String moTa;
    private LoaiBaiTap loaiBaiTap;
    private LocalDateTime thoiDiemBatDau;
    private LocalDateTime deadline;
    private Boolean choNopLai;
    private Short soLanNopLaiToiDa;
    private TrangThaiBaiTap trangThai;
    private LocalDateTime ngayTao;
}
