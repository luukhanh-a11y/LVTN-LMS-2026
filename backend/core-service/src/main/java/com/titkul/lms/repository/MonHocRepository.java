package com.titkul.lms.repository;

import com.titkul.lms.entity.MonHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MonHocRepository extends JpaRepository<MonHoc, Integer> {
    Optional<MonHoc> findByTenMon(String tenMon);
}
