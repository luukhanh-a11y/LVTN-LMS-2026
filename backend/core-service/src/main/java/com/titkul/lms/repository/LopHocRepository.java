package com.titkul.lms.repository;

import com.titkul.lms.entity.LopHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LopHocRepository extends JpaRepository<LopHoc, Long> {
    java.util.Optional<LopHoc> findByTenLop(String tenLop);
    boolean existsByTenLopAndNamHoc(String tenLop, com.titkul.lms.entity.NamHoc namHoc);
    java.util.List<LopHoc> findByGiaoVienChuNhiem_GiaoVienId(Long giaoVienId);
    long countByTrangThai(com.titkul.lms.entity.TrangThaiLopHoc trangThai);
}
