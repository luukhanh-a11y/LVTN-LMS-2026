package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.HopThuThongBao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HopThuThongBaoRepository extends JpaRepository<HopThuThongBao, Long> {
    Optional<HopThuThongBao> findByNguoiDung_NguoiDungIdAndThongBao_ThongBaoId(String nguoiDungId, Long thongBaoId);
    List<HopThuThongBao> findByNguoiDung_NguoiDungId(String nguoiDungId);
    
    List<HopThuThongBao> findByNguoiDung_NguoiDungIdOrderByThongBao_LaGhimDescThongBao_NgayDangDesc(String nguoiDungId);
    List<HopThuThongBao> findByNguoiDung_NguoiDungIdAndThongBao_LaGhimTrueOrderByThongBao_NgayDangDesc(String nguoiDungId);
    List<HopThuThongBao> findByNguoiDung_NguoiDungIdAndThongBao_LaGhimFalseOrderByThongBao_NgayDangDesc(String nguoiDungId);
}

