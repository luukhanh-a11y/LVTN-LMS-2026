package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.BaiNop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaiNopRepository extends JpaRepository<BaiNop, Long> {
    List<BaiNop> findByBaiTap_BaiTapId(Long baiTapId);
    List<BaiNop> findByHocSinh_HocSinhId(Long hocSinhId);
    
    long countByHocSinh_HocSinhId(Long hocSinhId);
    long countByHocSinh_HocSinhIdAndLaNopTreFalse(Long hocSinhId);
}
