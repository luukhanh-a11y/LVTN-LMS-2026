package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PhieuHoTroRequest {

    private String nguoiDungTaoId;
    private String nguoiDungLienQuanId;
    private String loaiYeuCau;
    private String moTa;
}
