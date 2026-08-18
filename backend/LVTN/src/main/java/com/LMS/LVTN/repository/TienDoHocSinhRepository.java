package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.TienDoHocSinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TienDoHocSinhRepository extends JpaRepository<TienDoHocSinh, Long> {
    java.util.Optional<TienDoHocSinh> findByHocSinh_HocSinhIdAndBaiHoc_BaiHocId(Long hocSinhId, Integer baiHocId);
    java.util.List<TienDoHocSinh> findByHocSinh_HocSinhIdIn(java.util.List<Long> hocSinhIds);
    boolean existsByBaiHoc_ChuDe_Sach_SachId(Integer sachId);

    // Tiến độ phải tính riêng theo từng học kỳ — học sinh ở lại lớp học lại 1 bài học
    // ở học kỳ/năm học khác thì không được kế thừa tiến độ cũ (xem TienDoHocSinhService).
    java.util.Optional<TienDoHocSinh> findByHocSinh_HocSinhIdAndBaiHoc_BaiHocIdAndHocKy_HocKyId(
            Long hocSinhId, Integer baiHocId, Integer hocKyId);

    @org.springframework.data.jpa.repository.Query("SELECT AVG(t.phanTramHoanThanh) FROM TienDoHocSinh t WHERE t.hocSinh.hocSinhId = :hocSinhId AND t.baiHoc.chuDe.sach.maMon = :maMon AND t.hocKy.hocKyId = :hocKyId")
    Double getAverageProgressByStudentAndSubject(@org.springframework.data.repository.query.Param("hocSinhId") Long hocSinhId, @org.springframework.data.repository.query.Param("maMon") String maMon, @org.springframework.data.repository.query.Param("hocKyId") Integer hocKyId);

    // Lấy 5 bài học gần nhất để hiển thị lên Dashboard Phụ huynh
    java.util.List<TienDoHocSinh> findTop5ByHocSinh_HocSinhIdOrderByLanXemCuoiDesc(Long hocSinhId);
}
