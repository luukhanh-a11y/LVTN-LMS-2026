package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.NguonCap;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "khen_thuong_hoc_sinh")
@Getter
@Setter
@NoArgsConstructor
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
    private NguonCap nguonCap;

    @Column(name = "thoi_diem_trao", nullable = false, updatable = false)
    private LocalDateTime thoiDiemTrao;

    @Column(name = "da_gui_email", nullable = false)
    private Boolean daGuiEmail = false;

    @PrePersist
    protected void onCreate() {
        thoiDiemTrao = LocalDateTime.now();
    }
}
