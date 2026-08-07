package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.TrangThaiNguoiDung;
import com.LMS.LVTN.enums.VaiTro;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
public class NguoiDungResponse {

    private String nguoiDungId;
    private String tenDangNhap;
    private VaiTro vaiTro;
    private TrangThaiNguoiDung trangThai;
    private String email;
    private String soDienThoai;

    // Các trường dùng chung
    private String hoTen;

    // Dành cho Học sinh
    private String maHocSinh;
    private String tenLop;
    private Short khoiLop;
    private Long lopHocId;

    // Dành cho Giáo viên
    private String maGiaoVien;
    private String boMon;
    private String lopGiangDay;
    private java.util.List<Long> lopGiangDayIds;

    // Dành cho Phụ huynh
    private String tenCon;
    private String lopCuaCon;
    private java.util.List<Long> lopCuaConIds;
}
