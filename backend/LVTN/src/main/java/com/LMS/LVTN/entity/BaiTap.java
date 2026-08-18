package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.LoaiBaiTap;
import com.LMS.LVTN.enums.TrangThaiBaiTap;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bai_tap")
@Getter
@Setter
@NoArgsConstructor
public class BaiTap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bai_tap_id")
    private Long baiTapId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", nullable = false)
    private HoSoGiaoVien giaoVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id", nullable = false)
    private LopHoc lopHoc;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dang_bai_id")
    private DangBai dangBai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_ky_id", nullable = false)
    private HocKy hocKy;

    @Column(name = "tieu_de", nullable = false, length = 300)
    private String tieuDe;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_bai_tap", nullable = false)
    private LoaiBaiTap loaiBaiTap;

    @Column(name = "thoi_diem_bat_dau")
    private LocalDateTime thoiDiemBatDau;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @Column(name = "so_lan_nop_lai_toi_da", nullable = false)
    private Short soLanNopLaiToiDa = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiBaiTap trangThai;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime ngayTao;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "baiTap", fetch = FetchType.LAZY)
    private List<BaiNop> baiNops = new ArrayList<>();

    @OneToMany(mappedBy = "baiTap", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ChiTietBaiTap> chiTietBaiTaps = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
    }
}
