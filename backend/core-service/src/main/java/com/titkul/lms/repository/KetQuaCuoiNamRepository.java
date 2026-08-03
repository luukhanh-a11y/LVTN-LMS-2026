package com.titkul.lms.repository;

import com.titkul.lms.entity.KetQuaCuoiNam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KetQuaCuoiNamRepository extends JpaRepository<KetQuaCuoiNam, Long> {
    List<KetQuaCuoiNam> findByLopHoc_LopHocId(Long lopHocId);

    Optional<KetQuaCuoiNam> findByHocSinh_HocSinhIdAndLopHoc_LopHocIdAndNamHoc(Long hocSinhId, Long lopHocId, String namHoc);

    List<KetQuaCuoiNam> findByHocSinh_HocSinhIdOrderByNgayXetDesc(Long hocSinhId);

    List<KetQuaCuoiNam> findByNamHoc(String namHoc);

    List<KetQuaCuoiNam> findByNamHocAndLopHoc_KhoiLop(String namHoc, Short khoiLop);
}
