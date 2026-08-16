package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.ThongBao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongBaoRepository extends JpaRepository<ThongBao, Long> {
    List<ThongBao> findAllByOrderByLaGhimDescNgayDangDesc();
    List<ThongBao> findByLaGhimTrueOrderByNgayDangDesc();
    List<ThongBao> findByLaGhimFalseOrderByNgayDangDesc();
    List<ThongBao> findByNguoiGui_NguoiDungIdOrderByNgayDangDesc(String nguoiGuiId);
    
    @Query("SELECT t FROM ThongBao t WHERE t.ngayDang >= :startDate AND t.ngayDang <= :endDate ORDER BY t.laGhim DESC, t.ngayDang DESC")
    List<ThongBao> findAllByDateRange(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate, @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate);
}
