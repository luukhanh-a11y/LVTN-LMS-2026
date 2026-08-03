package com.titkul.lms.repository;

import com.titkul.lms.entity.DangBai;
import com.titkul.lms.entity.MonHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DangBaiRepository extends JpaRepository<DangBai, Integer> {
    @Query("SELECT DISTINCT db.monHoc FROM DangBai db WHERE db.baiHoc.chuDe.sach.khoiLop = :grade")
    List<MonHoc> findDistinctSubjectsByGrade(@Param("grade") Integer grade);

    @Query("SELECT db FROM DangBai db WHERE db.monHoc.monHocId = :subjectId AND db.baiHoc.chuDe.sach.khoiLop = :grade " +
           "ORDER BY db.baiHoc.chuDe.sach.hocKy, db.baiHoc.chuDe.sach.sachId, db.baiHoc.chuDe.soThuTu, db.baiHoc.soThuTu, db.soThuTu")
    List<DangBai> findBySubjectAndGradeOrdered(@Param("subjectId") Integer subjectId, @Param("grade") Integer grade);

    @Query("SELECT db FROM DangBai db WHERE db.loaiNoiDung = 'JSON_TEXT' AND db.nguonGoc = 'HE_THONG' " +
           "ORDER BY db.baiHoc.chuDe.sach.khoiLop, db.monHoc.monHocId, db.baiHoc.chuDe.sach.hocKy, db.baiHoc.chuDe.sach.sachId, db.baiHoc.chuDe.soThuTu, db.baiHoc.soThuTu, db.soThuTu")
    List<DangBai> findAllBoSachOrdered();

    @Query("SELECT db FROM DangBai db WHERE db.baiHoc.baiHocId = :baiHocId ORDER BY db.soThuTu")
    List<DangBai> findByBaiHocIdOrdered(@Param("baiHocId") Integer baiHocId);
}
