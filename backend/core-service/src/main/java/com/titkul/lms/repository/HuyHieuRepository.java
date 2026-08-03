package com.titkul.lms.repository;

import com.titkul.lms.entity.HuyHieu;
import com.titkul.lms.entity.LoaiHuyHieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HuyHieuRepository extends JpaRepository<HuyHieu, Integer> {
    List<HuyHieu> findByLoai(LoaiHuyHieu loai);
}
