package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.KetQuaHocTap;
import com.LMS.LVTN.enums.KetQuaRenLuyen;
import com.LMS.LVTN.enums.QuyetDinhCuoiNam;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class KetQuaCuoiNamRequest {

    private Long hocSinhId;
    private Long lopHocId;
    private String namHoc;
    private KetQuaHocTap ketQuaHocTap;
    private KetQuaRenLuyen ketQuaRenLuyen;
    private QuyetDinhCuoiNam quyetDinh;
    private Boolean duocXetDacCach;
    private String lyDoDacCach;
    private Long giaoVienXetId;
    private LocalDate ngayXet;
    private String ghiChu;

    // Trường phục vụ tự động chuyển đổi lớp học khi xét Quyết định cuối năm
    private Long lopMoiId;
    private String namHocMoi;
}
