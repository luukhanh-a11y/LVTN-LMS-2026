package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hoc_ky",
       uniqueConstraints = @UniqueConstraint(columnNames = {"nam_hoc_id", "so_hoc_ky"}))
@Getter
@Setter
@NoArgsConstructor
public class HocKy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hoc_ky_id")
    private Integer hocKyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nam_hoc_id", nullable = false)
    private NamHoc namHoc;

    @Column(name = "so_hoc_ky", nullable = false)
    private Short soHocKy;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "hocKy", fetch = FetchType.LAZY)
    private List<PhanCongGiangDay> phanCongGiangDays = new ArrayList<>();

    @OneToMany(mappedBy = "hocKy", fetch = FetchType.LAZY)
    private List<BaiTap> baiTaps = new ArrayList<>();

    @OneToMany(mappedBy = "hocKy", fetch = FetchType.LAZY)
    private List<TienDoHocSinh> tienDoHocSinhs = new ArrayList<>();
}
