package com.LMS.LVTN.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HoSoPhuHuynhRequest {

    private String nguoiDungId;
    private String hoTen;

    @Email(message = "Email nhận thông báo không đúng định dạng")
    private String emailNhanThongBao;
}
