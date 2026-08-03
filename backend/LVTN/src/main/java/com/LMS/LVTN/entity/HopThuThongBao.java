package com.LMS.LVTN.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "hop_thu_thong_bao",
       uniqueConstraints = @UniqueConstraint(columnNames = {"nguoi_dung_id", "thong_bao_id"}))
@Getter
@Setter
@NoArgsConstructor
public class HopThuThongBao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hop_thu_id")
    private Long hopThuId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thong_bao_id", nullable = false)
    private ThongBao thongBao;

    @Column(name = "da_doc", nullable = false)
    private Boolean daDoc = false;

    @Column(name = "thoi_diem_doc")
    private LocalDateTime thoiDiemDoc;
}

