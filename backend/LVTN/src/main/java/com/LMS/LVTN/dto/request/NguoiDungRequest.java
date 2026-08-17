package com.LMS.LVTN.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NguoiDungRequest {
    private String tenDangNhap;
    private String matKhau;

    @Email(message = "Email không đúng định dạng")
    private String email;

    private String soDienThoai;
}
