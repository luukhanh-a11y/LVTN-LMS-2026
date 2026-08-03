package com.titkul.lms.repository;

import com.titkul.lms.entity.HoSoHocSinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HoSoHocSinhRepository extends JpaRepository<HoSoHocSinh, Long> {
    Optional<HoSoHocSinh> findByMaHocSinh(String maHocSinh);
    Optional<HoSoHocSinh> findByNguoiDung_NguoiDungId(Long nguoiDungId);
    java.util.List<HoSoHocSinh> findByPhuHuynh_PhuHuynhId(Long phuHuynhId);
    java.util.List<HoSoHocSinh> findByLopHoc_LopHocId(Long lopHocId);
    long countByLopHoc_LopHocId(Long lopHocId);
}
