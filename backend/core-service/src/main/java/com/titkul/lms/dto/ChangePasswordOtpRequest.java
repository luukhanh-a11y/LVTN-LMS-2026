package com.titkul.lms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordOtpRequest {
    @NotBlank(message = "Mật khẩu hiện tại không được để trống")
    private String oldPassword;
}
