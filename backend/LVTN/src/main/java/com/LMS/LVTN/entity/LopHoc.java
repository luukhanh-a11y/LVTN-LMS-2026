package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.TrangThaiLopHoc;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lop_hoc",
       uniqueConstraints = @UniqueConstraint(columnNames = {"ten_lop", "khoi_lop", "nam_hoc_id"}))
@Getter
@Setter
@NoArgsConstructor
public class LopHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lop_hoc_id")
    private Long lopHocId;

    @Column(name = "ten_lop", nullable = false, length = 20)
    private String tenLop;

    @Column(name = "khoi_lop", nullable = false)
    private Short khoiLop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nam_hoc_id", nullable = false)
    private NamHoc namHoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_chu_nhiem_id")
    private HoSoGiaoVien giaoVienChuNhiem;

    @Column(name = "si_so_toi_da", nullable = false)
    private Short siSoToiDa = 40;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiLopHoc trangThai;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "lopHoc", fetch = FetchType.LAZY)
    private List<HoSoHocSinh> hoSoHocSinhs = new ArrayList<>();

    @OneToMany(mappedBy = "lopHoc", fetch = FetchType.LAZY)
    private List<PhanCongGiangDay> phanCongGiangDays = new ArrayList<>();

    @OneToMany(mappedBy = "lopHoc", fetch = FetchType.LAZY)
    private List<BaiTap> baiTaps = new ArrayList<>();
}
