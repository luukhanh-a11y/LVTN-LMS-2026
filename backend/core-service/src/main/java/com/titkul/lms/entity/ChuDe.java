package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chu_de")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChuDe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chu_de_id", columnDefinition = "INT UNSIGNED")
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
    private Integer soTrang;

    @Column(name = "so_thu_tu", nullable = false)
    private Integer soThuTu = 0;

    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();
}
