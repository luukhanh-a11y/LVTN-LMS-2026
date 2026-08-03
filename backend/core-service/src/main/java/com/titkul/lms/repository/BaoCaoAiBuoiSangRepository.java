package com.titkul.lms.repository;

import com.titkul.lms.entity.BaoCaoAiBuoiSang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface BaoCaoAiBuoiSangRepository extends JpaRepository<BaoCaoAiBuoiSang, Long> {
    Optional<BaoCaoAiBuoiSang> findByTeacher_GiaoVienIdAndClassRoom_LopHocIdAndNgayBaoCao(Long teacherId, Long classRoomId, LocalDate ngayBaoCao);
}
