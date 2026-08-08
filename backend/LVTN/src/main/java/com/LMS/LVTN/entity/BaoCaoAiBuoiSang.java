package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

// QT14.1 (AI-01): tóm tắt tiến độ lớp học mỗi sáng, sinh bằng Gemma3 thật qua
// Ollama. UNIQUE(giao_vien_id, lop_hoc_id, ngay_bao_cao) trong DB đảm bảo mỗi
// GV/lớp chỉ gọi model 1 lần/ngày, các lần xem lại trong ngày đọc lại bản đã lưu.
@Entity
@Table(name = "bao_cao_ai_buoi_sang")
@Getter
@Setter
@NoArgsConstructor
public class BaoCaoAiBuoiSang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bao_cao_id")
    private Long baoCaoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giao_vien_id", nullable = false)
    private HoSoGiaoVien giaoVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id", nullable = false)
    private LopHoc lopHoc;

    @Column(name = "ngay_bao_cao", nullable = false)
    private LocalDate ngayBaoCao;

    @Column(name = "noi_dung_tom_tat", nullable = false, columnDefinition = "TEXT")
    private String noiDungTomTat;

    @Column(name = "du_lieu_phan_tich", columnDefinition = "json")
    private String duLieuPhanTich;

    @Column(name = "thoi_diem_tao", nullable = false)
    private LocalDateTime thoiDiemTao = LocalDateTime.now();
}
