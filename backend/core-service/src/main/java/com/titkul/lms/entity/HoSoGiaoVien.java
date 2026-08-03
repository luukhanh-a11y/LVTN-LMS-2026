package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "ho_so_giao_vien")
@Data
@NoArgsConstructor
public class HoSoGiaoVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "giao_vien_id", columnDefinition = "BIGINT UNSIGNED")
    private Long giaoVienId;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false, unique = true, columnDefinition = "BIGINT UNSIGNED")
    private NguoiDung nguoiDung;

    @Column(name = "ma_giao_vien", unique = true, length = 30)
    private String maGiaoVien;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "bo_mon", length = 100)
    private String boMon;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;
}
