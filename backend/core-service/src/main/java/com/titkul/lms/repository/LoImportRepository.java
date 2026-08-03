package com.titkul.lms.repository;

import com.titkul.lms.entity.LoImport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoImportRepository extends JpaRepository<LoImport, Long> {
}
