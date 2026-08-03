// Force recompile
package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.LoaiNoiDung;
import com.LMS.LVTN.enums.NguonGoc;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DangBaiRequest {

    private Integer baiHocId;
    private Integer bookIndexIdNgoai;
    private String tenDangBai;
    private String slug;
    private Short soTrang;
    private Short soThuTu;
    private LoaiNoiDung loaiNoiDung;
    private NguonGoc nguonGoc;
    private Long giaoVienId;
    private String h5pNoiDungId;
    private Short xpThuong;
    private String duLieuGame; // JSON string for UI
    private String dapAnChuan; // JSON string for scoring
}
