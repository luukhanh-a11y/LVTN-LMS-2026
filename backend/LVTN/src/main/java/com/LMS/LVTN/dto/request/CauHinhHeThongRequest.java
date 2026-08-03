package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CauHinhHeThongRequest {

    private String tenTruong;
    private String logoUrl;
    private String diaChi;
    private String hotline;
    private String emailLienHe;
    private Integer hocKyHienTaiId;
}
