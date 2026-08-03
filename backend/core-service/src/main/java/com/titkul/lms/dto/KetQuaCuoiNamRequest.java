package com.titkul.lms.dto;

import com.titkul.lms.entity.KetQuaRenLuyen;
import com.titkul.lms.entity.QuyetDinhCuoiNam;
import com.titkul.lms.entity.XepLoai;
import lombok.Data;

import java.time.LocalDate;

@Data
public class KetQuaCuoiNamRequest {
    private XepLoai ketQuaHocTap;
    private KetQuaRenLuyen ketQuaRenLuyen;
    private QuyetDinhCuoiNam quyetDinh;
    private Boolean duocXetDacCach;
    private String lyDoDacCach;
    private LocalDate ngayXet;
    private String ghiChu;
}
