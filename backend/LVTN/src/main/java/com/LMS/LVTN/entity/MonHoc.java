package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.TrangThaiMonHoc;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mon_hoc")
@Getter
@Setter
@NoArgsConstructor
public class MonHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mon_hoc_id")
    private Short monHocId;

    @Column(name = "ten_mon", nullable = false, length = 100, unique = true)
    private String tenMon;

    @Column(name = "ma_mon", length = 20)
    private String maMon;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiMonHoc trangThai;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "monHoc", fetch = FetchType.LAZY)
    private List<PhanCongGiangDay> phanCongGiangDays = new ArrayList<>();

    @OneToMany(mappedBy = "monHoc", fetch = FetchType.LAZY)
    private List<Sach> sachs = new ArrayList<>();

}
