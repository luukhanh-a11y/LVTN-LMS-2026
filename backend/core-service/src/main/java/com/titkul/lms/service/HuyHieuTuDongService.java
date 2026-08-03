package com.titkul.lms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

// Huy hiệu tự động (Tuần 8, rule-based) — quét dieu_kien (JSON) của các huy_hieu loai=TU_DONG
// đã seed sẵn trong DB (Siêu Sao/Chăm Chỉ/Toán Giỏi/Nhà Thám Hiểm/Tiến Bộ Vượt Bậc) và tự động
// trao khi học sinh đạt điều kiện. Gọi từ các điểm chạm nộp bài/xem bài giảng — không dùng
// @Scheduled vì quy mô học sinh nhỏ, kiểm tra ngay sau sự kiện là đủ.
@Slf4j
@Service
@RequiredArgsConstructor
public class HuyHieuTuDongService {

    private final HuyHieuRepository huyHieuRepository;
    private final KhenThuongHocSinhRepository khenThuongHocSinhRepository;
    private final HoSoHocSinhRepository studentProfileRepository;
    private final BaiNopRepository submissionRepository;
    private final StudentProgressRepository studentProgressRepository;
    private final DangBaiRepository contentNodeRepository;
    private final MonHocRepository subjectRepository;
    private final ObjectMapper objectMapper;
    private final EmailService emailService;

    @Transactional
    public void kiemTraVaTraoHuyHieu(Long hocSinhId) {
        HoSoHocSinh student = studentProfileRepository.findById(hocSinhId).orElse(null);
        if (student == null) return;

        for (HuyHieu huyHieu : huyHieuRepository.findByLoai(LoaiHuyHieu.TU_DONG)) {
            if (khenThuongHocSinhRepository.existsByHocSinh_HocSinhIdAndHuyHieu_HuyHieuId(hocSinhId, huyHieu.getHuyHieuId())) {
                continue; // đã có rồi
            }
            try {
                if (datDieuKien(student, huyHieu.getDieuKien())) {
                    traoHuyHieu(student, huyHieu);
                }
            } catch (Exception e) {
                log.warn("Lỗi xét huy hiệu tự động '{}' cho học sinh {}: {}", huyHieu.getTenHuyHieu(), hocSinhId, e.getMessage());
            }
        }
    }

    private boolean datDieuKien(HoSoHocSinh student, String dieuKienJson) throws Exception {
        if (dieuKienJson == null || dieuKienJson.isBlank()) return false;
        JsonNode dieuKien = objectMapper.readTree(dieuKienJson);
        String loai = dieuKien.path("loai").asText();

        return switch (loai) {
            case "DIEM_CAO" -> kiemTraDiemCao(student, dieuKien);
            case "NOP_DUNG_HAN" -> kiemTraNopDungHan(student, dieuKien);
            case "HOAN_THANH_MON" -> kiemTraHoanThanhMon(student, dieuKien);
            case "XEM_BAI_GIANG" -> kiemTraXemBaiGiang(student, dieuKien);
            case "TANG_DIEM" -> kiemTraTangDiem(student, dieuKien);
            default -> {
                log.warn("Không rõ kiểu điều kiện huy hiệu: {}", loai);
                yield false;
            }
        };
    }

    // N bài gần nhất (có điểm tự động) đều đạt >= diem
    private boolean kiemTraDiemCao(HoSoHocSinh student, JsonNode dieuKien) {
        BigDecimal diemToiThieu = BigDecimal.valueOf(dieuKien.path("diem").asDouble());
        int soBaiLienTiep = dieuKien.path("so_bai_lien_tiep").asInt();
        if (soBaiLienTiep <= 0) return false;

        List<BaiNop> baiGanNhat = submissionRepository.findByHocSinh_HocSinhIdAndDiemTuDongIsNotNullOrderByThoiDiemNopDesc(
                student.getHocSinhId(), PageRequest.of(0, soBaiLienTiep));
        if (baiGanNhat.size() < soBaiLienTiep) return false;
        return baiGanNhat.stream().allMatch(b -> b.getDiemTuDong().compareTo(diemToiThieu) >= 0);
    }

    // Tổng số bài nộp đúng hạn >= so_bai (không cần liên tiếp)
    private boolean kiemTraNopDungHan(HoSoHocSinh student, JsonNode dieuKien) {
        int soBai = dieuKien.path("so_bai").asInt();
        if (soBai <= 0) return false;
        return submissionRepository.countByHocSinh_HocSinhIdAndLaNopTreFalse(student.getHocSinhId()) >= soBai;
    }

