package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class KetQuaCuoiNamDuyetRequest {

    private Long ketQuaId;
    private Long lopMoiId;
    private String namHocMoi;
}
