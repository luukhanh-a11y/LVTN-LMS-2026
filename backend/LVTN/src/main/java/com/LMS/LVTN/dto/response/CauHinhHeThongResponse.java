package com.LMS.LVTN.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CauHinhHeThongResponse {

    private Short cauHinhId;
    private String tenTruong;
    private String logoUrl;
    private String diaChi;
    private String hotline;
    private String emailLienHe;
    private Integer hocKyHienTaiId;
    private Short soHocKyHienTai; // Flattened
    private String tenNamHocHienTai; // Flattened

    private Boolean danhGiaCuoiNamDangMo;
    private String namHocDanhGia;
}
