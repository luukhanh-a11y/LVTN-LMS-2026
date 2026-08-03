package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "phu_huynh_hoc_sinh", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"phu_huynh_id", "hoc_sinh_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhuHuynhHocSinh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lien_ket_id")
    private Long lienKetId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phu_huynh_id", nullable = false)
    private HoSoPhuHuynh phuHuynh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", nullable = false)
    private HoSoHocSinh hocSinh;

    @Column(name = "quan_he", length = 30)
    private String quanHe;

    @Column(name = "ngay_lien_ket", nullable = false, updatable = false)
    private LocalDateTime ngayLienKet = LocalDateTime.now();
}
