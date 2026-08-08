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

    // Nhóm "dùng chung" — chỉ lấy sách CHƯA tách riêng cho năm học nào (hocKyCuThe IS NULL),
    // tránh lẫn với bản đã nhân bản riêng cho 1 năm cụ thể (có thể trùng số học kỳ).
    @Query("SELECT s FROM Sach s WHERE s.loaiSach = :loaiSach AND s.khoiLop = :khoiLop AND (s.hocKy = :hocKy OR s.hocKy IS NULL OR s.hocKy = 0) AND s.hocKyCuThe IS NULL")
    List<Sach> findByLoaiSachAndKhoiLopAndHocKy(@Param("loaiSach") com.LMS.LVTN.enums.LoaiSach loaiSach, @Param("khoiLop") Short khoiLop, @Param("hocKy") Short hocKy);

    @Query("SELECT s FROM Sach s WHERE s.loaiSach = :loaiSach AND s.khoiLop = :khoiLop AND s.monHoc.monHocId = :monHocId AND (s.hocKy = :hocKy OR s.hocKy IS NULL OR s.hocKy = 0) AND s.hocKyCuThe IS NULL")
    List<Sach> findByLoaiSachAndKhoiLopAndMonHocAndHocKy(@Param("loaiSach") com.LMS.LVTN.enums.LoaiSach loaiSach, @Param("khoiLop") Short khoiLop, @Param("monHocId") Integer monHocId, @Param("hocKy") Short hocKy);

    @Query("SELECT s FROM Sach s WHERE s.monHoc.monHocId = :monHocId AND s.khoiLop = :khoiLop AND (s.hocKy = :hocKyCu OR (:hocKyCu IS NULL AND (s.hocKy IS NULL OR s.hocKy = 0))) AND s.hocKyCuThe IS NULL")
    List<Sach> findByMonHocAndKhoiLopAndHocKy(@Param("monHocId") Short monHocId, @Param("khoiLop") Short khoiLop, @Param("hocKyCu") Short hocKyCu);

    // Nhóm "đã tách riêng" — tra chính xác theo hocKyId (thuộc đúng 1 năm học cụ thể).
    List<Sach> findByLoaiSachAndKhoiLopAndHocKyCuThe_HocKyId(com.LMS.LVTN.enums.LoaiSach loaiSach, Short khoiLop, Integer hocKyId);

    List<Sach> findByLoaiSachAndKhoiLopAndMonHoc_MonHocIdAndHocKyCuThe_HocKyId(com.LMS.LVTN.enums.LoaiSach loaiSach, Short khoiLop, Integer monHocId, Integer hocKyId);

    List<Sach> findByMonHoc_MonHocIdAndKhoiLopAndHocKyCuThe_HocKyId(Short monHocId, Short khoiLop, Integer hocKyId);
}

