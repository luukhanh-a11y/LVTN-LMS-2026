package com.titkul.lms.repository;

import com.titkul.lms.entity.PhienXacThuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhienXacThucRepository extends JpaRepository<PhienXacThuc, Long> {
}
