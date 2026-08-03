package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.GioiTinh;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ho_so_hoc_sinh")
@Getter
@Setter
@NoArgsConstructor
public class HoSoHocSinh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hoc_sinh_id")
    private Long hocSinhId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false, unique = true)
    private NguoiDung nguoiDung;

    @Column(name = "ma_hoc_sinh", nullable = false, length = 30, unique = true)
    private String maHocSinh;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Enumerated(EnumType.STRING)
    @Column(name = "gioi_tinh")
    private GioiTinh gioiTinh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id")
    private LopHoc lopHoc;

    @Column(name = "tong_xp", nullable = false)
    private Integer tongXp = 0;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "hocSinh", fetch = FetchType.LAZY)
    private List<PhuHuynhHocSinh> phuHuynhHocSinhs = new ArrayList<>();

    @OneToMany(mappedBy = "hocSinh", fetch = FetchType.LAZY)
    private List<BaiNop> baiNops = new ArrayList<>();

    @OneToMany(mappedBy = "hocSinh", fetch = FetchType.LAZY)
    private List<TienDoHocSinh> tienDoHocSinhs = new ArrayList<>();

    @OneToMany(mappedBy = "hocSinh", fetch = FetchType.LAZY)
    private List<KhenThuongHocSinh> khenThuongHocSinhs = new ArrayList<>();

    @OneToMany(mappedBy = "hocSinh", fetch = FetchType.LAZY)
    private List<LichSuTuHoc> lichSuTuHocs = new ArrayList<>();
}
