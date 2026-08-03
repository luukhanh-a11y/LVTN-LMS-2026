package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.HanhDongDanhGia;
import com.LMS.LVTN.enums.XepLoai;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "danh_gia_bai_lam")
@Getter
@Setter
@NoArgsConstructor
public class DanhGiaBaiLam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "danh_gia_id")
    private Long danhGiaId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_nop_id", nullable = false, unique = true)
    private BaiNop baiNop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", nullable = false)
    private HoSoGiaoVien giaoVien;

    @Column(name = "diem_so", precision = 4, scale = 1)
    private BigDecimal diemSo;

    @Enumerated(EnumType.STRING)
    @Column(name = "xep_loai")
    private XepLoai xepLoai;

    @Column(name = "nhan_xet", columnDefinition = "TEXT")
    private String nhanXet;

    @Enumerated(EnumType.STRING)
    @Column(name = "hanh_dong", nullable = false)
    private HanhDongDanhGia hanhDong;

    @Column(name = "thoi_diem_cham", nullable = false, updatable = false)
    private LocalDateTime thoiDiemCham;

    @PrePersist
    protected void onCreate() {
        thoiDiemCham = LocalDateTime.now();
    }
}
