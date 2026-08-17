package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.HanhDongDanhGia;
import com.LMS.LVTN.enums.XepLoai;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class DanhGiaBaiLamRequest {

    private Long baiNopId;
    private Long giaoVienId;

    @DecimalMin(value = "0", message = "Điểm phải từ 0 đến 10")
    @DecimalMax(value = "10", message = "Điểm phải từ 0 đến 10")
    private BigDecimal diemSo;

    private XepLoai xepLoai;
    private String nhanXet;
    private HanhDongDanhGia hanhDong;
}
