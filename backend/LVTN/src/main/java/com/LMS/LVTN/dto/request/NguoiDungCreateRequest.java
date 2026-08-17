package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.TrangThaiNguoiDung;
import com.LMS.LVTN.enums.VaiTro;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NguoiDungCreateRequest {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String tenDangNhap;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String matKhau;

    private VaiTro vaiTro;
    private TrangThaiNguoiDung trangThai;

    @Email(message = "Email không đúng định dạng")
    private String email;

    private String soDienThoai;
}
