package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "bai_nop")
@Data
@NoArgsConstructor
public class BaiNop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bai_nop_id")
    private Long baiNopId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_tap_id", referencedColumnName = "bai_tap_id", nullable = false)
    private BaiTap baiTap;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", referencedColumnName = "hoc_sinh_id", nullable = false)
    private HoSoHocSinh hocSinh;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dang_bai_id")
    private DangBai dangBai;

    @Column(name = "noi_dung_text", columnDefinition = "TEXT")
    private String noiDungText;

    @Column(name = "file_dinh_kem", length = 500)
    private String fileDinhKem;

    @Column(name = "diem_tu_dong", precision = 5, scale = 2)
    private BigDecimal diemTuDong;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "chi_tiet_bai_lam")
    private String chiTietBaiLam;

    @Column(name = "xp_nhan_duoc", nullable = false, columnDefinition = "SMALLINT UNSIGNED")
    private Integer xpNhanDuoc = 0;

    @Column(name = "so_lan_lam", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short soLanLam = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiBaiNop trangThai = TrangThaiBaiNop.CHUA_NOP;

    @Column(name = "la_nop_tre", nullable = false)
    private Boolean laNopTre = false;

    @Column(name = "thoi_diem_nop")
    private LocalDateTime thoiDiemNop;
}
