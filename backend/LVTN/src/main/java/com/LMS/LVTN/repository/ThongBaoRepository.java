package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.HopThuThongBao;
import com.LMS.LVTN.entity.ThongBao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongBaoRepository extends JpaRepository<ThongBao, Long> {
    List<HopThuThongBao> findByThongBao_LaGhimDescThongBao_NgayDangDesc();

    List<HopThuThongBao> findByThongBao_LaGhimFalseOrderByThongBao_NgayDangDesc();
}
