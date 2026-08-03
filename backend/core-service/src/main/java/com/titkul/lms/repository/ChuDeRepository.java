package com.titkul.lms.repository;

import com.titkul.lms.entity.ChuDe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChuDeRepository extends JpaRepository<ChuDe, Integer> {
}
