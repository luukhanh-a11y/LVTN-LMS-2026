package com.titkul.lms.repository;

import com.titkul.lms.entity.HocKy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HocKyRepository extends JpaRepository<HocKy, Integer> {
    Optional<HocKy> findTopByOrderByHocKyIdDesc();
}
