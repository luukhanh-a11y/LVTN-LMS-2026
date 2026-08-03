package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tien_do_hoc_sinh")
@Data
@NoArgsConstructor
public class StudentProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tien_do_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", referencedColumnName = "hoc_sinh_id", nullable = false)
    private HoSoHocSinh student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dang_bai_id", nullable = false)
    private DangBai contentNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_ky_id", nullable = false)
    private HocKy semester;

    @Column(name = "phan_tram_hoan_thanh", nullable = false)
    private Short completionPercent = 0;

    @Column(name = "thoi_gian_hoc", nullable = false)
    private Integer timeSpentSeconds = 0;

    @Column(name = "lan_xem_cuoi")
    private LocalDateTime lastViewedAt;

    @Column(name = "da_hoan_thanh", nullable = false)
    private Boolean completed = false;
}
