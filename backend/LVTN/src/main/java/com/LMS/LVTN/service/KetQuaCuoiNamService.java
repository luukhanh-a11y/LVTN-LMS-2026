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

        // Tự động liên thông sang LichSuChuyenLopService để xử lý chuyển lớp/tốt nghiệp
        if (savedKetQua.getQuyetDinh() != null) {
            LichSuChuyenLopRequest chuyenLopReq = new LichSuChuyenLopRequest();
            if (savedKetQua.getHocSinh() != null) {
                chuyenLopReq.setHocSinhId(savedKetQua.getHocSinh().getHocSinhId());
            }
            if (savedKetQua.getLopHoc() != null) {
                chuyenLopReq.setLopCuId(savedKetQua.getLopHoc().getLopHocId());
            }
            chuyenLopReq.setLopMoiId(request.getLopMoiId()); // Có thể null với CHUYEN_CUP
            chuyenLopReq.setNamHocCu(savedKetQua.getNamHoc());
            chuyenLopReq.setNamHocMoi(request.getNamHocMoi() != null ? request.getNamHocMoi() : (savedKetQua.getNamHoc() + " -> Mới"));

            if (savedKetQua.getQuyetDinh() == QuyetDinhCuoiNam.LEN_LOP) {
                chuyenLopReq.setLyDo(LyDoChuyenLop.LEN_LOP);
            } else if (savedKetQua.getQuyetDinh() == QuyetDinhCuoiNam.O_LAI) {
                chuyenLopReq.setLyDo(LyDoChuyenLop.O_LAI);
            } else if (savedKetQua.getQuyetDinh() == QuyetDinhCuoiNam.CHUYEN_CUP) {
                chuyenLopReq.setLyDo(LyDoChuyenLop.CHUYEN_CUP);
            }

            if (savedKetQua.getGiaoVienXet() != null && savedKetQua.getGiaoVienXet().getNguoiDung() != null) {
                chuyenLopReq.setNguoiThucHienId(savedKetQua.getGiaoVienXet().getNguoiDung().getNguoiDungId());
            }
            chuyenLopReq.setGhiChu("Tự động chuyển đổi lớp theo Quyết định Cuối năm: " + savedKetQua.getQuyetDinh());

            if (chuyenLopReq.getHocSinhId() != null && chuyenLopReq.getNguoiThucHienId() != null) {
                lichSuChuyenLopService.create(chuyenLopReq);
            }
        }

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

    @Transactional
    public void thongBaoMoDanhGia(String namHoc) {
        List<LopHoc> lopHocs = lopHocRepository.findByNamHoc_TenNamHoc(namHoc);
        List<HoSoGiaoVien> gvcns = lopHocs.stream()
                .map(LopHoc::getGiaoVienChuNhiem)
                .filter(gv -> gv != null && gv.getNguoiDung() != null)
                .distinct()
                .collect(Collectors.toList());

        for (HoSoGiaoVien gv : gvcns) {
            com.LMS.LVTN.dto.request.ThongBaoRequest tbReq = new com.LMS.LVTN.dto.request.ThongBaoRequest();
            tbReq.setTieuDe("MỞ ĐỢT ĐÁNH GIÁ CUỐI NĂM HỌC " + namHoc);
            tbReq.setNoiDung("Đợt đánh giá xếp loại cuối năm học " + namHoc + " đã được mở. Quý Thầy/Cô vui lòng truy cập hệ thống để nhập kết quả cho lớp chủ nhiệm.");
            tbReq.setNguoiNhanId(gv.getNguoiDung().getNguoiDungId());
            tbReq.setLoaiThongBao(com.LMS.LVTN.enums.LoaiThongBao.HE_THONG);
            tbReq.setLaGhim(true);
            thongBaoService.create(tbReq);
        }
    }
}
