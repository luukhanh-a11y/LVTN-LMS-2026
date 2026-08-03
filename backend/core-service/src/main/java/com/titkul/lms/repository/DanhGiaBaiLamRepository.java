package com.titkul.lms.repository;

import com.titkul.lms.entity.DanhGiaBaiLam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface DanhGiaBaiLamRepository extends JpaRepository<DanhGiaBaiLam, Long> {
    List<DanhGiaBaiLam> findByBaiNop_HocSinh_HocSinhIdOrderByThoiDiemChamDesc(Long studentId, Pageable pageable);
    List<DanhGiaBaiLam> findByBaiNop_HocSinh_HocSinhIdInOrderByThoiDiemChamDesc(List<Long> studentIds, Pageable pageable);
    List<DanhGiaBaiLam> findByBaiNop_HocSinh_HocSinhIdInOrderByThoiDiemChamDesc(List<Long> studentIds);
    Optional<DanhGiaBaiLam> findByBaiNop_BaiNopId(Long submissionId);
}
