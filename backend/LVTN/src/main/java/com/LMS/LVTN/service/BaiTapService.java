package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.BaiTapRequest;
import com.LMS.LVTN.dto.request.ChiTietBaiTapRequest;
import com.LMS.LVTN.dto.request.ThongBaoRequest;
import com.LMS.LVTN.dto.response.BaiTapResponse;
import com.LMS.LVTN.entity.BaiTap;
import com.LMS.LVTN.entity.HoSoGiaoVien;
import com.LMS.LVTN.entity.HocKy;
import com.LMS.LVTN.entity.LopHoc;
import com.LMS.LVTN.enums.LoaiThongBao;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.BaiTapMapper;
import com.LMS.LVTN.repository.BaiTapRepository;
import com.LMS.LVTN.repository.DangBaiRepository;
import com.LMS.LVTN.repository.HoSoGiaoVienRepository;
import com.LMS.LVTN.repository.HocKyRepository;
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
public class BaiTapService {

    BaiTapRepository baiTapRepository;
    BaiTapMapper baiTapMapper;
    HoSoGiaoVienRepository hoSoGiaoVienRepository;
    LopHocRepository lopHocRepository;
    HocKyRepository hocKyRepository;
    DangBaiRepository dangBaiRepository;
    ChiTietBaiTapService chiTietBaiTapService;
    ThongBaoService thongBaoService;

    @Transactional
    public BaiTapResponse create(BaiTapRequest request, List<ChiTietBaiTapRequest> chiTietRequests) {
        HoSoGiaoVien giaoVien = null;
        if (request.getGiaoVienId() != null) {
            giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
        }

        LopHoc lopHoc = null;
        if (request.getLopHocId() != null) {
            lopHoc = lopHocRepository.findById(request.getLopHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
        }

        HocKy hocKy = null;
        if (request.getHocKyId() != null) {
            hocKy = hocKyRepository.findById(request.getHocKyId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HOC_KY_NOT_FOUND));
        }

        if (chiTietRequests != null && !chiTietRequests.isEmpty()) {
            for (ChiTietBaiTapRequest ctReq : chiTietRequests) {
                if (ctReq.getDangBaiId() == null || !dangBaiRepository.existsById(ctReq.getDangBaiId())) {
                    throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
                }
                if (dangBaiRepository.isSachGiaoKhoa(ctReq.getDangBaiId())) {
                    throw new AppExceptions(Errorcode.INVALID_DATA, "Không thể giao bài tập từ Sách giáo khoa");
                }
            }
        }

        BaiTap baiTap = baiTapMapper.toEntity(request);
        if (giaoVien != null) baiTap.setGiaoVien(giaoVien);
        if (lopHoc != null) baiTap.setLopHoc(lopHoc);
        if (hocKy != null) baiTap.setHocKy(hocKy);
        BaiTap savedBaiTap = baiTapRepository.save(baiTap);

        if (lopHoc != null && giaoVien != null && giaoVien.getNguoiDung() != null) {
            ThongBaoRequest tbReq = new ThongBaoRequest();
            tbReq.setNguoiGuiId(giaoVien.getNguoiDung().getNguoiDungId());
            tbReq.setLopHocId(lopHoc.getLopHocId());
            tbReq.setTieuDe("Bài tập mới: " + savedBaiTap.getTieuDe());
            tbReq.setNoiDung("Giáo viên " + giaoVien.getHoTen() + " vừa giao bài tập mới: " + savedBaiTap.getTieuDe() + ". Hạn nộp: " + (savedBaiTap.getDeadline() != null ? savedBaiTap.getDeadline().toString() : "Không giới hạn"));
            tbReq.setLoaiThongBao(LoaiThongBao.NOI_BO);
            tbReq.setLaGhim(false);
            thongBaoService.create(tbReq);
        }

        if (chiTietRequests != null && !chiTietRequests.isEmpty()) {
            int thuTu = 1;
            for (ChiTietBaiTapRequest ctReq : chiTietRequests) {
                ctReq.setBaiTapId(savedBaiTap.getBaiTapId());
                if (ctReq.getThuTu() == null) ctReq.setThuTu(thuTu++);
                if (ctReq.getCheDoGiaoDien() == null) ctReq.setCheDoGiaoDien("MAC_DINH");
                chiTietBaiTapService.create(ctReq);
            }
        }

        return baiTapMapper.toResponse(savedBaiTap);
    }

    public List<BaiTapResponse> getAll() {
        return baiTapRepository.findAll().stream()
                .map(baiTapMapper::toResponse)
                .collect(Collectors.toList());
    }

    public BaiTapResponse getById(Long id) {
        BaiTap baiTap = baiTapRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return baiTapMapper.toResponse(baiTap);
    }

    public List<BaiTapResponse> getByLopHocId(Long lopHocId) {
        return baiTapRepository.findByLopHoc_LopHocId(lopHocId).stream()
                .map(baiTapMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<BaiTapResponse> getByGiaoVienId(Long giaoVienId) {
        return baiTapRepository.findByGiaoVien_GiaoVienId(giaoVienId).stream()
                .map(baiTapMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BaiTapResponse update(Long id, BaiTapRequest request) {
        BaiTap baiTap = baiTapRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        HoSoGiaoVien giaoVien = null;
        if (request.getGiaoVienId() != null) {
            giaoVien = hoSoGiaoVienRepository.findById(request.getGiaoVienId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));
        }

        LopHoc lopHoc = null;
        if (request.getLopHocId() != null) {
            lopHoc = lopHocRepository.findById(request.getLopHocId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
        }

        HocKy hocKy = null;
        if (request.getHocKyId() != null) {
            hocKy = hocKyRepository.findById(request.getHocKyId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.HOC_KY_NOT_FOUND));
        }

        baiTapMapper.updateBaiTap(request, baiTap);
        if (giaoVien != null) baiTap.setGiaoVien(giaoVien);
        if (lopHoc != null) baiTap.setLopHoc(lopHoc);
        if (hocKy != null) baiTap.setHocKy(hocKy);

        BaiTap savedBaiTap = baiTapRepository.save(baiTap);
        return baiTapMapper.toResponse(savedBaiTap);
    }

    @Transactional
    public void delete(Long id) {
        if (!baiTapRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        baiTapRepository.deleteById(id);
    }
}
