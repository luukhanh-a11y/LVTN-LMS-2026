package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "lich_su_tu_hoc")
@Getter
@Setter
@NoArgsConstructor
public class LichSuTuHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tu_hoc_id")
    private Long tuHocId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", nullable = false)
    private HoSoHocSinh hocSinh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dang_bai_id", nullable = false)
    private DangBai dangBai;

    @Column(name = "diem_so", precision = 5, scale = 2)
    private BigDecimal diemSo;

    @Column(name = "chi_tiet_bai_lam", columnDefinition = "json")
    private String chiTietBaiLam;

    @Column(name = "thoi_gian_nop", nullable = false, updatable = false)
    private LocalDateTime thoiGianNop;

    @PrePersist
    protected void onCreate() {
        thoiGianNop = LocalDateTime.now();
    }
}
