package com.titkul.lms.repository;

import com.titkul.lms.entity.PhanCongGiangDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhanCongGiangDayRepository extends JpaRepository<PhanCongGiangDay, Long> {
}
