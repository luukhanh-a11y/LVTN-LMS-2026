package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.NamHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NamHocRepository extends JpaRepository<NamHoc, Integer> {

    boolean existsByTenNamHoc(String ten);
}
