package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ho_so_phu_huynh")
@Data
@NoArgsConstructor
public class HoSoPhuHuynh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phu_huynh_id", columnDefinition = "BIGINT UNSIGNED")
    private Long phuHuynhId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false, unique = true, columnDefinition = "BIGINT UNSIGNED")
    private NguoiDung nguoiDung;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "email_nhan_thong_bao", length = 150)
    private String emailNhanThongBao;

    @OneToMany(mappedBy = "phuHuynh", fetch = FetchType.LAZY)
    private java.util.List<HoSoHocSinh> danhSachHocSinh;
}
