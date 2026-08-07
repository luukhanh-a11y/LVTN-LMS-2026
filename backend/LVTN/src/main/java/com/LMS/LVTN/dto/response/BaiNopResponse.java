package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.TrangThaiBaiNop;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BaiNopResponse {

    private Long baiNopId;
    private Long baiTapId;
    private String tieuDeBaiTap; // Flattened
    private Long hocSinhId;
    private String hoTenHocSinh; // Flattened
    private String noiDungText;
    private String fileDinhKem;
    private BigDecimal diemTuDong;
    private Short xpNhanDuoc;
    private String chiTietBaiLam; // JSON string
    private Short soLanLam;
    private TrangThaiBaiNop trangThai;
    private Boolean laNopTre;
    private LocalDateTime thoiDiemNop;

    // Alias getters phục vụ trực tiếp cho Frontend (AssignmentQuizPlayer.tsx / SubmissionResult)
    public BigDecimal getScore() { return diemTuDong != null ? diemTuDong : BigDecimal.ZERO; }
    public Short getXpEarned() { return xpNhanDuoc != null ? xpNhanDuoc : 0; }
    public Boolean getIsLate() { return laNopTre != null ? laNopTre : false; }
    public String getStatus() { return trangThai != null ? trangThai.name() : ""; }
}
