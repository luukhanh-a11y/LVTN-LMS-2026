package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.TienDoHocSinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TienDoHocSinhRepository extends JpaRepository<TienDoHocSinh, Long> {
    java.util.Optional<TienDoHocSinh> findByHocSinh_HocSinhIdAndBaiHoc_BaiHocId(Long hocSinhId, Integer baiHocId);
}
