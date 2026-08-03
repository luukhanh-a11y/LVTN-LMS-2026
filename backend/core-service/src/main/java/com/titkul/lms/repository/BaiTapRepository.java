package com.titkul.lms.repository;

import com.titkul.lms.entity.BaiTap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaiTapRepository extends JpaRepository<BaiTap, Long> {
    @EntityGraph(attributePaths = {"giaoVien", "lopHoc"})
    Page<BaiTap> findByLopHoc_LopHocId(Long classRoomId, Pageable pageable);

    long countByGiaoVien_GiaoVienId(Long teacherId);

    List<BaiTap> findByLopHoc_LopHocIdIn(List<Long> classRoomIds);
    List<BaiTap> findByLopHoc_LopHocIdInOrderByDeadlineAsc(List<Long> classRoomIds);
}