    // Hoàn thành 100% dang_bai của 1 môn học (theo khối lớp học sinh)
    private boolean kiemTraHoanThanhMon(HoSoHocSinh student, JsonNode dieuKien) {
        String tenMon = dieuKien.path("mon").asText();
        if (tenMon.isBlank() || student.getLopHoc() == null || student.getLopHoc().getKhoiLop() == null) return false;

        MonHoc monHoc = subjectRepository.findByTenMon(tenMon).orElse(null);
        if (monHoc == null) return false;

        List<DangBai> danhSachBai = contentNodeRepository.findBySubjectAndGradeOrdered(
                monHoc.getMonHocId(), student.getLopHoc().getKhoiLop().intValue());
        if (danhSachBai.isEmpty()) return false;

        long soDaHoanThanh = studentProgressRepository.countByStudent_HocSinhIdAndContentNode_MonHoc_MonHocIdAndCompletedTrue(
                student.getHocSinhId(), monHoc.getMonHocId());
        return soDaHoanThanh >= danhSachBai.size();
    }

    // Tổng số bài giảng đã xem (mọi môn) >= so_luong
    private boolean kiemTraXemBaiGiang(HoSoHocSinh student, JsonNode dieuKien) {
        int soLuong = dieuKien.path("so_luong").asInt();
        if (soLuong <= 0) return false;
        long soDaXem = studentProgressRepository.findByStudent_HocSinhId(student.getHocSinhId()).stream()
                .filter(p -> Boolean.TRUE.equals(p.getCompleted()))
                .count();
        return soDaXem >= soLuong;
    }

    // Điểm bài gần nhất tăng >= tang_toi_thieu so với bài liền trước (chỉ áp dụng bài có điểm tự động)
    private boolean kiemTraTangDiem(HoSoHocSinh student, JsonNode dieuKien) {
        BigDecimal tangToiThieu = BigDecimal.valueOf(dieuKien.path("tang_toi_thieu").asDouble());
        List<BaiNop> haiBaiGanNhat = submissionRepository.findByHocSinh_HocSinhIdAndDiemTuDongIsNotNullOrderByThoiDiemNopDesc(
                student.getHocSinhId(), PageRequest.of(0, 2));
        if (haiBaiGanNhat.size() < 2) return false;
        BigDecimal moiNhat = haiBaiGanNhat.get(0).getDiemTuDong();
        BigDecimal lienTruoc = haiBaiGanNhat.get(1).getDiemTuDong();
        return moiNhat.subtract(lienTruoc).compareTo(tangToiThieu) >= 0;
    }

    private void traoHuyHieu(HoSoHocSinh student, HuyHieu huyHieu) {
        String noiDung = "Hệ thống tự động trao huy hiệu vì đạt thành tích: " + huyHieu.getTenHuyHieu()
                + (huyHieu.getMoTa() != null ? " — " + huyHieu.getMoTa() : "");

        boolean emailSent = false;
        if (student.getPhuHuynh() != null && student.getPhuHuynh().getEmailNhanThongBao() != null
                && !student.getPhuHuynh().getEmailNhanThongBao().isBlank()) {
            try {
                emailService.sendSimpleEmail(student.getPhuHuynh().getEmailNhanThongBao(),
                        "Titkul LMS - Con bạn vừa nhận được huy hiệu mới!", noiDung);
                emailSent = true;
            } catch (Exception e) {
                // Không chặn việc trao thưởng nếu gửi email thất bại, nhưng vẫn phải log để chẩn đoán được
                log.warn("Gửi email thông báo huy hiệu '{}' cho học sinh {} thất bại: {}",
                        huyHieu.getTenHuyHieu(), student.getHocSinhId(), e.getMessage());
            }
        }

        KhenThuongHocSinh khenThuong = KhenThuongHocSinh.builder()
                .hocSinh(student)
                .huyHieu(huyHieu)
                .giaoVien(null)
                .thuKhen(noiDung)
                .nguonCap(NguonCap.HE_THONG)
                .daGuiEmail(emailSent)
                .build();
        khenThuongHocSinhRepository.save(khenThuong);
        log.info("Đã tự động trao huy hiệu '{}' cho học sinh {}", huyHieu.getTenHuyHieu(), student.getHocSinhId());
    }
}
