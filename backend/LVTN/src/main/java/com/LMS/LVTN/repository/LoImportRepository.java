package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.LoImport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoImportRepository extends JpaRepository<LoImport, Long> {
}
