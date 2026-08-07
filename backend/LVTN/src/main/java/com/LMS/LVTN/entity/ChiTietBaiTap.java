package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chi_tiet_bai_tap")
@Getter
@Setter
@NoArgsConstructor
public class ChiTietBaiTap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_tap_id", nullable = false)
    private BaiTap baiTap;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dang_bai_id", nullable = false)
    private DangBai dangBai;

    @Column(name = "thu_tu", nullable = false)
    private Integer thuTu = 1;

    @Column(name = "che_do_giao_dien", length = 50)
    private String cheDoGiaoDien = "MAC_DINH";
}
