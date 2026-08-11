package com.LMS.LVTN.repository;
// Force recompile
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.enums.TrangThaiNguoiDung;
import com.LMS.LVTN.enums.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, String>, JpaSpecificationExecutor<NguoiDung> {

    Optional<NguoiDung> findByTenDangNhap(String tenDangNhap);
    Optional<NguoiDung> findByEmail(String email);
    boolean existsByTenDangNhap(String tenDangNhap);
    boolean existsByEmail(String email);
    
    List<NguoiDung> findByTrangThai(TrangThaiNguoiDung trangThai);
    Page<NguoiDung> findByTrangThai(TrangThaiNguoiDung trangThai, Pageable pageable);
    
    List<NguoiDung> findByVaiTro(VaiTro vaiTro);
    Page<NguoiDung> findByVaiTro(VaiTro vaiTro, Pageable pageable);
}

