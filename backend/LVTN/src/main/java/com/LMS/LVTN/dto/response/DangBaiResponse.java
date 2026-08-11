package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.LoaiNoiDung;
import com.LMS.LVTN.enums.NguonGoc;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class DangBaiResponse {

    private Integer dangBaiId;
    private Integer baiHocId;
    private String tenBaiHoc; // Flattened
    private Short khoiLop; // Flattened từ baiHoc.chuDe.sach
    private String maMon; // Flattened từ baiHoc.chuDe.sach.monHoc
    private String tenMon; // Flattened từ baiHoc.chuDe.sach.monHoc
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
    private String dapAnChuan; // JSON string for scoring (Lưu ý: Ẩn trường này khi trả về cho học sinh)
    private LocalDateTime ngayTao;
}
