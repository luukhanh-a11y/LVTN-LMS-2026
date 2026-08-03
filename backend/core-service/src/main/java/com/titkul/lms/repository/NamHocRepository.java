package com.titkul.lms.repository;

import com.titkul.lms.entity.NamHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NamHocRepository extends JpaRepository<NamHoc, Integer> {
    java.util.Optional<NamHoc> findByTenNamHoc(String tenNamHoc);
}
