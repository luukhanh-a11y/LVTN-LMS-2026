package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "khen_thuong_hoc_sinh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhenThuongHocSinh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "khen_thuong_id")
    private Long khenThuongId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", nullable = false)
    private HoSoHocSinh hocSinh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "huy_hieu_id", nullable = false)
    private HuyHieu huyHieu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id")
    private HoSoGiaoVien giaoVien;

    @Column(name = "thu_khen", columnDefinition = "TEXT")
    private String thuKhen;

    @Enumerated(EnumType.STRING)
    @Column(name = "nguon_cap", nullable = false)
    private NguonCap nguonCap = NguonCap.THU_CONG;

    @Builder.Default
    @Column(name = "thoi_diem_trao", nullable = false, updatable = false)
    private LocalDateTime thoiDiemTrao = LocalDateTime.now();

    @Column(name = "da_gui_email", nullable = false)
    private Boolean daGuiEmail = false;
}
