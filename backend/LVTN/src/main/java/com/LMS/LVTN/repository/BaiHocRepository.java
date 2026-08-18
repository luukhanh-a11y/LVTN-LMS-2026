package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.BaiHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaiHocRepository extends JpaRepository<BaiHoc, Integer> {
    List<BaiHoc> findByChuDe_ChuDeId(Integer chuDeId);

    @Modifying
    @Query("DELETE FROM DangBai d WHERE d.baiHoc.baiHocId = :baiHocId")
    void deleteAllByBaiHocId(@Param("baiHocId") Integer baiHocId);

    @Modifying
    @Query("DELETE FROM BaiHoc b WHERE b.chuDe.sach.sachId = :sachId")
    void deleteAllBySachId(@Param("sachId") Integer sachId);
}
