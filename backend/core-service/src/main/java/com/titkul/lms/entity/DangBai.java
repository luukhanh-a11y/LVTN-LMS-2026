package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "dang_bai")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DangBai {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dang_bai_id", columnDefinition = "INT UNSIGNED")
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
    private Integer soTrang;

    @Column(name = "so_thu_tu", nullable = false)
    private Integer soThuTu = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mon_hoc_id", nullable = false)
    private MonHoc monHoc;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_noi_dung", nullable = false)
    private LoaiNoiDung loaiNoiDung = LoaiNoiDung.JSON_TEXT;

    @Enumerated(EnumType.STRING)
    @Column(name = "nguon_goc", nullable = false)
    private NguonGoc nguonGoc = NguonGoc.HE_THONG;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id")
    private HoSoGiaoVien giaoVien;

    @Column(name = "h5p_noi_dung_id", length = 36)
    private String h5pNoiDungId;

    @Column(name = "xp_thuong", nullable = false)
    private Integer xpThuong = 0;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "cau_hinh")
    private String cauHinh;

    // Đáp án chuẩn cho bài tập bộ sách kiểu JSON_TEXT (trắc nghiệm/nối cặp/điền khuyết) —
    // tách riêng khỏi cauHinh để không bao giờ lộ cho học sinh qua endpoint public.
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dap_an_chuan")
    private String dapAnChuan;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();
}
