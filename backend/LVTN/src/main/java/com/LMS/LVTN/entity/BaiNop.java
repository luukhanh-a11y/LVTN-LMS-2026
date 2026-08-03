package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.TrangThaiBaiNop;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bai_nop",
       uniqueConstraints = @UniqueConstraint(columnNames = {"bai_tap_id", "hoc_sinh_id", "so_lan_lam"}))
@Getter
@Setter
@NoArgsConstructor
public class BaiNop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bai_nop_id")
    private Long baiNopId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_tap_id", nullable = false)
    private BaiTap baiTap;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", nullable = false)
    private HoSoHocSinh hocSinh;

    @Column(name = "noi_dung_text", columnDefinition = "TEXT")
    private String noiDungText;

    @Column(name = "file_dinh_kem", length = 500)
    private String fileDinhKem;

    @Column(name = "diem_tu_dong", precision = 5, scale = 2)
    private BigDecimal diemTuDong;

    @Column(name = "xp_nhan_duoc", nullable = false)
    private Short xpNhanDuoc = 0;

    @Column(name = "chi_tiet_bai_lam", columnDefinition = "json")
    private String chiTietBaiLam;

    @Column(name = "so_lan_lam", nullable = false)
    private Short soLanLam = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiBaiNop trangThai;

    @Column(name = "la_nop_tre", nullable = false)
    private Boolean laNopTre = false;

    @Column(name = "thoi_diem_nop")
    private LocalDateTime thoiDiemNop;

    // ── Quan hệ 1-1 ──
    @OneToOne(mappedBy = "baiNop", fetch = FetchType.LAZY)
    private DanhGiaBaiLam danhGiaBaiLam;
}
