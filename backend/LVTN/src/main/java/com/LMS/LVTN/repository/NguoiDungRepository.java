package com.LMS.LVTN.repository;
// Force recompile
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.enums.TrangThaiNguoiDung;
import com.LMS.LVTN.enums.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, String> {

    Optional<NguoiDung> findByTenDangNhap(String tenDangNhap);
    List<NguoiDung> findByTrangThai(TrangThaiNguoiDung trangThai);
    List<NguoiDung> findByVaiTro(VaiTro vaiTro);
}
