package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "nam_hoc")
@Getter
@Setter
@NoArgsConstructor
public class NamHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nam_hoc_id")
    private Integer namHocId;

    @Column(name = "ten_nam_hoc", nullable = false, length = 20, unique = true)
    private String tenNamHoc;

    @Column(name = "ngay_bat_dau")
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDate ngayKetThuc;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "namHoc", fetch = FetchType.LAZY)
    private List<HocKy> hocKys = new ArrayList<>();

    @OneToMany(mappedBy = "namHoc", fetch = FetchType.LAZY)
    private List<LopHoc> lopHocs = new ArrayList<>();
}
