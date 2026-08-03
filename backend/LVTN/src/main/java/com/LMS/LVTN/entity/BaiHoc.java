package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bai_hoc")
@Getter
@Setter
@NoArgsConstructor
public class BaiHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bai_hoc_id")
    private Integer baiHocId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chu_de_id", nullable = false)
    private ChuDe chuDe;

    @Column(name = "book_index_id_ngoai")
    private Integer bookIndexIdNgoai;

    @Column(name = "ten_bai_hoc", nullable = false, length = 300)
    private String tenBaiHoc;

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
    @OneToMany(mappedBy = "baiHoc", fetch = FetchType.LAZY)
    private List<DangBai> dangBais = new ArrayList<>();

    @OneToMany(mappedBy = "baiHoc", fetch = FetchType.LAZY)
    private List<TienDoHocSinh> tienDoHocSinhs = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
    }
}
