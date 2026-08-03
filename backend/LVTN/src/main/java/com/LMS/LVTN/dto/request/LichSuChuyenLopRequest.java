package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.LyDoChuyenLop;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LichSuChuyenLopRequest {

    private Long hocSinhId;
    private Long lopCuId;
    private Long lopMoiId;
    private String namHocCu;
    private String namHocMoi;
    private LyDoChuyenLop lyDo;
    private String ghiChu;
    private String nguoiThucHienId;
}
