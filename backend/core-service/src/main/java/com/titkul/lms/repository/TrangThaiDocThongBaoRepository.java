package com.titkul.lms.repository;

import com.titkul.lms.entity.TrangThaiDocThongBao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrangThaiDocThongBaoRepository extends JpaRepository<TrangThaiDocThongBao, Long> {
    Optional<TrangThaiDocThongBao> findByUser_NguoiDungIdAndThongBao_ThongBaoId(Long userId, Long thongBaoId);

    List<TrangThaiDocThongBao> findByUser_NguoiDungId(Long userId);
}
