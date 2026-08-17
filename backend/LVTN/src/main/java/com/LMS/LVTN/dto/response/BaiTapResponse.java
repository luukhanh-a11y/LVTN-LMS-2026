package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.LoaiBaiTap;
import com.LMS.LVTN.enums.TrangThaiBaiTap;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BaiTapResponse {

    private Long baiTapId;
    private Long giaoVienId;
    private String tenGiaoVien; // Flattened
    private Long lopHocId;
    private String tenLop; // Flattened
    private Integer dangBaiId;
    private String tenDangBai; // Flattened
    private Integer hocKyId;
    private Short soHocKy; // Flattened
    private String tenNamHoc; // Flattened
    private String tieuDe;
    private String moTa;
    private LoaiBaiTap loaiBaiTap;
    private LocalDateTime thoiDiemBatDau;
    private LocalDateTime deadline;
    private Short soLanNopLaiToiDa;
    private TrangThaiBaiTap trangThai;
    private LocalDateTime ngayTao;
    private java.util.List<Integer> danhSachDangBaiId;
    private java.util.List<ChiTietBaiTapGameResponse> danhSachChiTiet;
    private String cheDoGiaoDien;
    private Object cauHinh; // JSON hoặc DTO câu hỏi đã giấu đáp án (cho tương thích ngược)
    private String loai; // "NHIEU_CAU", "TRAC_NGHIEM", "NOI_CAP", ...
    private Long soLuongNop; // Số bài nộp thực tế (đếm riêng, không map trực tiếp từ entity)
    private Long soLuongChuaCham; // Số bài nộp đang ở trạng thái CHUA_CHAM của riêng bài tập này

    // Alias getters phục vụ trực tiếp cho Frontend (AssignmentQuizPlayer.tsx)
    public Long getAssignmentId() { return baiTapId; }
    public String getTitle() { return tieuDe; }
    public Boolean getAllowResubmit() { return soLanNopLaiToiDa != null && (soLanNopLaiToiDa > 0 || soLanNopLaiToiDa == -1); }
    public Short getMaxResubmitCount() { return soLanNopLaiToiDa != null ? soLanNopLaiToiDa : (short) 0; }
    public Boolean getIsPastDeadline() { return deadline != null && java.time.LocalDateTime.now().isAfter(deadline); }
}
