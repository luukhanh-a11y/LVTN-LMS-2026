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

    List<Sach> findByHocKy_HocKyId(Integer hocKyId);

    List<Sach> findByMaMon(String maMon);

    @Query("SELECT s FROM Sach s WHERE s.maMon = :maMon AND (s.hocKy.hocKyId = :hocKyId OR s.hocKy IS NULL)")
    List<Sach> findByMaMonAndHocKyIdOrNull(@Param("maMon") String maMon, @Param("hocKyId") Integer hocKyId);
}

