package com.LMS.LVTN.repository;

import com.LMS.LVTN.dto.response.HoSoHocSinhResponse;
import com.LMS.LVTN.entity.HoSoHocSinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoSoHocSinhRepository extends JpaRepository<HoSoHocSinh, Long> {

    HoSoHocSinh findByMaHocSinh(String maHocSinh);
    boolean existsByNguoiDung_NguoiDungId(String nguoiDungId);
    List<HoSoHocSinh> findByLopHoc_LopHocId(Long lopHocId);
}
