package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tien_do_hoc_sinh",
       uniqueConstraints = @UniqueConstraint(columnNames = {"hoc_sinh_id", "bai_hoc_id", "hoc_ky_id"}))
@Getter
@Setter
@NoArgsConstructor
public class TienDoHocSinh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tien_do_id")
    private Long tienDoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_sinh_id", nullable = false)
    private HoSoHocSinh hocSinh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_hoc_id", nullable = false)
    private BaiHoc baiHoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_ky_id", nullable = false)
    private HocKy hocKy;

    @Column(name = "phan_tram_hoan_thanh", nullable = false)
    private Short phanTramHoanThanh = 0;

    @Column(name = "thoi_gian_hoc", nullable = false)
    private Integer thoiGianHoc = 0;

    @Column(name = "lan_xem_cuoi")
    private LocalDateTime lanXemCuoi;

    @Column(name = "da_hoan_thanh", nullable = false)
    private Boolean daHoanThanh = false;
}
