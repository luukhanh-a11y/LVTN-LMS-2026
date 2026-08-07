package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.KetQuaCuoiNam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KetQuaCuoiNamRepository extends JpaRepository<KetQuaCuoiNam, Long> {
    Optional<KetQuaCuoiNam> findByHocSinh_HocSinhIdAndNamHoc(Long hocSinhId, String namHoc);
}
