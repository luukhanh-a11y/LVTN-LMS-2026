package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Trạng thái đọc độc lập cho từng người — HS xem không ảnh hưởng PH.
@Entity
@Table(name = "trang_thai_doc_thong_bao")
@Data
@NoArgsConstructor
public class TrangThaiDocThongBao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trang_thai_id")
    private Long trangThaiId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private NguoiDung user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thong_bao_id", nullable = false)
    private ThongBao thongBao;

    @Column(name = "da_doc", nullable = false)
    private boolean daDoc = false;

    @Column(name = "thoi_diem_doc")
    private LocalDateTime thoiDiemDoc;
}
