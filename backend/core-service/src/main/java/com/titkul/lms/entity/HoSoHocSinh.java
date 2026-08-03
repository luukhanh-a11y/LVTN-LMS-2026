package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "ho_so_hoc_sinh")
@Data
@NoArgsConstructor
public class HoSoHocSinh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hoc_sinh_id", columnDefinition = "BIGINT UNSIGNED")
    private Long hocSinhId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false, unique = true, columnDefinition = "BIGINT UNSIGNED")
    private NguoiDung nguoiDung;

    @Column(name = "ma_hoc_sinh", nullable = false, unique = true, length = 30)
    private String maHocSinh;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id", columnDefinition = "BIGINT UNSIGNED")
    private LopHoc lopHoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phu_huynh_id", columnDefinition = "BIGINT UNSIGNED")
    private HoSoPhuHuynh phuHuynh;

    @Column(name = "tong_xp", nullable = false)
    private Integer tongXp = 0;
}
