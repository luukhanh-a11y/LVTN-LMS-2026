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

    @Query("SELECT s FROM Sach s WHERE s.loaiSach = :loaiSach AND s.khoiLop = :khoiLop AND (s.hocKy.hocKyId = :hocKyId OR s.hocKy IS NULL)")
    List<Sach> findByLoaiSachAndKhoiLopAndHocKyIdOrNull(@Param("loaiSach") com.LMS.LVTN.enums.LoaiSach loaiSach, @Param("khoiLop") Short khoiLop, @Param("hocKyId") Integer hocKyId);

    @Query("SELECT s FROM Sach s WHERE s.loaiSach = :loaiSach AND s.khoiLop = :khoiLop AND s.maMon = :maMon AND (s.hocKy.hocKyId = :hocKyId OR s.hocKy IS NULL)")
    List<Sach> findByLoaiSachAndKhoiLopAndMaMonAndHocKyIdOrNull(@Param("loaiSach") com.LMS.LVTN.enums.LoaiSach loaiSach, @Param("khoiLop") Short khoiLop, @Param("maMon") String maMon, @Param("hocKyId") Integer hocKyId);

    @Query("SELECT s FROM Sach s WHERE s.maMon = :maMon AND s.khoiLop = :khoiLop AND (s.hocKy.hocKyId = :hocKyId OR s.hocKy IS NULL)")
    List<Sach> findByMaMonAndKhoiLopAndHocKyIdOrNull(@Param("maMon") String maMon, @Param("khoiLop") Short khoiLop, @Param("hocKyId") Integer hocKyId);

    @Query("SELECT s FROM Sach s WHERE (s.hocKy.hocKyId = :hocKyId OR s.hocKy IS NULL)")
    List<Sach> findByHocKyIdOrNull(@Param("hocKyId") Integer hocKyId);

    List<Sach> findByMaMon(String maMon);

    @Query("SELECT s FROM Sach s WHERE s.maMon = :maMon AND (s.hocKy.hocKyId = :hocKyId OR s.hocKy IS NULL)")
    List<Sach> findByMaMonAndHocKyIdOrNull(@Param("maMon") String maMon, @Param("hocKyId") Integer hocKyId);

    // Strict queries without NULL fallback
    List<Sach> findByHocKy_HocKyId(Integer hocKyId);
    List<Sach> findByMaMonAndHocKy_HocKyId(String maMon, Integer hocKyId);
    List<Sach> findByLoaiSachAndKhoiLopAndMaMonAndHocKy_HocKyId(com.LMS.LVTN.enums.LoaiSach loaiSach, Short khoiLop, String maMon, Integer hocKyId);
    List<Sach> findByLoaiSachAndKhoiLopAndHocKy_HocKyId(com.LMS.LVTN.enums.LoaiSach loaiSach, Short khoiLop, Integer hocKyId);
    
    @Query("SELECT s FROM Sach s WHERE s.hocKy.namHoc.namHocId = :namHocId")
    List<Sach> findByNamHocId(@Param("namHocId") Integer namHocId);
    
    @Query("SELECT s FROM Sach s WHERE s.maMon = :maMon AND s.hocKy.namHoc.namHocId = :namHocId")
    List<Sach> findByMaMonAndNamHocId(@Param("maMon") String maMon, @Param("namHocId") Integer namHocId);
}

