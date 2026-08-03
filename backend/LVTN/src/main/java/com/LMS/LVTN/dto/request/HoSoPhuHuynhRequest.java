package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HoSoPhuHuynhRequest {

    private String nguoiDungId;
    private String hoTen;
    private String emailNhanThongBao;
}
