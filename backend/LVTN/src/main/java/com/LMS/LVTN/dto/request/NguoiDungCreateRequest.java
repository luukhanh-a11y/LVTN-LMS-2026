package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.TrangThaiNguoiDung;
import com.LMS.LVTN.enums.VaiTro;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NguoiDungCreateRequest {

    private String tenDangNhap;
    private String matKhau;
    private VaiTro vaiTro;
    private TrangThaiNguoiDung trangThai;
    private String email;
    private String soDienThoai;
}
