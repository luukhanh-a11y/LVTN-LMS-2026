package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mon_hoc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mon_hoc_id", columnDefinition = "TINYINT UNSIGNED")
    private Integer monHocId;

    @Column(name = "ten_mon", nullable = false, length = 100, unique = true)
    private String tenMon;

    @Column(name = "ma_mon", length = 20)
    private String maMon;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiMonHoc trangThai = TrangThaiMonHoc.ACTIVE;
}
