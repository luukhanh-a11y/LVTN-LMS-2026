package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.PhuHuynhHocSinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhuHuynhHocSinhRepository extends JpaRepository<PhuHuynhHocSinh, Long> {

    // Tìm tất cả học sinh của một phụ huynh thông qua ID (mã) hồ sơ phụ huynh
    List<PhuHuynhHocSinh> findByPhuHuynh_PhuHuynhId(Long phuHuynhId);

    // Tìm tất cả phụ huynh của một học sinh thông qua ID (mã) hồ sơ học sinh
    List<PhuHuynhHocSinh> findByHocSinh_HocSinhId(Long hocSinhId);

    // (Tùy chọn) Tìm tất cả phụ huynh thông qua mã chuỗi của học sinh (maHocSinh)
    List<PhuHuynhHocSinh> findByHocSinh_MaHocSinh(String maHocSinh);
}
