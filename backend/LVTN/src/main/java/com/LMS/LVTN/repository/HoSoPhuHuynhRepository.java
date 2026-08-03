package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.HoSoPhuHuynh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HoSoPhuHuynhRepository extends JpaRepository<HoSoPhuHuynh, Long> {
    boolean existsByNguoiDung_NguoiDungId(String nguoiDungId);
}
