package com.titkul.lms.repository;

import com.titkul.lms.entity.BaiHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BaiHocRepository extends JpaRepository<BaiHoc, Integer> {
}
