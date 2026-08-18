package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.SachRequest;
import com.LMS.LVTN.dto.response.SachResponse;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.entity.MonHoc;
import com.LMS.LVTN.entity.PhanCongGiangDay;
import com.LMS.LVTN.entity.MonHoc;
import com.LMS.LVTN.entity.Sach;
import com.LMS.LVTN.enums.LoaiSach;
import com.LMS.LVTN.enums.TrangThaiMonHoc;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.SachMapper;
import com.LMS.LVTN.repository.BaiHocRepository;
import com.LMS.LVTN.repository.BaiTapRepository;
import com.LMS.LVTN.repository.ChiTietBaiTapRepository;
import com.LMS.LVTN.repository.DangBaiRepository;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.HocKyRepository;
import com.LMS.LVTN.repository.LichSuTuHocRepository;
import com.LMS.LVTN.repository.MonHocRepository;
import com.LMS.LVTN.repository.PhanCongGiangDayRepository;
import com.LMS.LVTN.repository.SachRepository;
import com.LMS.LVTN.repository.TienDoHocSinhRepository;
import com.LMS.LVTN.repository.CauHinhHeThongRepository;
import com.LMS.LVTN.repository.NamHocRepository;
import com.LMS.LVTN.entity.CauHinhHeThong;
import com.LMS.LVTN.entity.NamHoc;
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
    CauHinhHeThongRepository cauHinhHeThongRepository;
    NamHocRepository namHocRepository;
    DangBaiRepository dangBaiRepository;
    BaiHocRepository baiHocRepository;
    ChiTietBaiTapRepository chiTietBaiTapRepository;
    BaiTapRepository baiTapRepository;
    LichSuTuHocRepository lichSuTuHocRepository;
    TienDoHocSinhRepository tienDoHocSinhRepository;

    private Integer getHocKyHienTaiTuCauHinh() {
        return cauHinhHeThongRepository.findById((short) 1)
                .map(config -> config.getHocKyHienTai() != null ? config.getHocKyHienTai().getHocKyId() : null)
                .orElse(null);
    }

    public SachResponse create(SachRequest request) {
        Sach sach = sachMapper.toEntity(request);
        
        if (request.getMaMon() != null && !monHocRepository.existsByMaMon(request.getMaMon())) {
            throw new AppExceptions(Errorcode.MON_HOC_NOT_FOUND);
        }
        
        if (request.getHocKyId() != null) {
            HocKy hocKy = hocKyRepository.findById(request.getHocKyId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            sach.setHocKy(hocKy);
        }
        
        
        return sachMapper.toResponse(sachRepository.save(sach));
    }

    public List<SachResponse> getAll(Integer hocKyId, String maMon, Integer namHocId) {
        List<Sach> sachList;
        if (hocKyId != null && maMon != null) {
            sachList = sachRepository.findByMaMonAndHocKy_HocKyId(maMon, hocKyId);
        } else if (hocKyId != null) {
            sachList = sachRepository.findByHocKy_HocKyId(hocKyId);
        } else if (namHocId != null && maMon != null) {
            sachList = sachRepository.findByMaMonAndNamHocId(maMon, namHocId);
        } else if (namHocId != null) {
            sachList = sachRepository.findByNamHocId(namHocId);
        } else if (maMon != null) {
            sachList = sachRepository.findByMaMon(maMon);
        } else {
            sachList = sachRepository.findAll();
        }
        return sachList.stream()
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
        
        if (request.getMaMon() != null && !monHocRepository.existsByMaMon(request.getMaMon())) {
            throw new AppExceptions(Errorcode.MON_HOC_NOT_FOUND);
        }

        if (request.getHocKyId() != null) {
            HocKy hocKy = hocKyRepository.findById(request.getHocKyId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
            sach.setHocKy(hocKy);
        } else {
            sach.setHocKy(null);
        }
        

        return sachMapper.toResponse(sachRepository.save(sach));
    }

    public void delete(Integer id) {
        if (!sachRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.SACH_NOT_FOUND);
        }
        if (sachDangDuocSuDung(id)) {
            throw new AppExceptions(Errorcode.SACH_DANG_SU_DUNG);
        }

        // Thứ tự bắt buộc: DangBai → BaiHoc → ChuDe → Sach (dang_bai/bai_hoc không có ON
        // DELETE CASCADE ở DB, xoá ngược thứ tự sẽ vi phạm khoá ngoại nếu sách còn nội dung).
        dangBaiRepository.deleteAllBySachId(id);
        baiHocRepository.deleteAllBySachId(id);
        sachRepository.deleteAllBySachId(id);
        sachRepository.deleteById(id);
    }

    // Sách coi là "đang sử dụng" nếu có dạng bài bên trong đã được giao trong bài tập (kiểu
    // cũ hoặc qua ChiTietBaiTap), học sinh đã có lịch sử tự học, hoặc đã có tiến độ học bài —
    // những trường hợp này chỉ nên ẩn sách (trangThai=AN) thay vì xoá cứng.
    private boolean sachDangDuocSuDung(Integer sachId) {
        return chiTietBaiTapRepository.existsByDangBai_BaiHoc_ChuDe_Sach_SachId(sachId)
                || baiTapRepository.existsByDangBai_BaiHoc_ChuDe_Sach_SachId(sachId)
                || lichSuTuHocRepository.existsByDangBai_BaiHoc_ChuDe_Sach_SachId(sachId)
                || tienDoHocSinhRepository.existsByBaiHoc_ChuDe_Sach_SachId(sachId);
    }

    // Sách bị ẩn nếu tự nó bị ẩn, hoặc môn học của nó bị ẩn (ẩn môn học → ẩn theo mọi sách
    // thuộc môn đó). Sach.maMon chỉ khớp chuỗi với MonHoc.maMon, không phải khoá ngoại thật.
    private boolean sachDangHienThi(Sach sach) {
        if (sach.getTrangThai() == TrangThaiMonHoc.AN) return false;
        MonHoc monHoc = monHocRepository.findByMaMon(sach.getMaMon()).orElse(null);
        return monHoc == null || monHoc.getTrangThai() != TrangThaiMonHoc.AN;
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

        List<Sach> ketQua = sachRepository.findByLoaiSachAndKhoiLopAndHocKy_HocKyId(LoaiSach.SACH_GIAO_KHOA, khoiLop, hocKyId);

        return ketQua.stream()
                .filter(this::sachDangHienThi)
                .map(sachMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<SachResponse> getSachBaiTapByPhanCong(Long giaoVienId, Long lopHocId, String maMon, Integer hocKyId) {
        PhanCongGiangDay phanCong = phanCongGiangDayRepository
                .findByGiaoVien_GiaoVienIdAndLopHoc_LopHocIdAndMonHoc_MaMonAndHocKy_HocKyId(giaoVienId, lopHocId, maMon, hocKyId)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        Short khoiLop = phanCong.getLopHoc().getKhoiLop();

        List<Sach> sbt = sachRepository.findByLoaiSachAndKhoiLopAndMaMonAndHocKy_HocKyId(
                LoaiSach.SACH_BAI_TAP, khoiLop, maMon, hocKyId);

        List<Sach> sgk = sachRepository.findByLoaiSachAndKhoiLopAndMaMonAndHocKy_HocKyId(
                LoaiSach.SACH_GIAO_KHOA, khoiLop, maMon, hocKyId);

        List<Sach> ketQua = new ArrayList<>();
        ketQua.addAll(sbt);
        ketQua.addAll(sgk);

        return ketQua.stream()
                .filter(this::sachDangHienThi)
                .map(sachMapper::toResponse)
                .collect(Collectors.toList());
    }

    private List<Sach> timSachNguonDeNhanBan(String maMon, Short khoiLop, Integer hocKyCuId) {
        return sachRepository.findByMaMonAndKhoiLopAndHocKyIdOrNull(maMon, khoiLop, hocKyCuId);
    }

    @Transactional
    public List<SachResponse> nhanBanSachKhongChuDe(String maMon, Short khoiLop, Integer hocKyCuId, Integer hocKyMoiId) {
        if (!monHocRepository.existsByMaMon(maMon)) {
            throw new AppExceptions(Errorcode.MON_HOC_NOT_FOUND);
        }
        HocKy hocKyMoi = hocKyRepository.findById(hocKyMoiId).orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        List<Sach> danhSachSachCu = timSachNguonDeNhanBan(maMon, khoiLop, hocKyCuId);
        List<Sach> danhSachSachMoi = new ArrayList<>();

        for (Sach sachCu : danhSachSachCu) {
            Sach sachMoi = new Sach();
            sachMoi.setLoaiSach(sachCu.getLoaiSach());
            sachMoi.setBoSach(sachCu.getBoSach());
            sachMoi.setKhoiLop(sachCu.getKhoiLop());
            sachMoi.setMaMon(sachCu.getMaMon());
            sachMoi.setHocKy(hocKyMoi);
            sachMoi.setTenSach(sachCu.getTenSach());
            sachMoi.setSlug(sachCu.getSlug() != null ? sachCu.getSlug() + "-hk" + hocKyMoi.getHocKyId() : null);
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
    public List<SachResponse> nhanBanSachKemChuDe(String maMon, Short khoiLop, Integer hocKyCuId, Integer hocKyMoiId) {
        if (!monHocRepository.existsByMaMon(maMon)) {
            throw new AppExceptions(Errorcode.MON_HOC_NOT_FOUND);
        }
        HocKy hocKyMoi = hocKyRepository.findById(hocKyMoiId).orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        List<Sach> danhSachSachCu = timSachNguonDeNhanBan(maMon, khoiLop, hocKyCuId);
        List<Sach> danhSachSachMoi = new ArrayList<>();

        for (Sach sachCu : danhSachSachCu) {
            Sach sachMoi = new Sach();
            sachMoi.setLoaiSach(sachCu.getLoaiSach());
            sachMoi.setBoSach(sachCu.getBoSach());
            sachMoi.setKhoiLop(sachCu.getKhoiLop());
            sachMoi.setMaMon(sachCu.getMaMon());
            sachMoi.setHocKy(hocKyMoi);
            sachMoi.setTenSach(sachCu.getTenSach());
            sachMoi.setSlug(sachCu.getSlug() != null ? sachCu.getSlug() + "-hk" + hocKyMoi.getHocKyId() : null);
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

            chuDeService.nhanBanChuDeKemBaiHoc(sachCu.getSachId(), savedSachMoi.getSachId());
        }

        return danhSachSachMoi.stream()
                .map(sachMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SachResponse> nhanBanSachTheoHocKy(String maMon, Short khoiLop, Integer hocKyCuId, Integer hocKyMoiId) {
        return nhanBanSachKemChuDe(maMon, khoiLop, hocKyCuId, hocKyMoiId);
    }
}
