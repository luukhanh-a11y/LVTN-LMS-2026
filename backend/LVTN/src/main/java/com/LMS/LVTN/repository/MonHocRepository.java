package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.MonHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonHocRepository extends JpaRepository<MonHoc, Integer> {
    boolean existsByMaMon(String maMon);
    
    java.util.Optional<MonHoc> findByMaMon(String maMon);
}
