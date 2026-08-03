package com.titkul.lms.repository;

import com.titkul.lms.entity.PhieuHoTro;
import com.titkul.lms.entity.TrangThaiPhieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuHoTroRepository extends JpaRepository<PhieuHoTro, Long> {
    List<PhieuHoTro> findByTeacher_NguoiDungIdOrderByNgayTaoDesc(Long teacherId);
    List<PhieuHoTro> findByTrangThaiOrderByNgayTaoAsc(TrangThaiPhieu trangThai);
}
