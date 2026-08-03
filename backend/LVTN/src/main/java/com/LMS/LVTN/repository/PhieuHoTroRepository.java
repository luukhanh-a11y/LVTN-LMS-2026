package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.PhieuHoTro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuHoTroRepository extends JpaRepository<PhieuHoTro, Long> {

    List<PhieuHoTro> findByNguoiDungLienQuan_NguoiDungid(String id);
    List<PhieuHoTro> findByNguoiDungTao_NguoiDungid(String id);
}
