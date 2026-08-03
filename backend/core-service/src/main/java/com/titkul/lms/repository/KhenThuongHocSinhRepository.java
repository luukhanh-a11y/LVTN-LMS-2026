package com.titkul.lms.repository;

import com.titkul.lms.entity.KhenThuongHocSinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhenThuongHocSinhRepository extends JpaRepository<KhenThuongHocSinh, Long> {
    List<KhenThuongHocSinh> findByHocSinh_HocSinhIdOrderByThoiDiemTraoDesc(Long hocSinhId);
    boolean existsByHocSinh_HocSinhIdAndHuyHieu_HuyHieuId(Long hocSinhId, Integer huyHieuId);
}
