package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.BaiNop;
import com.LMS.LVTN.enums.TrangThaiBaiNop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
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
    List<BaiNop> findByBaiTap_BaiTapIdAndHocSinh_LopHoc_LopHocId(Long baiTapId, Long lopHocId);
    List<BaiNop> findByBaiTap_BaiTapIdAndHocSinh_HocSinhId(Long baiTapId, Long hocSinhId);

    // Tính điểm trung bình của bài tập học sinh làm theo môn trong 1 học kỳ (lấy điểm từ đánh giá thủ công của GV hoặc điểm tự động)
    @Query("SELECT AVG(COALESCE(b.danhGiaBaiLam.diemSo, b.diemTuDong)) FROM BaiNop b " +
           "WHERE b.hocSinh.hocSinhId = :hocSinhId " +
           "AND b.trangThai = com.LMS.LVTN.enums.TrangThaiBaiNop.DA_CHAM " +
           "AND b.baiTap.dangBai.baiHoc.chuDe.sach.maMon = :maMon " +
           "AND b.baiTap.hocKy.hocKyId = :hocKyId")
    Optional<Double> tinhDiemTrungBinhBaiTapTheoMonAndHocKy(@Param("hocSinhId") Long hocSinhId, @Param("maMon") String maMon, @Param("hocKyId") Integer hocKyId);
}
