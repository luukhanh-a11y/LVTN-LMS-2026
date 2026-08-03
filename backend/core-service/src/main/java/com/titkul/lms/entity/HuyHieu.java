package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "huy_hieu")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HuyHieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "huy_hieu_id", columnDefinition = "INT UNSIGNED")
    private Integer huyHieuId;

    @Column(name = "ten_huy_hieu", nullable = false, length = 100, unique = true)
    private String tenHuyHieu;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "icon_url", length = 500)
    private String iconUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai", nullable = false)
    private LoaiHuyHieu loai;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dieu_kien")
    private String dieuKien;
}
