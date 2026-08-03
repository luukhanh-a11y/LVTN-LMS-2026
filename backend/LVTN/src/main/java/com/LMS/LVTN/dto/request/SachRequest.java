package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.LoaiSach;
import com.LMS.LVTN.enums.TrangThaiMonHoc;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SachRequest {

    private Integer bookIdNgoai;
    private LoaiSach loaiSach;
    private String boSach;
    private Short khoiLop;
    private Short monHocId;
    private Short hocKy;
    private String tenSach;
    private String slug;
    private String moTa;
    private String anhBiaUrl;
    private Short tongSoTrang;
    private Short namXuatBan;
    private String banQuyen;
    private String banBienSoan;  // JSON string
    private TrangThaiMonHoc trangThai;
}
