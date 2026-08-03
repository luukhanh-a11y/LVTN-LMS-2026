package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ho_so_phu_huynh")
@Getter
@Setter
@NoArgsConstructor
public class HoSoPhuHuynh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phu_huynh_id")
    private Long phuHuynhId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false, unique = true)
    private NguoiDung nguoiDung;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "email_nhan_thong_bao", length = 150)
    private String emailNhanThongBao;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "phuHuynh", fetch = FetchType.LAZY)
    private List<PhuHuynhHocSinh> phuHuynhHocSinhs = new ArrayList<>();
}
