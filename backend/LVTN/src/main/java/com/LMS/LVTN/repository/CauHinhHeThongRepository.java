package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.CauHinhHeThong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CauHinhHeThongRepository extends JpaRepository<CauHinhHeThong, Short> {
}
