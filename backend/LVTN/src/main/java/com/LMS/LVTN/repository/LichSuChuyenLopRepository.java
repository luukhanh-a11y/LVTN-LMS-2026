package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.LichSuChuyenLop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuChuyenLopRepository extends JpaRepository<LichSuChuyenLop, Long> {
    List<LichSuChuyenLop> findByHocSinh_HocSinhId(Long hocSinhId);
    List<LichSuChuyenLop> findByNguoiThucHien_NguoiDungId(String nguoiThucHienId);
    boolean existsByHocSinh_HocSinhIdAndNamHocMoi(Long hocSinhId, String namHocMoi);
}
