package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.LoImport;
import com.LMS.LVTN.enums.LoaiImport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoImportRepository extends JpaRepository<LoImport, Long> {

    List<LoImport> findAllByOrderByThoiDiemImportDesc();
    List<LoImport> findByLoaiImportOrderByThoiDiemImportDesc(LoaiImport loaiImport);
}

