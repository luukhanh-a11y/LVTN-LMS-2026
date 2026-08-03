package com.LMS.LVTN.entity;

import com.LMS.LVTN.enums.LoaiImport;
import com.LMS.LVTN.enums.TrangThaiImport;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "lo_import")
@Getter
@Setter
@NoArgsConstructor
public class LoImport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lo_id")
    private Long loId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_thuc_hien_id", nullable = false)
    private NguoiDung nguoiThucHien;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_import", nullable = false)
    private LoaiImport loaiImport;

    @Column(name = "ten_file", nullable = false, length = 255)
    private String tenFile;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiImport trangThai;

    @Column(name = "so_thanh_cong")
    private Integer soThanhCong;

    @Column(name = "chi_tiet_loi", columnDefinition = "json")
    private String chiTietLoi;

    @Column(name = "tom_tat_ket_qua", columnDefinition = "json")
    private String tomTatKetQua;

    @Column(name = "thoi_diem_import", nullable = false, updatable = false)
    private LocalDateTime thoiDiemImport;

    @PrePersist
    protected void onCreate() {
        thoiDiemImport = LocalDateTime.now();
    }
}
