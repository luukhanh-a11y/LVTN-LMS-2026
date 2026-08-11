package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.LoaiSach;
import com.LMS.LVTN.enums.TrangThaiMonHoc;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sach")
@Getter
@Setter
@NoArgsConstructor
public class Sach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sach_id")
    private Integer sachId;

    @Column(name = "book_id_ngoai", unique = true)
    private Integer bookIdNgoai;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_sach", nullable = false)
    private LoaiSach loaiSach;

    @Column(name = "bo_sach", nullable = false, length = 150)
    private String boSach;

    @Column(name = "khoi_lop", nullable = false)
    private Short khoiLop;

    @Column(name = "ma_mon", length = 20, nullable = false)
    private String maMon;

    // NULL = sách dùng chung mọi năm học có cùng số học kỳ (mặc định).
    // Có giá trị = bản đã tách riêng cho đúng 1 học kỳ của 1 năm học cụ thể (qua Nhân bản).
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_ky_id")
    private HocKy hocKy;

    @Column(name = "ten_sach", nullable = false, length = 300)
    private String tenSach;

    @Column(name = "slug", length = 300)
    private String slug;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "anh_bia_url", length = 500)
    private String anhBiaUrl;

    @Column(name = "tong_so_trang")
    private Short tongSoTrang;

    @Column(name = "nam_xuat_ban")
    private Short namXuatBan;

    @Column(name = "ban_quyen", length = 200)
    private String banQuyen;

    @Column(name = "ban_bien_soan", columnDefinition = "json")
    private String banBienSoan;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiMonHoc trangThai;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime ngayTao;

    @Column(name = "ngay_cap_nhat", nullable = false)
    private LocalDateTime ngayCapNhat;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "sach", fetch = FetchType.LAZY)
    private List<ChuDe> chuDes = new ArrayList<>();

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
