package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.TrangThaiPhieu;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "phieu_ho_tro")
@Getter
@Setter
@NoArgsConstructor
public class PhieuHoTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phieu_id")
    private Long phieuId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_tao_id", nullable = false)
    private NguoiDung nguoiDungTao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_lien_quan_id")
    private NguoiDung nguoiDungLienQuan;

    @Column(name = "loai_yeu_cau", nullable = false, length = 100)
    private String loaiYeuCau = "RESET_MAT_KHAU";

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_xu_ly_id")
    private NguoiDung adminXuLy;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiPhieu trangThai;

    @Column(name = "ghi_chu_xu_ly", columnDefinition = "TEXT")
    private String ghiChuXuLy;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime ngayTao;

    @Column(name = "ngay_xu_ly")
    private LocalDateTime ngayXuLy;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
    }
}
