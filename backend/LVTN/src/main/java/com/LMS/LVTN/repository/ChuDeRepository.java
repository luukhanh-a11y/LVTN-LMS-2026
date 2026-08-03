package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.ChuDe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChuDeRepository extends JpaRepository<ChuDe, Integer> {
    List<ChuDe> findBySach_SachId(Integer sachId);

    @Modifying
    @Query("DELETE FROM BaiHoc b WHERE b.chuDe.chuDeId = :chuDeId")
    void deleteAllByChuDeId(@Param("chuDeId") Integer chuDeId);
}
