package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.PhieuHoTro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuHoTroRepository extends JpaRepository<PhieuHoTro, Long> {

    List<PhieuHoTro> findByNguoiDungLienQuan_NguoiDungId(String id);
    List<PhieuHoTro> findByNguoiDungTao_NguoiDungId(String id);
}
