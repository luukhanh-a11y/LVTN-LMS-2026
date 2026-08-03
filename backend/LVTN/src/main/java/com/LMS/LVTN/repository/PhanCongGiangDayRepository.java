package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.PhanCongGiangDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhanCongGiangDayRepository extends JpaRepository<PhanCongGiangDay, Long> {
    List<PhanCongGiangDay> findByGiaoVien_GiaoVienId(Long giaoVienId);
    List<PhanCongGiangDay> findByLopHoc_LopHocId(Long lopHocId);
}
