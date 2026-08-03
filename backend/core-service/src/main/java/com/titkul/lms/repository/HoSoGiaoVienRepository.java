package com.titkul.lms.repository;

import com.titkul.lms.entity.HoSoGiaoVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HoSoGiaoVienRepository extends JpaRepository<HoSoGiaoVien, Long> {
    java.util.Optional<HoSoGiaoVien> findByNguoiDung_NguoiDungId(Long nguoiDungId);

    java.util.List<HoSoGiaoVien> findByMaGiaoVienStartingWith(String prefix);
}
