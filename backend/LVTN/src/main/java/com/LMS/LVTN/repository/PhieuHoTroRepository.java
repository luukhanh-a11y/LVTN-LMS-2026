package com.LMS.LVTN.repository;

import com.LMS.LVTN.entity.PhieuHoTro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface PhieuHoTroRepository extends JpaRepository<PhieuHoTro, Long>, JpaSpecificationExecutor<PhieuHoTro> {

    List<PhieuHoTro> findByNguoiDungLienQuan_NguoiDungId(String id);
    Page<PhieuHoTro> findByNguoiDungLienQuan_NguoiDungId(String id, Pageable pageable);

    List<PhieuHoTro> findByNguoiDungTao_NguoiDungId(String id);
    Page<PhieuHoTro> findByNguoiDungTao_NguoiDungId(String id, Pageable pageable);
}
