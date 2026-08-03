package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "phien_xac_thuc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhienXacThuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "phien_id")
    private Long phienId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private NguoiDung nguoiDung;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_xac_thuc", nullable = false)
    private LoaiXacThuc loaiXacThuc;

    @Column(name = "ma_otp", length = 10)
    private String maOtp;

    @Column(name = "het_han", nullable = false)
    private LocalDateTime hetHan;

    @Column(name = "da_su_dung", nullable = false)
    private Boolean daSuDung = false;

    @Column(name = "thoi_diem_tao", nullable = false, updatable = false)
    private LocalDateTime thoiDiemTao = LocalDateTime.now();
}
