package com.titkul.lms.repository;

import com.titkul.lms.entity.PhienDangNhap;
import com.titkul.lms.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhienDangNhapRepository extends JpaRepository<PhienDangNhap, Long> {
    void deleteByNguoiDung(NguoiDung nguoiDung);
}
