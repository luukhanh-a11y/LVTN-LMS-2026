package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.LoaiSach;
import com.LMS.LVTN.enums.TrangThaiMonHoc;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class SachResponse {

    private Integer sachId;
    private Integer bookIdNgoai;
    private LoaiSach loaiSach;
    private String boSach;
    private Short khoiLop;
    private Short monHocId;
    private String tenMonHoc; // Flattened
    private Short hocKy;
    private String tenSach;
    private String slug;
    private String moTa;
    private String anhBiaUrl;
    private Short tongSoTrang;
    private Short namXuatBan;
    private String banQuyen;
    private String banBienSoan; // JSON string
    private TrangThaiMonHoc trangThai;
    private LocalDateTime ngayTao;
    private LocalDateTime ngayCapNhat;
}
