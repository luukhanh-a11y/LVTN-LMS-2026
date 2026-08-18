package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.BaiNop;
import com.LMS.LVTN.enums.TrangThaiBaiNop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface BaiNopRepository extends JpaRepository<BaiNop, Long> {
    List<BaiNop> findByBaiTap_BaiTapId(Long baiTapId);
    List<BaiNop> findByHocSinh_HocSinhId(Long hocSinhId);
    List<BaiNop> findByHocSinh_HocSinhIdIn(List<Long> hocSinhIds);

    long countByTrangThaiAndBaiTap_GiaoVien_GiaoVienId(TrangThaiBaiNop trangThai, Long giaoVienId);

    interface DemChoChamTheoLop {
        Long getLopHocId();
        Long getSoLuong();
    }

    // Đếm số bài chờ chấm, gộp theo từng lớp GV đang dạy — 1 query duy nhất, không ghi thêm dữ liệu.
    @Query("SELECT b.baiTap.lopHoc.lopHocId AS lopHocId, COUNT(b) AS soLuong FROM BaiNop b " +
           "WHERE b.trangThai = :trangThai AND b.baiTap.giaoVien.giaoVienId = :giaoVienId " +
           "GROUP BY b.baiTap.lopHoc.lopHocId")
    List<DemChoChamTheoLop> demChoChamTheoLop(@Param("trangThai") TrangThaiBaiNop trangThai, @Param("giaoVienId") Long giaoVienId);

    // Đếm số học sinh (distinct) đã nộp bài tập, không tính trùng khi học sinh nộp lại nhiều lần
    @Query("SELECT COUNT(DISTINCT b.hocSinh.hocSinhId) FROM BaiNop b WHERE b.baiTap.baiTapId = :baiTapId")
    long countDistinctHocSinhByBaiTapId(@Param("baiTapId") Long baiTapId);

    long countByHocSinh_HocSinhId(Long hocSinhId);
    long countByHocSinh_HocSinhIdAndLaNopTreFalse(Long hocSinhId);
    long countByBaiTap_BaiTapIdAndHocSinh_HocSinhId(Long baiTapId, Long hocSinhId);
    // Cùng cách đếm với demChoChamTheoLop (COUNT bản ghi bai_nop, không distinct học sinh) —
    // để số hiện trên từng thẻ bài tập cộng lại đúng khớp con số badge tổng của cả lớp.
    long countByBaiTap_BaiTapIdAndTrangThai(Long baiTapId, TrangThaiBaiNop trangThai);
    List<BaiNop> findByBaiTap_BaiTapIdAndHocSinh_LopHoc_LopHocId(Long baiTapId, Long lopHocId);
    List<BaiNop> findByBaiTap_BaiTapIdAndHocSinh_HocSinhId(Long baiTapId, Long hocSinhId);

    // BaiTap không có cột môn học trực tiếp (giống lý do đã ghi ở BaiTapRepository) — môn suy ra
    // từ dạng bài đính kèm, qua 1 trong 2 đường: dangBai gắn thẳng trên BaiTap (đường cũ) hoặc
    // qua ChiTietBaiTap (đường bài tự luận tự do / nhiều câu hỏi đang dùng). Thiếu đường thứ 2 là
    // lý do bài tự luận tự do được chấm rồi mà điểm trung bình môn vẫn không nhích — bài nộp tồn
    // tại nhưng không match được với môn nào nên bị loại khỏi AVG. Tách 2 query rồi gộp ở Java
    // (không LEFT JOIN + OR gộp chung) — cùng cách BaiTapRepository đã áp dụng, tránh lỗi Hibernate
    // dịch sai case này luôn ra 0 kết quả.
    @Query("SELECT b FROM BaiNop b " +
           "WHERE b.hocSinh.hocSinhId = :hocSinhId " +
           "AND b.trangThai = com.LMS.LVTN.enums.TrangThaiBaiNop.DA_CHAM " +
           "AND b.baiTap.dangBai.baiHoc.chuDe.sach.maMon = :maMon " +
           "AND b.baiTap.hocKy.hocKyId = :hocKyId")
    List<BaiNop> findDaChamLegacyDangBaiTheoMonAndHocKy(@Param("hocSinhId") Long hocSinhId, @Param("maMon") String maMon, @Param("hocKyId") Integer hocKyId);

    @Query("SELECT DISTINCT b FROM BaiNop b " +
           "WHERE b.hocSinh.hocSinhId = :hocSinhId " +
           "AND b.trangThai = com.LMS.LVTN.enums.TrangThaiBaiNop.DA_CHAM " +
           "AND b.baiTap.hocKy.hocKyId = :hocKyId " +
           "AND b.baiTap.baiTapId IN (SELECT ct.baiTap.baiTapId FROM ChiTietBaiTap ct WHERE ct.dangBai.baiHoc.chuDe.sach.maMon = :maMon)")
    List<BaiNop> findDaChamChiTietDangBaiTheoMonAndHocKy(@Param("hocSinhId") Long hocSinhId, @Param("maMon") String maMon, @Param("hocKyId") Integer hocKyId);

    // Tính điểm trung bình của bài tập học sinh làm theo môn trong 1 học kỳ (lấy điểm từ đánh giá thủ công của GV hoặc điểm tự động)
    default Optional<Double> tinhDiemTrungBinhBaiTapTheoMonAndHocKy(Long hocSinhId, String maMon, Integer hocKyId) {
        Map<Long, BaiNop> combined = new LinkedHashMap<>();
        for (BaiNop b : findDaChamLegacyDangBaiTheoMonAndHocKy(hocSinhId, maMon, hocKyId)) combined.put(b.getBaiNopId(), b);
        for (BaiNop b : findDaChamChiTietDangBaiTheoMonAndHocKy(hocSinhId, maMon, hocKyId)) combined.put(b.getBaiNopId(), b);

        double sum = 0;
        int count = 0;
        for (BaiNop b : combined.values()) {
            BigDecimal diem = (b.getDanhGiaBaiLam() != null && b.getDanhGiaBaiLam().getDiemSo() != null)
                    ? b.getDanhGiaBaiLam().getDiemSo() : b.getDiemTuDong();
            if (diem != null) {
                sum += diem.doubleValue();
                count++;
            }
        }
        return count > 0 ? Optional.of(sum / count) : Optional.empty();
    }
}
