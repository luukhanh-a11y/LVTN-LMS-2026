package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lich_su_chuyen_lop")
@Data
@NoArgsConstructor
public class LichSuChuyenLop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chuyen_lop_id")
    private Long chuyenLopId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", nullable = false)
    private HoSoHocSinh student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_cu_id")
    private LopHoc lopCu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_moi_id", nullable = false)
    private LopHoc lopMoi;

    @Column(name = "nam_hoc_cu", length = 10)
    private String namHocCu;

    @Column(name = "nam_hoc_moi", nullable = false, length = 10)
    private String namHocMoi;

    @Enumerated(EnumType.STRING)
    @Column(name = "ly_do", nullable = false)
    private LyDoChuyenLop lyDo = LyDoChuyenLop.DOI_LOP;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_thuc_hien_id", nullable = false)
    private NguoiDung nguoiThucHien;

    @Column(name = "thoi_diem_chuyen", nullable = false, updatable = false)
    private LocalDateTime thoiDiemChuyen = LocalDateTime.now();
}
