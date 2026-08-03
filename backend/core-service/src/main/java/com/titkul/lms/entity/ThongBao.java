package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

// 1 dòng = 1 thông báo đăng cho cả lớp (hoặc toàn trường nếu classRoom=null) —
// trạng thái đọc riêng của từng người nằm ở bảng TrangThaiDocThongBao.
@Entity
@Table(name = "thong_bao")
@Data
@NoArgsConstructor
public class ThongBao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thong_bao_id")
    private Long thongBaoId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_gui_id", nullable = false)
    private NguoiDung sender;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_id")
    private LopHoc classRoom;

    @Column(name = "tieu_de", nullable = false, length = 300)
    private String tieuDe;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "file_dinh_kem", length = 500)
    private String fileDinhKem;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_thong_bao", nullable = false, length = 50)
    private LoaiThongBao loaiThongBao = LoaiThongBao.NOI_BO;

    @Column(name = "la_ghim", nullable = false)
    private boolean laGhim = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "doi_tuong_nhan", nullable = false, length = 20)
    private DoiTuongNhanThongBao doiTuongNhan = DoiTuongNhanThongBao.TAT_CA;

    @Column(name = "ngay_dang", nullable = false)
    private LocalDateTime ngayDang = LocalDateTime.now();
}
