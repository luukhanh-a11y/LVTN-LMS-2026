package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.LichSuChuyenLop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LichSuChuyenLopRepository extends JpaRepository<LichSuChuyenLop, Long> {
}
