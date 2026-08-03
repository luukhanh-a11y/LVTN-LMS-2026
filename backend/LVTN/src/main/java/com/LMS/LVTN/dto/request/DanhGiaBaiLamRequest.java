package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.HanhDongDanhGia;
import com.LMS.LVTN.enums.XepLoai;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class DanhGiaBaiLamRequest {

    private Long baiNopId;
    private Long giaoVienId;
    private BigDecimal diemSo;
    private XepLoai xepLoai;
    private String nhanXet;
    private HanhDongDanhGia hanhDong;
}
