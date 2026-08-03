package com.titkul.lms.repository;

import com.titkul.lms.entity.PhuHuynhHocSinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhuHuynhHocSinhRepository extends JpaRepository<PhuHuynhHocSinh, Long> {
}
