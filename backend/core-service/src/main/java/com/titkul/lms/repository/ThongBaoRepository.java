package com.titkul.lms.repository;

import com.titkul.lms.entity.ThongBao;
import com.titkul.lms.entity.DoiTuongNhanThongBao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ThongBaoRepository extends JpaRepository<ThongBao, Long> {
    // classRoom IS NULL = thông báo hệ thống toàn trường, luôn hiện cho mọi lớp
    @Query("SELECT n FROM ThongBao n WHERE (n.classRoom.lopHocId = :classRoomId OR n.classRoom IS NULL) AND n.doiTuongNhan IN :audiences ORDER BY n.ngayDang DESC")
    List<ThongBao> findVisibleToClass(@Param("classRoomId") Long classRoomId, @Param("audiences") Collection<DoiTuongNhanThongBao> audiences);

    @Query("SELECT n FROM ThongBao n WHERE n.classRoom IS NULL AND n.doiTuongNhan IN :audiences ORDER BY n.ngayDang DESC")
    List<ThongBao> findGlobalOnly(@Param("audiences") Collection<DoiTuongNhanThongBao> audiences);

    List<ThongBao> findBySender_NguoiDungIdOrderByNgayDangDesc(Long senderId);
}
