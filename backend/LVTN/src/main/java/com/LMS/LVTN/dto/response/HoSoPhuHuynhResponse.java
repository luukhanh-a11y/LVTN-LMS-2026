package com.LMS.LVTN.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
public class HoSoPhuHuynhResponse {

    private Long phuHuynhId;
    private String nguoiDungId;
    private String hoTen;
    private String emailNhanThongBao;
    private String soDienThoai;
}
