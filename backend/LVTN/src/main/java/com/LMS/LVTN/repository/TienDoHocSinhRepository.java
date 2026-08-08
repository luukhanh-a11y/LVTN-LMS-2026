package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.TienDoHocSinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TienDoHocSinhRepository extends JpaRepository<TienDoHocSinh, Long> {
    java.util.Optional<TienDoHocSinh> findByHocSinh_HocSinhIdAndBaiHoc_BaiHocId(Long hocSinhId, Integer baiHocId);
    java.util.List<TienDoHocSinh> findByHocSinh_HocSinhIdIn(java.util.List<Long> hocSinhIds);

    // Tiến độ phải tính riêng theo từng học kỳ — học sinh ở lại lớp học lại 1 bài học
    // ở học kỳ/năm học khác thì không được kế thừa tiến độ cũ (xem TienDoHocSinhService).
    java.util.Optional<TienDoHocSinh> findByHocSinh_HocSinhIdAndBaiHoc_BaiHocIdAndHocKy_HocKyId(
            Long hocSinhId, Integer baiHocId, Integer hocKyId);
}
