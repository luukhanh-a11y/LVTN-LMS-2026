package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.LoaiNoiDung;
import com.LMS.LVTN.enums.NguonGoc;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class DangBaiStudentResponse {

    private Integer dangBaiId;
    private Integer baiHocId;
    private String tenBaiHoc; // Flattened
    private Integer bookIndexIdNgoai;
    private String tenDangBai;
    private String slug;
    private Short soTrang;
    private Short soThuTu;
    private LoaiNoiDung loaiNoiDung;
    private NguonGoc nguonGoc;
    private Long giaoVienId;
    private String tenGiaoVien; // Flattened
    private String h5pNoiDungId;
    private Short xpThuong;
    private String duLieuGame; // JSON string for UI
    // LƯU Ý: ĐÃ TƯỚC BỎ TRƯỜNG dapAnChuan để bảo vệ tính công phu và công bằng của bài thi cho Học sinh!
    private LocalDateTime ngayTao;
}
