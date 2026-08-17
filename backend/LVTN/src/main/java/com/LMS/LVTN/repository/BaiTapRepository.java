package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.BaiTap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public interface BaiTapRepository extends JpaRepository<BaiTap, Long> {
    List<BaiTap> findByLopHoc_LopHocId(Long lopHocId);
    List<BaiTap> findByGiaoVien_GiaoVienId(Long giaoVienId);
    List<BaiTap> findByDangBai_DangBaiId(Integer dangBaiId);
    List<BaiTap> findByLopHoc_LopHocIdAndGiaoVien_GiaoVienIdAndHocKy_HocKyId(Long lopHocId, Long giaoVienId, Integer hocKyId);

    // BaiTap không có cột môn học trực tiếp — môn được suy ra từ nội dung SGK đính kèm, cùng
    // cách self-study (LichSuTuHocRepository) đã lọc theo môn từ trước. Tách 2 query đơn giản
    // (không LEFT JOIN + OR gộp chung — thử ban đầu bị Hibernate dịch sai, luôn ra 0 kết quả)
    // rồi gộp ở Java, để không phụ thuộc cách JPQL xử lý null-path qua LEFT JOIN.
    @Query("SELECT b FROM BaiTap b WHERE b.lopHoc.lopHocId = :lopHocId AND b.giaoVien.giaoVienId = :giaoVienId " +
           "AND b.hocKy.hocKyId = :hocKyId AND b.dangBai.baiHoc.chuDe.sach.maMon = :maMon")
    List<BaiTap> findByLegacyDangBaiMonHoc(@Param("lopHocId") Long lopHocId, @Param("giaoVienId") Long giaoVienId,
                                            @Param("hocKyId") Integer hocKyId, @Param("maMon") String maMon);

    @Query("SELECT DISTINCT ct.baiTap FROM ChiTietBaiTap ct " +
           "WHERE ct.baiTap.lopHoc.lopHocId = :lopHocId AND ct.baiTap.giaoVien.giaoVienId = :giaoVienId " +
           "AND ct.baiTap.hocKy.hocKyId = :hocKyId AND ct.dangBai.baiHoc.chuDe.sach.maMon = :maMon")
    List<BaiTap> findByChiTietDangBaiMonHoc(@Param("lopHocId") Long lopHocId, @Param("giaoVienId") Long giaoVienId,
                                             @Param("hocKyId") Integer hocKyId, @Param("maMon") String maMon);

    // Bài tự luận tự do (không có nội dung SGK đính kèm) lưu môn học trực tiếp ở BaiTap.monHoc.
    @Query("SELECT b FROM BaiTap b WHERE b.lopHoc.lopHocId = :lopHocId AND b.giaoVien.giaoVienId = :giaoVienId " +
           "AND b.hocKy.hocKyId = :hocKyId AND b.monHoc.maMon = :maMon")
    List<BaiTap> findByDirectMonHoc(@Param("lopHocId") Long lopHocId, @Param("giaoVienId") Long giaoVienId,
                                     @Param("hocKyId") Integer hocKyId, @Param("maMon") String maMon);

    // Dùng cho bảng điểm khi 1 giáo viên dạy nhiều môn cho cùng 1 lớp — nếu không lọc theo môn,
    // bài tập của môn A sẽ bị tính lẫn vào môn B chỉ vì cùng giáo viên/lớp/học kỳ.
    default List<BaiTap> findByLopHocAndGiaoVienAndHocKyAndMonHoc(Long lopHocId, Long giaoVienId, Integer hocKyId, String maMon) {
        Map<Long, BaiTap> combined = new LinkedHashMap<>();
        for (BaiTap b : findByLegacyDangBaiMonHoc(lopHocId, giaoVienId, hocKyId, maMon)) combined.put(b.getBaiTapId(), b);
        for (BaiTap b : findByChiTietDangBaiMonHoc(lopHocId, giaoVienId, hocKyId, maMon)) combined.put(b.getBaiTapId(), b);
        for (BaiTap b : findByDirectMonHoc(lopHocId, giaoVienId, hocKyId, maMon)) combined.put(b.getBaiTapId(), b);
        return new ArrayList<>(combined.values());
    }
}
