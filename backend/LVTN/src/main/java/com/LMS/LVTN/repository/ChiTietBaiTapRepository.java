package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.ChiTietBaiTap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietBaiTapRepository extends JpaRepository<ChiTietBaiTap, Long> {
    List<ChiTietBaiTap> findByBaiTap_BaiTapIdOrderByThuTuAsc(Long baiTapId);
    List<ChiTietBaiTap> findByDangBai_DangBaiId(Integer dangBaiId);
    void deleteByBaiTap_BaiTapId(Long baiTapId);
}
