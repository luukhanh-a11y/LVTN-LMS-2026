package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.LopHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface LopHocRepository extends JpaRepository<LopHoc, Long>, JpaSpecificationExecutor<LopHoc> {
    Page<LopHoc> findAll(Pageable pageable);
    java.util.List<LopHoc> findByNamHoc_TenNamHoc(String tenNamHoc);
    java.util.List<LopHoc> findByGiaoVienChuNhiem_GiaoVienId(Long giaoVienId);
    boolean existsByTenLop(String tenLop);
}
