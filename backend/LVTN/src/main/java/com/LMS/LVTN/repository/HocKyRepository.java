package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.HocKy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HocKyRepository extends JpaRepository<HocKy, Integer> {
    java.util.Optional<HocKy> findByNamHoc_NamHocIdAndSoHocKy(Integer namHocId, Short soHocKy);
    java.util.List<HocKy> findByNamHoc_NamHocId(Integer namHocId);
}
