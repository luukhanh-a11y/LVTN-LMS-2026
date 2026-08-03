package com.titkul.lms.repository;

import com.titkul.lms.entity.LichSuChuyenLop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuChuyenLopRepository extends JpaRepository<LichSuChuyenLop, Long> {
    List<LichSuChuyenLop> findByStudent_HocSinhIdOrderByThoiDiemChuyenDesc(Long studentId);
}
