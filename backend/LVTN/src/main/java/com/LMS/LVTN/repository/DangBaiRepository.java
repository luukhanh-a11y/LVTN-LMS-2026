package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.DangBai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DangBaiRepository extends JpaRepository<DangBai, Integer> {
    List<DangBai> findByBaiHoc_BaiHocId(Integer baiHocId);
    int countByBaiHoc_BaiHocId(Integer baiHocId);

    Optional<DangBai> findByH5pNoiDungId(String h5pNoiDungId);

    @Query("SELECT CASE WHEN (d.baiHoc.chuDe.sach.loaiSach = com.LMS.LVTN.enums.LoaiSach.SACH_GIAO_KHOA) THEN true ELSE false END " +
            "FROM DangBai d WHERE d.dangBaiId = :dangBaiId")
    boolean isSachGiaoKhoa(@Param("dangBaiId") Integer dangBaiId);

    List<DangBai> findByBaiHoc_BaiHocIdAndNguonGoc(Integer baiHocId, com.LMS.LVTN.enums.NguonGoc nguonGoc);

    List<DangBai> findByNguonGocAndGiaoVien_GiaoVienId(com.LMS.LVTN.enums.NguonGoc nguonGoc, Long giaoVienId);

    List<DangBai> findByNguonGoc(com.LMS.LVTN.enums.NguonGoc nguonGoc);

    // Xoá dạng bài theo chuỗi quan hệ ChuDe/Sach — dùng khi xoá cả 1 chương/sách, phải xoá
    // hết dạng bài bên dưới các bài học TRƯỚC KHI xoá bài học, nếu không sẽ vi phạm khoá
    // ngoại dang_bai.bai_hoc_id (NO ACTION, không có ON DELETE CASCADE ở DB).
    @Modifying
    @Query("DELETE FROM DangBai d WHERE d.baiHoc.chuDe.chuDeId = :chuDeId")
    void deleteAllByChuDeId(@Param("chuDeId") Integer chuDeId);

    @Modifying
    @Query("DELETE FROM DangBai d WHERE d.baiHoc.chuDe.sach.sachId = :sachId")
    void deleteAllBySachId(@Param("sachId") Integer sachId);
}

