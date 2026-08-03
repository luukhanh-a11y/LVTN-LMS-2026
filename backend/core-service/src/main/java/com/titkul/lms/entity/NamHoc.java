package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "nam_hoc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NamHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nam_hoc_id", columnDefinition = "INT UNSIGNED")
    private Integer namHocId;

    @Column(name = "ten_nam_hoc", nullable = false, length = 20, unique = true)
    private String tenNamHoc;

    @Column(name = "ngay_bat_dau")
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDate ngayKetThuc;
}
