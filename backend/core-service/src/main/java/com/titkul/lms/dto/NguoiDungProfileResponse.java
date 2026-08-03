package com.titkul.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NguoiDungProfileResponse {
    private String username;
    private String email;
    private String phone;
    private String role;
    private String fullName;
    private String avatarUrl;
}
