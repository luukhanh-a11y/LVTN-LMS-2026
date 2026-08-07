package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.Sach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SachRepository extends JpaRepository<Sach, Integer> {

    @Modifying
    @Query("DELETE FROM ChuDe s WHERE s.sach.sachId = :sachId")
    void deleteAllBySachId(@Param("sachId") Integer sachId);

    @Query("SELECT s FROM Sach s WHERE s.loaiSach = :loaiSach AND s.khoiLop = :khoiLop AND (s.hocKy = :hocKy OR s.hocKy IS NULL OR s.hocKy = 0)")
    List<Sach> findByLoaiSachAndKhoiLopAndHocKy(@Param("loaiSach") com.LMS.LVTN.enums.LoaiSach loaiSach, @Param("khoiLop") Short khoiLop, @Param("hocKy") Short hocKy);

    @Query("SELECT s FROM Sach s WHERE s.loaiSach = :loaiSach AND s.khoiLop = :khoiLop AND s.monHoc.monHocId = :monHocId AND (s.hocKy = :hocKy OR s.hocKy IS NULL OR s.hocKy = 0)")
    List<Sach> findByLoaiSachAndKhoiLopAndMonHocAndHocKy(@Param("loaiSach") com.LMS.LVTN.enums.LoaiSach loaiSach, @Param("khoiLop") Short khoiLop, @Param("monHocId") Integer monHocId, @Param("hocKy") Short hocKy);

    @Query("SELECT s FROM Sach s WHERE s.monHoc.monHocId = :monHocId AND s.khoiLop = :khoiLop AND (s.hocKy = :hocKyCu OR (:hocKyCu IS NULL AND (s.hocKy IS NULL OR s.hocKy = 0)))")
    List<Sach> findByMonHocAndKhoiLopAndHocKy(@Param("monHocId") Short monHocId, @Param("khoiLop") Short khoiLop, @Param("hocKyCu") Short hocKyCu);
}

