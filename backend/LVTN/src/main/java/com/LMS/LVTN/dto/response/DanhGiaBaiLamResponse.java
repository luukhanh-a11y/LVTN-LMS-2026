package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.HanhDongDanhGia;
import com.LMS.LVTN.enums.XepLoai;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class DanhGiaBaiLamResponse {

    private Long danhGiaId;
    private Long baiNopId;
    private Long giaoVienId;
    private String tenGiaoVien; // Flattened
    private BigDecimal diemSo;
    private XepLoai xepLoai;
    private String nhanXet;
    private HanhDongDanhGia hanhDong;
    private LocalDateTime thoiDiemCham;
}
