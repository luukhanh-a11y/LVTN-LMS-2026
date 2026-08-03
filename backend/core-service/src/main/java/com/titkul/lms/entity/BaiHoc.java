package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bai_hoc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaiHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bai_hoc_id", columnDefinition = "INT UNSIGNED")
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
    private Integer soTrang;

    @Column(name = "so_thu_tu", nullable = false)
    private Integer soThuTu = 0;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();
}
