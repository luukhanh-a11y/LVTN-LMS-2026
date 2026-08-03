package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "phan_phoi_dang_bai", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"dang_bai_id", "lop_hoc_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhanPhoiDangBai {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phan_phoi_id")
    private Long phanPhoiId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dang_bai_id", nullable = false)
    private DangBai dangBai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id", nullable = false)
    private LopHoc lopHoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", nullable = false)
    private HoSoGiaoVien giaoVien;

    @Column(name = "ngay_chia_se", nullable = false)
    private LocalDateTime ngayChiaSe = LocalDateTime.now();
}
