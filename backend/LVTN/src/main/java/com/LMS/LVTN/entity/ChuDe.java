package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chu_de")
@Getter
@Setter
@NoArgsConstructor
public class ChuDe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chu_de_id")
    private Integer chuDeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sach_id", nullable = false)
    private Sach sach;

    @Column(name = "book_index_id_ngoai")
    private Integer bookIndexIdNgoai;

    @Column(name = "ten_chu_de", nullable = false, length = 300)
    private String tenChuDe;

    @Column(name = "tieu_de", length = 100)
    private String tieuDe;

    @Column(name = "slug", length = 300)
    private String slug;

    @Column(name = "so_trang")
    private Short soTrang;

    @Column(name = "so_thu_tu", nullable = false)
    private Short soThuTu = 0;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime ngayTao;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "chuDe", fetch = FetchType.LAZY)
    private List<BaiHoc> baiHocs = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
    }
}
