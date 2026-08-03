package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "sach")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sach_id", columnDefinition = "INT UNSIGNED")
    private Integer sachId;

    @Column(name = "book_id_ngoai")
    private Integer bookIdNgoai;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_sach", nullable = false)
    private LoaiSach loaiSach = LoaiSach.SACH_GIAO_KHOA;

    @Column(name = "bo_sach", nullable = false, length = 150)
    private String boSach;

    @Column(name = "khoi_lop", nullable = false)
    private Integer khoiLop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mon_hoc_id", nullable = false)
    private MonHoc monHoc;

    @Column(name = "hoc_ky")
    private Integer hocKy;

    @Column(name = "ten_sach", nullable = false, length = 300)
    private String tenSach;

    @Column(name = "slug", length = 300)
    private String slug;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "anh_bia_url", length = 500)
    private String anhBiaUrl;

    @Column(name = "tong_so_trang")
    private Integer tongSoTrang;

    @Column(name = "nam_xuat_ban")
    private Integer namXuatBan;

    @Column(name = "ban_quyen", length = 200)
    private String banQuyen;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "ban_bien_soan")
    private String banBienSoan;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiSach trangThai = TrangThaiSach.ACTIVE;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Column(name = "ngay_cap_nhat", nullable = false)
    private LocalDateTime ngayCapNhat = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
        ngayCapNhat = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        ngayCapNhat = LocalDateTime.now();
    }
}
