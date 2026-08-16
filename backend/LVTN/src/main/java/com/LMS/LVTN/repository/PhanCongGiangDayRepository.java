package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.PhanCongGiangDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhanCongGiangDayRepository extends JpaRepository<PhanCongGiangDay, Long> {
    List<PhanCongGiangDay> findByGiaoVien_GiaoVienId(Long giaoVienId);
    List<PhanCongGiangDay> findByLopHoc_LopHocId(Long lopHocId);
    List<PhanCongGiangDay> findByLopHoc_LopHocIdAndHocKy_HocKyId(Long lopHocId, Integer hocKyId);
    List<PhanCongGiangDay> findByGiaoVien_GiaoVienIdAndHocKy_HocKyId(Long giaoVienId, Integer hocKyId);
    List<PhanCongGiangDay> findByHocKy_HocKyId(Integer hocKyId);
    Optional<PhanCongGiangDay> findByGiaoVien_GiaoVienIdAndLopHoc_LopHocIdAndMonHoc_MaMonAndHocKy_HocKyId(Long giaoVienId, Long lopHocId, String maMon, Integer hocKyId);
    Optional<PhanCongGiangDay> findByGiaoVien_GiaoVienIdAndLopHoc_LopHocIdAndMonHoc_MonHocIdAndHocKy_HocKyId(Long giaoVienId, Long lopHocId, Integer monHocId, Integer hocKyId);
}
