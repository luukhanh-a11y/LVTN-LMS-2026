package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.HuyHieu;
import com.LMS.LVTN.enums.LoaiHuyHieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HuyHieuRepository extends JpaRepository<HuyHieu, Integer> {
    List<HuyHieu> findByLoai(LoaiHuyHieu loai);
}
