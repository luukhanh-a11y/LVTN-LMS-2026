package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.DangBai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DangBaiRepository extends JpaRepository<DangBai, Integer> {
    List<DangBai> findByBaiHoc_BaiHocId(Integer baiHocId);
    int countByBaiHoc_BaiHocId(Integer baiHocId);


}
