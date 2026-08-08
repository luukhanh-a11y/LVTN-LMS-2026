package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.TrangThaiGoiY;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

// Gợi ý nhận xét chấm bài (QT10.3) — sinh bằng Gemma3 thật qua Ollama local
// (xem GoiYAiNhanXetService/OllamaClient), lưu lại để giáo viên chọn dùng.
@Entity
@Table(name = "goi_y_ai_nhan_xet")
@Getter
@Setter
@NoArgsConstructor
public class GoiYAiNhanXet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goi_y_id")
    private Long goiYId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bai_nop_id", nullable = false)
    private BaiNop baiNop;

    @Column(name = "du_lieu_dau_vao", nullable = false, columnDefinition = "json")
    private String duLieuDauVao;

    @Column(name = "ket_qua_goi_y", columnDefinition = "json")
    private String ketQuaGoiY;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiGoiY trangThai = TrangThaiGoiY.NHAP;

    @Column(name = "thoi_diem_goi", nullable = false)
    private LocalDateTime thoiDiemGoi = LocalDateTime.now();
}
