package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.DangBai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DangBaiRepository extends JpaRepository<DangBai, Integer> {
    List<DangBai> findByBaiHoc_BaiHocId(Integer baiHocId);
    int countByBaiHoc_BaiHocId(Integer baiHocId);

    @Query("SELECT CASE WHEN (d.baiHoc.chuDe.sach.loaiSach = com.LMS.LVTN.enums.LoaiSach.SACH_GIAO_KHOA) THEN true ELSE false END " +
            "FROM DangBai d WHERE d.dangBaiId = :dangBaiId")
    boolean isSachGiaoKhoa(@Param("dangBaiId") Integer dangBaiId);

    List<DangBai> findByBaiHoc_BaiHocIdAndNguonGoc(Integer baiHocId, com.LMS.LVTN.enums.NguonGoc nguonGoc);
}

