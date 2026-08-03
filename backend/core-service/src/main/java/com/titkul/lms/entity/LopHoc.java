package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lop_hoc")
@Data
@NoArgsConstructor
public class LopHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lop_hoc_id", columnDefinition = "BIGINT UNSIGNED")
    private Long lopHocId;

    @Column(name = "ten_lop", nullable = false, length = 20)
    private String tenLop;

    @Column(name = "khoi_lop", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short khoiLop;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nam_hoc_id", nullable = false, columnDefinition = "INT UNSIGNED")
    private NamHoc namHoc;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_chu_nhiem_id", columnDefinition = "BIGINT UNSIGNED")
    private HoSoGiaoVien giaoVienChuNhiem;

    @Column(name = "si_so_toi_da", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short siSoToiDa = 40;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiLopHoc trangThai = TrangThaiLopHoc.ACTIVE;

    @Transient
    private Integer siSoHienTai = 0;
}
