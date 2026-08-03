package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NguoiDungRequest {
    private String tenDangNhap;
    private String matKhau;
    private String email;
    private String soDienThoai;
}
