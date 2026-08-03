package com.titkul.lms.repository;

import com.titkul.lms.entity.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {
    Optional<StudentProgress> findByStudent_HocSinhIdAndContentNode_DangBaiId(Long studentId, Integer contentNodeId);

    List<StudentProgress> findByStudent_HocSinhId(Long studentId);

    List<StudentProgress> findByStudent_HocSinhIdIn(List<Long> studentIds);

    List<StudentProgress> findByStudent_HocSinhIdAndContentNode_MonHoc_MonHocId(Long studentId, Integer subjectId);

    long countByStudent_HocSinhIdAndContentNode_MonHoc_MonHocIdAndCompletedTrue(Long studentId, Integer subjectId);
}
