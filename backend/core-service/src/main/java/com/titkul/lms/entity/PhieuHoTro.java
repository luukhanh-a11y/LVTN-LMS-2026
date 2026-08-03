package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "phieu_ho_tro")
public class PhieuHoTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phieu_id")
    private Long phieuId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_tao_id", nullable = false)
    private NguoiDung teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_lien_quan_id", nullable = false)
    private NguoiDung student;

    @Column(name = "loai_yeu_cau", nullable = false, length = 100)
    private String loaiYeuCau;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_xu_ly_id")
    private NguoiDung admin;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiPhieu trangThai = TrangThaiPhieu.CHO_DUYET;

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
