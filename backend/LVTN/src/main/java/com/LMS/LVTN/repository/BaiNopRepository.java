package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.BaiNop;
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

    long countByHocSinh_HocSinhId(Long hocSinhId);
    long countByHocSinh_HocSinhIdAndLaNopTreFalse(Long hocSinhId);
    long countByBaiTap_BaiTapIdAndHocSinh_HocSinhId(Long baiTapId, Long hocSinhId);
    List<BaiNop> findByBaiTap_BaiTapIdAndHocSinh_LopHoc_LopHocId(Long baiTapId, Long lopHocId);

    // Tính điểm trung bình của bài tập học sinh làm theo môn trong 1 học kỳ (lấy điểm từ đánh giá thủ công của GV hoặc điểm tự động)
    @Query("SELECT AVG(COALESCE(b.danhGiaBaiLam.diemSo, b.diemTuDong)) FROM BaiNop b " +
           "WHERE b.hocSinh.hocSinhId = :hocSinhId " +
           "AND b.trangThai = com.LMS.LVTN.enums.TrangThaiBaiNop.DA_CHAM " +
           "AND b.baiTap.dangBai.baiHoc.chuDe.sach.maMon = :maMon " +
           "AND b.baiTap.hocKy.hocKyId = :hocKyId")
    Optional<Double> tinhDiemTrungBinhBaiTapTheoMonAndHocKy(@Param("hocSinhId") Long hocSinhId, @Param("maMon") String maMon, @Param("hocKyId") Integer hocKyId);
}
