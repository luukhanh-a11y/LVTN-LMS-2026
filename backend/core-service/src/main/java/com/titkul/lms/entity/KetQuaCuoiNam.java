package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "ket_qua_cuoi_nam",
       uniqueConstraints = @UniqueConstraint(columnNames = {"hoc_sinh_id", "lop_hoc_id", "nam_hoc"}))
@Data
@NoArgsConstructor
public class KetQuaCuoiNam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ket_qua_id")
    private Long ketQuaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", nullable = false)
    private HoSoHocSinh hocSinh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id", nullable = false)
    private LopHoc lopHoc;

    @Column(name = "nam_hoc", nullable = false, length = 10)
    private String namHoc;

    @Enumerated(EnumType.STRING)
    @Column(name = "ket_qua_hoc_tap", nullable = false)
    private XepLoai ketQuaHocTap;

    @Enumerated(EnumType.STRING)
    @Column(name = "ket_qua_ren_luyen", nullable = false)
    private KetQuaRenLuyen ketQuaRenLuyen;

    @Enumerated(EnumType.STRING)
    @Column(name = "quyet_dinh", nullable = false)
    private QuyetDinhCuoiNam quyetDinh;

    @Column(name = "duoc_xet_dac_cach", nullable = false)
    private Boolean duocXetDacCach = false;

    @Column(name = "ly_do_dac_cach", columnDefinition = "TEXT")
    private String lyDoDacCach;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_xet_id", nullable = false)
    private HoSoGiaoVien giaoVienXet;

    @Column(name = "ngay_xet", nullable = false)
    private LocalDate ngayXet;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;
}
