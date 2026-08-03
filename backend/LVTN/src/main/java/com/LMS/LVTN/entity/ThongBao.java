package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.LoaiThongBao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "thong_bao")
@Getter
@Setter
@NoArgsConstructor
public class ThongBao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thong_bao_id")
    private Long thongBaoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_gui_id", nullable = false)
    private NguoiDung nguoiGui;

    @Column(name = "tieu_de", nullable = false, length = 300)
    private String tieuDe;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "file_dinh_kem", length = 500)
    private String fileDinhKem;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_thong_bao", nullable = false)
    private LoaiThongBao loaiThongBao;

    @Column(name = "la_ghim", nullable = false)
    private Boolean laGhim = false;

    @Column(name = "ngay_dang", nullable = false, updatable = false)
    private LocalDateTime ngayDang;

    @PrePersist
    protected void onCreate() {
        ngayDang = LocalDateTime.now();
    }
}
