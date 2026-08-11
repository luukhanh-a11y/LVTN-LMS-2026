package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.HoSoGiaoVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HoSoGiaoVienRepository extends JpaRepository<HoSoGiaoVien, Long> {
    boolean existsByNguoiDung_NguoiDungId(String nguoiDungId);

    HoSoGiaoVien findByMaGiaoVien(String maGiaoVien);

    Optional<HoSoGiaoVien> findByNguoiDung_NguoiDungId(String nguoiDungId);
    boolean existsByMaGiaoVien(String maGiaoVien);
}
