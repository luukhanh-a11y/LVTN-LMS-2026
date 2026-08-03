package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "phan_cong_giang_day",
       uniqueConstraints = @UniqueConstraint(columnNames = {"giao_vien_id", "lop_hoc_id", "mon_hoc_id", "hoc_ky_id"}))
@Getter
@Setter
@NoArgsConstructor
public class PhanCongGiangDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phan_cong_id")
    private Long phanCongId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", nullable = false)
    private HoSoGiaoVien giaoVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id", nullable = false)
    private LopHoc lopHoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mon_hoc_id", nullable = false)
    private MonHoc monHoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_ky_id", nullable = false)
    private HocKy hocKy;

    @Column(name = "ngay_phan_cong", nullable = false, updatable = false)
    private LocalDateTime ngayPhanCong;

    @PrePersist
    protected void onCreate() {
        ngayPhanCong = LocalDateTime.now();
    }
}
