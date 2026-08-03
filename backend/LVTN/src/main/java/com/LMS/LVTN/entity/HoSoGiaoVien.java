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
@Table(name = "ho_so_giao_vien")
@Getter
@Setter
@NoArgsConstructor
public class HoSoGiaoVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "giao_vien_id")
    private Long giaoVienId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false, unique = true)
    private NguoiDung nguoiDung;

    @Column(name = "ma_giao_vien", nullable = false, length = 30, unique = true)
    private String maGiaoVien;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "bo_mon", length = 100)
    private String boMon;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Enumerated(EnumType.STRING)
    @Column(name = "gioi_tinh")
    private GioiTinh gioiTinh;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "giaoVienChuNhiem", fetch = FetchType.LAZY)
    private List<LopHoc> lopChuNhiem = new ArrayList<>();

    @OneToMany(mappedBy = "giaoVien", fetch = FetchType.LAZY)
    private List<PhanCongGiangDay> phanCongGiangDays = new ArrayList<>();

    @OneToMany(mappedBy = "giaoVien", fetch = FetchType.LAZY)
    private List<BaiTap> baiTaps = new ArrayList<>();
}
