package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.TrangThaiNguoiDung;
import com.LMS.LVTN.enums.VaiTro;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
public class NguoiDungResponse {

    private String nguoiDungId;
    private String tenDangNhap;
    private VaiTro vaiTro;
    private TrangThaiNguoiDung trangThai;
    private String email;
    private String soDienThoai;
}
