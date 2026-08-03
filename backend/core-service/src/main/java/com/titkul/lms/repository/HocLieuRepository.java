package com.titkul.lms.repository;

import com.titkul.lms.entity.HocLieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HocLieuRepository extends JpaRepository<HocLieu, Long> {
    Optional<HocLieu> findByH5pContentId(String h5pContentId);

    List<HocLieu> findByTeacher_NguoiDung_NguoiDungId(Long userId);
}
