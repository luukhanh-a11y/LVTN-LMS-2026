package com.titkul.lms.repository;

import com.titkul.lms.entity.PhanPhoiDangBai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhanPhoiDangBaiRepository extends JpaRepository<PhanPhoiDangBai, Long> {
    List<PhanPhoiDangBai> findByLopHoc_LopHocId(Long classRoomId);
}
