package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.KetQuaHocTap;
import com.LMS.LVTN.enums.KetQuaRenLuyen;
import com.LMS.LVTN.enums.QuyetDinhCuoiNam;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class KetQuaCuoiNamResponse {

    private Long ketQuaId;
    private Long hocSinhId;
    private String hoTenHocSinh; // Flattened
    private Long lopHocId;
    private String tenLop; // Flattened
    private String namHoc;
    private KetQuaHocTap ketQuaHocTap;
    private KetQuaRenLuyen ketQuaRenLuyen;
    private QuyetDinhCuoiNam quyetDinh;
    private Boolean duocXetDacCach;
    private String lyDoDacCach;
    private Long giaoVienXetId;
    private String tenGiaoVienXet; // Flattened
    private LocalDate ngayXet;
    private String ghiChu;
    private Boolean daDuyet;
}
