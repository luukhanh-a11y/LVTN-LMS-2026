package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.LoaiNoiDung;
import com.LMS.LVTN.enums.NguonGoc;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "dang_bai")
@Getter
@Setter
@NoArgsConstructor
public class DangBai {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dang_bai_id")
    private Integer dangBaiId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_hoc_id", nullable = false)
    private BaiHoc baiHoc;

    @Column(name = "book_index_id_ngoai")
    private Integer bookIndexIdNgoai;

    @Column(name = "ten_dang_bai", nullable = false, length = 200)
    private String tenDangBai;

    @Column(name = "slug", length = 200)
    private String slug;

    @Column(name = "so_trang")
    private Short soTrang;

    @Column(name = "so_thu_tu", nullable = false)
    private Short soThuTu = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_noi_dung", nullable = false)
    private LoaiNoiDung loaiNoiDung;

    @Enumerated(EnumType.STRING)
    @Column(name = "nguon_goc", nullable = false)
    private NguonGoc nguonGoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id")
    private HoSoGiaoVien giaoVien;

    @Column(name = "h5p_noi_dung_id", length = 36)
    private String h5pNoiDungId;

    @Column(name = "xp_thuong", nullable = false)
    private Short xpThuong = 0;

    @Column(name = "du_lieu_game", columnDefinition = "json")
    private String duLieuGame;

    @Column(name = "dap_an_chuan", columnDefinition = "json")
    private String dapAnChuan;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime ngayTao;

    // ── Quan hệ 1-N ──
    @OneToMany(mappedBy = "dangBai", fetch = FetchType.LAZY)
    private List<LichSuTuHoc> lichSuTuHocs = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
    }
}
