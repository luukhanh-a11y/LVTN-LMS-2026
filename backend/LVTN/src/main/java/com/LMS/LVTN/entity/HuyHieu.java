package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.LoaiHuyHieu;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "huy_hieu")
@Getter
@Setter
@NoArgsConstructor
public class HuyHieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "huy_hieu_id")
    private Integer huyHieuId;

    @Column(name = "ten_huy_hieu", nullable = false, length = 100, unique = true)
    private String tenHuyHieu;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "icon_url", length = 500)
    private String iconUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai", nullable = false)
    private LoaiHuyHieu loai;

    @Column(name = "dieu_kien", columnDefinition = "json")
    private String dieuKien;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "huyHieu", fetch = FetchType.LAZY)
    private List<KhenThuongHocSinh> khenThuongHocSinhs = new ArrayList<>();
}
