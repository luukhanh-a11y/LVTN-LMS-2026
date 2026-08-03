package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "bai_tap")
@Data
@NoArgsConstructor
public class BaiTap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bai_tap_id")
    private Long baiTapId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", referencedColumnName = "giao_vien_id", nullable = false)
    private HoSoGiaoVien giaoVien;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id", referencedColumnName = "lop_hoc_id", nullable = false)
    private LopHoc lopHoc;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_hoc_id")
    private BaiHoc baiHoc;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dang_bai_id")
    private DangBai dangBai;

    // Học liệu GV tự soạn ở Kho Học Liệu (hoc_lieu) — độc lập với cây SGK (DangBai).
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_lieu_id")
    private HocLieu hocLieu;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_ky_id", nullable = false)
    private HocKy hocKy;

    @Column(name = "tieu_de", nullable = false, length = 300)
    private String tieuDe;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_bai_tap", nullable = false, columnDefinition = "VARCHAR(20)")
    private LoaiBaiTap loaiBaiTap;

    @Column(name = "thoi_diem_bat_dau")
    private LocalDateTime thoiDiemBatDau;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @Column(name = "cho_nop_lai", nullable = false)
    private Boolean choNopLai = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiBaiTap trangThai = TrangThaiBaiTap.CHO_DANG;

    @Column(name = "so_lan_nop_lai_toi_da", nullable = false)
    private Integer soLanNopLaiToiDa = 1;

    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();
}
