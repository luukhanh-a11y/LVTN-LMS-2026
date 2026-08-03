package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "lo_import")
@Data
public class LoImport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lo_id")
    private Long loId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_thuc_hien_id")
    private NguoiDung nguoiThucHien;

    @Column(name = "loai_import")
    private String loaiImport;

    @Column(name = "ten_file")
    private String tenFile;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "so_thanh_cong")
    private Integer soThanhCong;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "chi_tiet_loi")
    private String chiTietLoi;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "tom_tat_ket_qua")
    private String tomTatKetQua;
}
