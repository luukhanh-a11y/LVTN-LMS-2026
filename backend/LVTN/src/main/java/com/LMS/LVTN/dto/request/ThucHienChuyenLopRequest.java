package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ThucHienChuyenLopRequest {
    private Long hocSinhId;
    private String namHocCu;
    private String namHocMoi;
    private Long lopMoiId; // Có thể null trong trường hợp CHUYEN_CUP (Tốt nghiệp rời trường)
    private String nguoiThucHienId;
    private String ghiChu;
}
