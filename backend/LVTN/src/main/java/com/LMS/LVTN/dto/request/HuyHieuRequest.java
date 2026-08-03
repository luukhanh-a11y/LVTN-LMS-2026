package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.LoaiHuyHieu;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HuyHieuRequest {

    private String tenHuyHieu;
    private String moTa;
    private String iconUrl;
    private LoaiHuyHieu loai;
    private String dieuKien;  // JSON string
}
