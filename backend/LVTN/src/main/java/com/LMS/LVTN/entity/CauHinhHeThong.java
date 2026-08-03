package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cau_hinh_he_thong")
@Getter
@Setter
@NoArgsConstructor
public class CauHinhHeThong {

    @Id
    @Column(name = "cau_hinh_id")
    private Short cauHinhId = 1;

    @Column(name = "ten_truong", nullable = false, length = 200)
    private String tenTruong;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "dia_chi", columnDefinition = "TEXT")
    private String diaChi;

    @Column(name = "hotline", length = 20)
    private String hotline;

    @Column(name = "email_lien_he", length = 150)
    private String emailLienHe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoc_ky_hien_tai_id", nullable = false)
    private HocKy hocKyHienTai;
}
