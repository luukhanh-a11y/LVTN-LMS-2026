package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.KetQuaCuoiNamRequest;
import com.LMS.LVTN.dto.request.LichSuChuyenLopRequest;
import com.LMS.LVTN.dto.response.KetQuaCuoiNamResponse;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.KetQuaCuoiNam;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.enums.LyDoChuyenLop;
import com.LMS.LVTN.enums.QuyetDinhCuoiNam;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.KetQuaCuoiNamMapper;
import com.LMS.LVTN.repository.HoSoGiaoVienRepository;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.KetQuaCuoiNamRepository;
import com.LMS.LVTN.repository.LopHocRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KetQuaCuoiNamService {

    KetQuaCuoiNamRepository ketQuaCuoiNamRepository;
    KetQuaCuoiNamMapper ketQuaCuoiNamMapper;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    LopHocRepository lopHocRepository;
    HoSoGiaoVienRepository hoSoGiaoVienRepository;
    LichSuChuyenLopService lichSuChuyenLopService;
    ThongBaoService thongBaoService;
    AuthenticationService authenticationService;

    @Transactional
    public KetQuaCuoiNamResponse create(KetQuaCuoiNamRequest request) {
        KetQuaCuoiNam ketQua = ketQuaCuoiNamMapper.toEntity(request);

        if (request.getHocSinhId() != null) {
            HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND));
            ketQua.setHocSinh(hocSinh);
        }

        if (request.getLopHocId() != null) {
            LopHoc lopHoc = lopHocRepository.findById(request.getLopHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            ketQua.setLopHoc(lopHoc);
        }

        if (request.getGiaoVienXetId() != null) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienXetId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            ketQua.setGiaoVienXet(giaoVien);
        }

        KetQuaCuoiNam savedKetQua = ketQuaCuoiNamRepository.save(ketQua);

        return ketQuaCuoiNamMapper.toResponse(savedKetQua);
    }

    public List<KetQuaCuoiNamResponse> getAll() {
        return ketQuaCuoiNamRepository.findAll().stream()
                .map(ketQuaCuoiNamMapper::toResponse)
                .collect(Collectors.toList());
    }

    public KetQuaCuoiNamResponse getById(Long id) {
        KetQuaCuoiNam ketQua = ketQuaCuoiNamRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return ketQuaCuoiNamMapper.toResponse(ketQua);
    }

    @Transactional
    public KetQuaCuoiNamResponse update(Long id, KetQuaCuoiNamRequest request) {
        KetQuaCuoiNam ketQua = ketQuaCuoiNamRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        ketQuaCuoiNamMapper.updateKetQuaCuoiNam(request, ketQua);

        if (request.getHocSinhId() != null) {
            HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(request.getHocSinhId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND));
            ketQua.setHocSinh(hocSinh);
        }

        if (request.getLopHocId() != null) {
            LopHoc lopHoc = lopHocRepository.findById(request.getLopHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
            ketQua.setLopHoc(lopHoc);
        }

        if (request.getGiaoVienXetId() != null) {
            HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienXetId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
            ketQua.setGiaoVienXet(giaoVien);
        }

        return ketQuaCuoiNamMapper.toResponse(ketQuaCuoiNamRepository.save(ketQua));
    }

    @Transactional
    public void delete(Long id) {
        if (!ketQuaCuoiNamRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        ketQuaCuoiNamRepository.deleteById(id);
    }

    public KetQuaCuoiNamResponse getByHocSinhIdAndNamHoc(Long hocSinhId, String namHoc) {
        KetQuaCuoiNam ketQua = ketQuaCuoiNamRepository.findByHocSinh_HocSinhIdAndNamHoc(hocSinhId, namHoc)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return ketQuaCuoiNamMapper.toResponse(ketQua);
    }

    public List<KetQuaCuoiNamResponse> getByLopHocId(Long lopHocId) {
        List<KetQuaCuoiNam> list = ketQuaCuoiNamRepository.findByLopHoc_LopHocId(lopHocId);
        return list.stream().map(ketQuaCuoiNamMapper::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public KetQuaCuoiNamResponse saveOrUpdateKetQuaCuoiNam(Long lopHocId, Long hocSinhId, KetQuaCuoiNamRequest request, String token) {
        KetQuaCuoiNam ketQua = ketQuaCuoiNamRepository.findByHocSinh_HocSinhIdAndLopHoc_LopHocId(hocSinhId, lopHocId)
                .orElse(new KetQuaCuoiNam());

        ketQua.setHocSinh(hoSoHocSinhRepository.findById(hocSinhId)
                .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_HOC_SINH_NOT_FOUND)));
        ketQua.setLopHoc(lopHocRepository.findById(lopHocId)
                .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND)));

        if (ketQua.getKetQuaId() == null) {
            ketQua.setDaDuyet(false);
            ketQua.setNamHoc(request.getNamHoc());
            
            try {
                String maGiaoVien = authenticationService.getMaNguoiDungFromToken(token);
                HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findByMaGiaoVien(maGiaoVien);
                ketQua.setGiaoVienXet(giaoVien);
            } catch (java.text.ParseException e) {
                // Ignore or handle
            }
        }

        if (request.getKetQuaHocTap() != null) ketQua.setKetQuaHocTap(request.getKetQuaHocTap());
        if (request.getKetQuaRenLuyen() != null) ketQua.setKetQuaRenLuyen(request.getKetQuaRenLuyen());
        if (request.getQuyetDinh() != null) ketQua.setQuyetDinh(request.getQuyetDinh());
        if (request.getDuocXetDacCach() != null) ketQua.setDuocXetDacCach(request.getDuocXetDacCach());
        if (request.getLyDoDacCach() != null) ketQua.setLyDoDacCach(request.getLyDoDacCach());
        if (request.getGhiChu() != null) ketQua.setGhiChu(request.getGhiChu());

        ketQua.setNgayXet(java.time.LocalDate.now());

        return ketQuaCuoiNamMapper.toResponse(ketQuaCuoiNamRepository.save(ketQua));
    }

    @Transactional
    public List<KetQuaCuoiNamResponse> duyetHangLoat(String token, List<com.LMS.LVTN.dto.request.KetQuaCuoiNamDuyetRequest> requests) {
        String nguoiThucHienId;
        try {
            nguoiThucHienId = authenticationService.getMaNguoiDungFromToken(token);
        } catch (java.text.ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }

        return requests.stream().map(req -> {
            KetQuaCuoiNam ketQua = ketQuaCuoiNamRepository.findById(req.getKetQuaId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

            if (Boolean.TRUE.equals(ketQua.getDaDuyet())) {
                throw new AppExceptions(Errorcode.REQUEST_IS_PROCESSED);
            }

            if (ketQua.getQuyetDinh() != null && ketQua.getHocSinh() != null) {
                LichSuChuyenLopRequest chuyenLopReq = new LichSuChuyenLopRequest();
                chuyenLopReq.setHocSinhId(ketQua.getHocSinh().getHocSinhId());
                if (ketQua.getLopHoc() != null) {
                    chuyenLopReq.setLopCuId(ketQua.getLopHoc().getLopHocId());
                }
                chuyenLopReq.setLopMoiId(req.getLopMoiId());
                chuyenLopReq.setNamHocCu(ketQua.getNamHoc());
                chuyenLopReq.setNamHocMoi(req.getNamHocMoi() != null ? req.getNamHocMoi() : (ketQua.getNamHoc() + " -> Mới"));

                if (ketQua.getQuyetDinh() == QuyetDinhCuoiNam.LEN_LOP) {
                    chuyenLopReq.setLyDo(LyDoChuyenLop.LEN_LOP);
                } else if (ketQua.getQuyetDinh() == QuyetDinhCuoiNam.O_LAI) {
                    chuyenLopReq.setLyDo(LyDoChuyenLop.O_LAI);
                } else if (ketQua.getQuyetDinh() == QuyetDinhCuoiNam.CHUYEN_CUP) {
                    chuyenLopReq.setLyDo(LyDoChuyenLop.CHUYEN_CUP);
                }

                chuyenLopReq.setNguoiThucHienId(nguoiThucHienId);
                chuyenLopReq.setGhiChu("Admin duyệt Kết quả cuối năm #" + ketQua.getKetQuaId() + " — Quyết định: " + ketQua.getQuyetDinh());

                lichSuChuyenLopService.create(chuyenLopReq);
            }

            ketQua.setDaDuyet(true);
            return ketQuaCuoiNamMapper.toResponse(ketQuaCuoiNamRepository.save(ketQua));
        }).collect(Collectors.toList());
    }

    @Transactional
    public void thongBaoMoDanhGia(String token, String namHoc) {
        String adminId = null;
        if (token != null && token.startsWith("Bearer ")) {
            try {
                adminId = authenticationService.getMaNguoiDungFromToken(token.substring(7));
            } catch (Exception e) {
            }
        } else if (token != null) {
            try {
                adminId = authenticationService.getMaNguoiDungFromToken(token);
            } catch (Exception e) {
            }
        }

        List<LopHoc> lopHocs = lopHocRepository.findByNamHoc_TenNamHoc(namHoc);
        List<HoSoGiaoVien> gvcns = lopHocs.stream()
                .map(LopHoc::getGiaoVienChuNhiem)
                .filter(gv -> gv != null && gv.getNguoiDung() != null)
                .distinct()
                .collect(Collectors.toList());

        for (HoSoGiaoVien gv : gvcns) {
            com.LMS.LVTN.dto.request.ThongBaoRequest tbReq = new com.LMS.LVTN.dto.request.ThongBaoRequest();
            tbReq.setNguoiGuiId(adminId); // Set nguoiGuiId to avoid constraint violation
            tbReq.setTieuDe("MỞ ĐỢT ĐÁNH GIÁ CUỐI NĂM HỌC " + namHoc);
            tbReq.setNoiDung("Đợt đánh giá xếp loại cuối năm học " + namHoc + " đã được mở. Quý Thầy/Cô vui lòng truy cập hệ thống để nhập kết quả cho lớp chủ nhiệm.");
            tbReq.setNguoiNhanId(gv.getNguoiDung().getNguoiDungId());
            tbReq.setLoaiThongBao(com.LMS.LVTN.enums.LoaiThongBao.HE_THONG);
            tbReq.setLaGhim(true);
            thongBaoService.create(tbReq);
        }
    }
}
