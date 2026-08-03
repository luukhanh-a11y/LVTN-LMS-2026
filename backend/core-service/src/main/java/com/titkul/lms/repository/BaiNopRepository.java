package com.titkul.lms.repository;

import com.titkul.lms.entity.BaiNop;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaiNopRepository extends JpaRepository<BaiNop, Long> {
    List<BaiNop> findByBaiTap_BaiTapId(Long assignmentId);
    List<BaiNop> findByHocSinh_HocSinhId(Long studentId);
    List<BaiNop> findByBaiTap_BaiTapIdAndHocSinh_HocSinhId(Long assignmentId, Long studentId);
    List<BaiNop> findByHocSinh_HocSinhIdIn(List<Long> studentIds);
    long countByHocSinh_HocSinhIdAndLaNopTreFalse(Long studentId);
    List<BaiNop> findByHocSinh_HocSinhIdAndDiemTuDongIsNotNullOrderByThoiDiemNopDesc(Long studentId, Pageable pageable);
}
