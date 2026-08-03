package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.LichSuTuHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuTuHocRepository extends JpaRepository<LichSuTuHoc, Long> {
    List<LichSuTuHoc> findByHocSinh_HocSinhId(Long hocSinhId);
    List<LichSuTuHoc> findByDangBai_DangBaiId(Integer dangBaiId);
    List<LichSuTuHoc> findByHocSinh_HocSinhIdAndDangBai_DangBaiId(Long hocSinhId, Integer dangBaiId);
    List<LichSuTuHoc> findByHocSinh_MaHocSinh(String maHocSinh);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT l.dangBai.dangBaiId) FROM LichSuTuHoc l WHERE l.hocSinh.hocSinhId = :hocSinhId AND l.dangBai.baiHoc.baiHocId = :baiHocId")
    int countDistinctDangBaiByHocSinhAndBaiHoc(@org.springframework.data.repository.query.Param("hocSinhId") Long hocSinhId, @org.springframework.data.repository.query.Param("baiHocId") Integer baiHocId);
}
