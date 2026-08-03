package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.KetQuaCuoiNam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KetQuaCuoiNamRepository extends JpaRepository<KetQuaCuoiNam, Long> {
}
