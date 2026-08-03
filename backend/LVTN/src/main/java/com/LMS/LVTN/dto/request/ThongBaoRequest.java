package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.LoaiThongBao;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ThongBaoRequest {

    private String nguoiGuiId;
    private String nguoiNhanId;
    private Long lopHocId;
    private String tieuDe;
    private String noiDung;
    private String fileDinhKem;
    private LoaiThongBao loaiThongBao;
    private Boolean laGhim;
}
