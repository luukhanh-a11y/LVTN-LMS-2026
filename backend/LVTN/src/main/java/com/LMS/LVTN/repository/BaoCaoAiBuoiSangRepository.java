package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.BaoCaoAiBuoiSang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface BaoCaoAiBuoiSangRepository extends JpaRepository<BaoCaoAiBuoiSang, Long> {
    Optional<BaoCaoAiBuoiSang> findByGiaoVien_GiaoVienIdAndLopHoc_LopHocIdAndNgayBaoCao(
            Long giaoVienId, Long lopHocId, LocalDate ngayBaoCao);
}
