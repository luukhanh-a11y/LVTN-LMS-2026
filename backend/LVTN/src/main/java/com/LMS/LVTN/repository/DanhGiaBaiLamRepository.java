package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.DanhGiaBaiLam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;

@Repository
public interface DanhGiaBaiLamRepository extends JpaRepository<DanhGiaBaiLam, Long> {
    Optional<DanhGiaBaiLam> findByBaiNop_BaiNopId(Long baiNopId);
    List<DanhGiaBaiLam> findByGiaoVien_GiaoVienId(Long giaoVienId);
    
    long countByBaiNop_HocSinh_HocSinhIdAndDiemSoGreaterThanEqual(Long hocSinhId, BigDecimal diemSo);
}
