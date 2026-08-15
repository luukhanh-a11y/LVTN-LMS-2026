package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.BaiTap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaiTapRepository extends JpaRepository<BaiTap, Long> {
    List<BaiTap> findByLopHoc_LopHocId(Long lopHocId);
    List<BaiTap> findByGiaoVien_GiaoVienId(Long giaoVienId);
    List<BaiTap> findByDangBai_DangBaiId(Integer dangBaiId);
    List<BaiTap> findByLopHoc_LopHocIdAndGiaoVien_GiaoVienIdAndHocKy_HocKyId(Long lopHocId, Long giaoVienId, Integer hocKyId);
}
