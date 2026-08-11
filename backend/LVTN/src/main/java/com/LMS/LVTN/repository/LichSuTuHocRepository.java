package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.LichSuTuHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface LichSuTuHocRepository extends JpaRepository<LichSuTuHoc, Long> {
    List<LichSuTuHoc> findByHocSinh_HocSinhId(Long hocSinhId);
    List<LichSuTuHoc> findByDangBai_DangBaiId(Integer dangBaiId);
    List<LichSuTuHoc> findByHocSinh_HocSinhIdAndDangBai_DangBaiId(Long hocSinhId, Integer dangBaiId);
    List<LichSuTuHoc> findByHocSinh_MaHocSinh(String maHocSinh);

    boolean existsByHocSinh_HocSinhIdAndDangBai_DangBaiId(Long hocSinhId, Integer dangBaiId);

    // Trường B: Đếm số lượng dạng bài KHÁC NHAU mà học sinh đã hoàn thành trong bài học
    @Query("SELECT COUNT(DISTINCT l.dangBai.dangBaiId) FROM LichSuTuHoc l WHERE l.hocSinh.hocSinhId = :hocSinhId AND l.dangBai.baiHoc.baiHocId = :baiHocId")
    int countDistinctDangBaiByHocSinhAndBaiHoc(@Param("hocSinhId") Long hocSinhId, @Param("baiHocId") Integer baiHocId);

    // Tính điểm trung bình lịch sử tự học của một học sinh trong một bài học
    @Query("SELECT AVG(l.diemSo) FROM LichSuTuHoc l WHERE l.hocSinh.hocSinhId = :hocSinhId AND l.dangBai.baiHoc.baiHocId = :baiHocId")
    Optional<BigDecimal> tinhDiemTrungBinhTuHocTrongBaiHoc(@Param("hocSinhId") Long hocSinhId, @Param("baiHocId") Integer baiHocId);

    // Tính điểm trung bình của bài học học sinh tự làm theo môn trong 1 học kỳ
    @Query("SELECT AVG(l.diemSo) FROM LichSuTuHoc l " +
           "WHERE l.hocSinh.hocSinhId = :hocSinhId " +
           "AND l.dangBai.baiHoc.chuDe.sach.maMon = :maMon " +
           "AND (l.dangBai.baiHoc.chuDe.sach.hocKy.soHocKy = :hocKy OR l.dangBai.baiHoc.chuDe.sach.hocKy IS NULL OR l.dangBai.baiHoc.chuDe.sach.hocKy.soHocKy = 0)")
    Optional<BigDecimal> tinhDiemTrungBinhTuHocTheoMonAndHocKy(@Param("hocSinhId") Long hocSinhId, @Param("maMon") String maMon, @Param("hocKy") Short hocKy);
}
