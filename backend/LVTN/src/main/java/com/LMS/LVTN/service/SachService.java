package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.SachRequest;
import com.LMS.LVTN.dto.response.SachResponse;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.entity.MonHoc;
import com.LMS.LVTN.entity.PhanCongGiangDay;
import com.LMS.LVTN.entity.Sach;
import com.LMS.LVTN.enums.LoaiSach;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.SachMapper;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.HocKyRepository;
import com.LMS.LVTN.repository.MonHocRepository;
import com.LMS.LVTN.repository.PhanCongGiangDayRepository;
import com.LMS.LVTN.repository.SachRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SachService {

    SachRepository sachRepository;
    SachMapper sachMapper;
    MonHocRepository monHocRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    HocKyRepository hocKyRepository;
    PhanCongGiangDayRepository phanCongGiangDayRepository;
    ChuDeService chuDeService;

    public SachResponse create(SachRequest request) {
        Sach sach = sachMapper.toEntity(request);
        
        if (request.getMonHocId() != null) {
            MonHoc monHoc = monHocRepository.findById(request.getMonHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.MON_HOC_NOT_FOUND));
            sach.setMonHoc(monHoc);
        }
        
        return sachMapper.toResponse(sachRepository.save(sach));
    }

    public List<SachResponse> getAll() {
        return sachRepository.findAll().stream()
                .map(sachMapper::toResponse)
                .collect(Collectors.toList());
    }

    public SachResponse getById(Integer id) {
        Sach sach = sachRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.SACH_NOT_FOUND));
        return sachMapper.toResponse(sach);
    }

    public SachResponse update(Integer id, SachRequest request) {
        Sach sach = sachRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.SACH_NOT_FOUND));

        sachMapper.updateSach(request, sach);
        
        if (request.getMonHocId() != null) {
            MonHoc monHoc = monHocRepository.findById(request.getMonHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.MON_HOC_NOT_FOUND));
            sach.setMonHoc(monHoc);
        }

        return sachMapper.toResponse(sachRepository.save(sach));
    }

    public void delete(Integer id) {
        if (!sachRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.SACH_NOT_FOUND);
        }

        sachRepository.deleteAllBySachId(id);
        sachRepository.deleteById(id);
    }

    public List<SachResponse> getSachGiaoKhoaForStudent(Long hocSinhId, Integer hocKyId) {
        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(hocSinhId)
                .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND));
        if (hocSinh.getLopHoc() == null) {
            throw new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND);
        }
        HocKy hocKy = hocKyRepository.findById(hocKyId)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        Short khoiLop = hocSinh.getLopHoc().getKhoiLop();
        Short soHocKy = hocKy.getSoHocKy();

        return sachRepository.findByLoaiSachAndKhoiLopAndHocKy(LoaiSach.SACH_GIAO_KHOA, khoiLop, soHocKy).stream()
                .map(sachMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<SachResponse> getSachBaiTapByPhanCong(Long giaoVienId, Long lopHocId, Integer monHocId, Integer hocKyId) {
        PhanCongGiangDay phanCong = phanCongGiangDayRepository
                .findByGiaoVien_GiaoVienIdAndLopHoc_LopHocIdAndMonHoc_MonHocIdAndHocKy_HocKyId(giaoVienId, lopHocId, monHocId, hocKyId)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        Short khoiLop = phanCong.getLopHoc().getKhoiLop();
        Short soHocKy = phanCong.getHocKy().getSoHocKy();

        return sachRepository.findByLoaiSachAndKhoiLopAndMonHocAndHocKy(LoaiSach.SACH_BAI_TAP, khoiLop, monHocId, soHocKy).stream()
                .map(sachMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SachResponse> nhanBanSachKhongChuDe(Short monHocId, Short khoiLop, Short hocKyCu, Short hocKyMoi) {
        if (!monHocRepository.existsById(monHocId)) {
            throw new AppExceptions(Errorcode.MON_HOC_NOT_FOUND);
        }

        List<Sach> danhSachSachCu = sachRepository.findByMonHocAndKhoiLopAndHocKy(monHocId, khoiLop, hocKyCu);
        List<Sach> danhSachSachMoi = new ArrayList<>();

        for (Sach sachCu : danhSachSachCu) {
            Sach sachMoi = new Sach();
            sachMoi.setLoaiSach(sachCu.getLoaiSach());
            sachMoi.setBoSach(sachCu.getBoSach());
            sachMoi.setKhoiLop(sachCu.getKhoiLop());
            sachMoi.setMonHoc(sachCu.getMonHoc());
            sachMoi.setHocKy(hocKyMoi);
            sachMoi.setTenSach(sachCu.getTenSach());
            sachMoi.setSlug(sachCu.getSlug() != null ? sachCu.getSlug() + "-hk" + hocKyMoi : null);
            sachMoi.setMoTa(sachCu.getMoTa());
            sachMoi.setAnhBiaUrl(sachCu.getAnhBiaUrl());
            sachMoi.setTongSoTrang(sachCu.getTongSoTrang());
            sachMoi.setNamXuatBan(sachCu.getNamXuatBan());
            sachMoi.setBanQuyen(sachCu.getBanQuyen());
            sachMoi.setBanBienSoan(sachCu.getBanBienSoan());
            sachMoi.setTrangThai(sachCu.getTrangThai());
            sachMoi.setBookIdNgoai(null);

            danhSachSachMoi.add(sachRepository.save(sachMoi));
        }

        return danhSachSachMoi.stream()
                .map(sachMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SachResponse> nhanBanSachKemChuDe(Short monHocId, Short khoiLop, Short hocKyCu, Short hocKyMoi) {
        if (!monHocRepository.existsById(monHocId)) {
            throw new AppExceptions(Errorcode.MON_HOC_NOT_FOUND);
        }

        List<Sach> danhSachSachCu = sachRepository.findByMonHocAndKhoiLopAndHocKy(monHocId, khoiLop, hocKyCu);
        List<Sach> danhSachSachMoi = new ArrayList<>();

        for (Sach sachCu : danhSachSachCu) {
            Sach sachMoi = new Sach();
            sachMoi.setLoaiSach(sachCu.getLoaiSach());
            sachMoi.setBoSach(sachCu.getBoSach());
            sachMoi.setKhoiLop(sachCu.getKhoiLop());
            sachMoi.setMonHoc(sachCu.getMonHoc());
            sachMoi.setHocKy(hocKyMoi);
            sachMoi.setTenSach(sachCu.getTenSach());
            sachMoi.setSlug(sachCu.getSlug() != null ? sachCu.getSlug() + "-hk" + hocKyMoi : null);
            sachMoi.setMoTa(sachCu.getMoTa());
            sachMoi.setAnhBiaUrl(sachCu.getAnhBiaUrl());
            sachMoi.setTongSoTrang(sachCu.getTongSoTrang());
            sachMoi.setNamXuatBan(sachCu.getNamXuatBan());
            sachMoi.setBanQuyen(sachCu.getBanQuyen());
            sachMoi.setBanBienSoan(sachCu.getBanBienSoan());
            sachMoi.setTrangThai(sachCu.getTrangThai());
            sachMoi.setBookIdNgoai(null);

            Sach savedSachMoi = sachRepository.save(sachMoi);
            danhSachSachMoi.add(savedSachMoi);

            // Gọi qua ChuDeService để nhân bản toàn bộ Chủ Đề -> Bài Học -> Dạng Bài (chỉ lấy bài của Hệ thống)
            chuDeService.nhanBanChuDeKemBaiHoc(sachCu.getSachId(), savedSachMoi.getSachId());
        }

        return danhSachSachMoi.stream()
                .map(sachMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SachResponse> nhanBanSachTheoHocKy(Short monHocId, Short khoiLop, Short hocKyCu, Short hocKyMoi) {
        return nhanBanSachKemChuDe(monHocId, khoiLop, hocKyCu, hocKyMoi);
    }
}
