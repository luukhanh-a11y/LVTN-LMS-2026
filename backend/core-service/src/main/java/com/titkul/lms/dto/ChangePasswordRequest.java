package com.titkul.lms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank(message = "Mật khẩu mới không được để trống")
    private String newPassword;
}
