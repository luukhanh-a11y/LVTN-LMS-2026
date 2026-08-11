package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.TienDoHocSinhRequest;
import com.LMS.LVTN.dto.response.BadgeDTO;
import com.LMS.LVTN.dto.response.ParentDashboardResponse;
import com.LMS.LVTN.dto.response.RecentProgressDTO;
import com.LMS.LVTN.dto.response.TienDoHocSinhResponse;
import com.LMS.LVTN.entity.*;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.TienDoHocSinhMapper;
import com.LMS.LVTN.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TienDoHocSinhService {

    TienDoHocSinhRepository tienDoHocSinhRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    BaiHocRepository baiHocRepository;
    HocKyRepository hocKyRepository;
    LichSuTuHocRepository lichSuTuHocRepository;
    DangBaiRepository dangBaiRepository;
    TienDoHocSinhMapper tienDoHocSinhMapper;
    KhenThuongHocSinhRepository khenThuongHocSinhRepository;
    BaiTapRepository baiTapRepository;
    MonHocRepository monHocRepository;

    private HocKy resolveHocKyHienTai(HoSoHocSinh hocSinh, BaiHoc baiHoc) {
        LopHoc lopHoc = hocSinh.getLopHoc();
        if (lopHoc == null) {
            throw new AppExceptions(Errorcode.INVALID_DATA);
        }

        Integer namHocId = lopHoc.getNamHoc().getNamHocId();
        Short soHocKySach = baiHoc.getChuDe().getSach().getHocKy().getSoHocKy();

        return hocKyRepository.findByNamHoc_NamHocIdAndSoHocKy(namHocId, soHocKySach)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public TienDoHocSinhResponse getByHocSinhIdAndBaiHocId(Long hocSinhId, Integer baiHocId) {
        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(hocSinhId)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
        BaiHoc baiHoc = baiHocRepository.findById(baiHocId)
                .orElseThrow(() -> new AppExceptions(Errorcode.BAI_HOC_NOT_FOUND));
        HocKy hocKy = resolveHocKyHienTai(hocSinh, baiHoc);

        return tienDoHocSinhRepository.findByHocSinh_HocSinhIdAndBaiHoc_BaiHocIdAndHocKy_HocKyId(
                        hocSinhId, baiHocId, hocKy.getHocKyId())
                .map(tienDoHocSinhMapper::toResponse)
                .orElseGet(() -> {
                    TienDoHocSinhResponse emptyResp = new TienDoHocSinhResponse();
                    emptyResp.setHocSinhId(hocSinhId);
                    emptyResp.setBaiHocId(baiHocId);
                    emptyResp.setPhanTramHoanThanh((short) 0);
                    emptyResp.setThoiGianHoc(0);
                    emptyResp.setDaHoanThanh(false);
                    return emptyResp;
                });
    }

    @Transactional
    public TienDoHocSinh createTienDo(Long hocSinhId, Integer baiHocId) {
        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(hocSinhId)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

        BaiHoc baiHoc = baiHocRepository.findById(baiHocId)
                .orElseThrow(() -> new AppExceptions(Errorcode.BAI_HOC_NOT_FOUND));

        HocKy hocKy = resolveHocKyHienTai(hocSinh, baiHoc);

        TienDoHocSinh tienDo = new TienDoHocSinh();
        tienDo.setHocSinh(hocSinh);
        tienDo.setBaiHoc(baiHoc);
        tienDo.setHocKy(hocKy);
        tienDo.setPhanTramHoanThanh((short) 0);
        tienDo.setThoiGianHoc(0);
        tienDo.setLanXemCuoi(LocalDateTime.now());
        tienDo.setDaHoanThanh(false);

        return tienDoHocSinhRepository.save(tienDo);
    }

    @Transactional
    public TienDoHocSinh getOrCreateTienDo(Long hocSinhId, Integer baiHocId) {
        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(hocSinhId)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
        BaiHoc baiHoc = baiHocRepository.findById(baiHocId)
                .orElseThrow(() -> new AppExceptions(Errorcode.BAI_HOC_NOT_FOUND));
        HocKy hocKy = resolveHocKyHienTai(hocSinh, baiHoc);

        return tienDoHocSinhRepository
                .findByHocSinh_HocSinhIdAndBaiHoc_BaiHocIdAndHocKy_HocKyId(hocSinhId, baiHocId, hocKy.getHocKyId())
                .orElseGet(() -> createTienDo(hocSinhId, baiHocId));
    }

    @Transactional
    public void updateProgress(Long hocSinhId, Integer baiHocId) {
        TienDoHocSinh tienDo = getOrCreateTienDo(hocSinhId, baiHocId);

        int totalDangBai = dangBaiRepository.countByBaiHoc_BaiHocId(baiHocId);
        if (totalDangBai == 0) {
            tienDo.setPhanTramHoanThanh((short) 100);
            tienDo.setDaHoanThanh(true);
        } else {
            int completedDangBai = lichSuTuHocRepository.countDistinctDangBaiByHocSinhAndBaiHoc(hocSinhId, baiHocId);
            short percentage = (short) ((completedDangBai * 100) / totalDangBai);
            if (percentage > 100) percentage = 100;

            tienDo.setPhanTramHoanThanh(percentage);
            tienDo.setDaHoanThanh(percentage == 100);
        }
        
        tienDo.setLanXemCuoi(LocalDateTime.now());
        tienDoHocSinhRepository.save(tienDo);
    }

    @Transactional
    public void unmarkProgress(Long hocSinhId, Integer baiHocId) {
        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(hocSinhId)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
        BaiHoc baiHoc = baiHocRepository.findById(baiHocId)
                .orElseThrow(() -> new AppExceptions(Errorcode.BAI_HOC_NOT_FOUND));
        HocKy hocKy = resolveHocKyHienTai(hocSinh, baiHoc);

        tienDoHocSinhRepository.findByHocSinh_HocSinhIdAndBaiHoc_BaiHocIdAndHocKy_HocKyId(
                        hocSinhId, baiHocId, hocKy.getHocKyId())
                .ifPresent(tienDo -> {
                    tienDo.setDaHoanThanh(false);
                    tienDo.setPhanTramHoanThanh((short) 0);
                    tienDo.setLanXemCuoi(LocalDateTime.now());
                    tienDoHocSinhRepository.save(tienDo);
                });
    }

    public List<TienDoHocSinhResponse> getAll() {
        return tienDoHocSinhRepository.findAll().stream()
                .map(tienDoHocSinhMapper::toResponse)
                .collect(Collectors.toList());
    }

    public TienDoHocSinhResponse getById(Long id) {
        TienDoHocSinh entity = tienDoHocSinhRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));
        return tienDoHocSinhMapper.toResponse(entity);
    }

    public void delete(Long id) {
        if (!tienDoHocSinhRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
        }
        tienDoHocSinhRepository.deleteById(id);
    }

    public ParentDashboardResponse getDashboardForStudent(Long hocSinhId) {
        // Fetch the 5 most recently updated progress records for this student
        List<TienDoHocSinh> progressList = tienDoHocSinhRepository.findTop5ByHocSinh_HocSinhIdOrderByLanXemCuoiDesc(hocSinhId);

        List<RecentProgressDTO> progressDTOs = progressList.stream().map(tienDo -> {
            String timeStr = "0 phút";
            if (tienDo.getThoiGianHoc() != null && tienDo.getThoiGianHoc() > 0) {
                int mins = tienDo.getThoiGianHoc() / 60;
                int hours = mins / 60;
                if (hours > 0) {
                    timeStr = hours + " giờ " + (mins % 60) + " phút";
                } else {
                    timeStr = mins + " phút";
                }
            }
            
            String subjectName = "N/A";
            String lessonName = "N/A";
            if (tienDo.getBaiHoc() != null) {
                lessonName = tienDo.getBaiHoc().getTenBaiHoc();
                if (tienDo.getBaiHoc().getChuDe() != null && 
                    tienDo.getBaiHoc().getChuDe().getSach() != null && 
                    tienDo.getBaiHoc().getChuDe().getSach().getMaMon() != null) {
                    String maMon = tienDo.getBaiHoc().getChuDe().getSach().getMaMon();
                    subjectName = monHocRepository.findByMaMon(maMon)
                            .map(MonHoc::getTenMon)
                            .orElse(maMon);
                }
            }

            return RecentProgressDTO.builder()
                    .id(tienDo.getTienDoId())
                    .subject(subjectName)
                    .lesson(lessonName)
                    .isCompleted(tienDo.getDaHoanThanh() != null && tienDo.getDaHoanThanh())
                    .progress(tienDo.getPhanTramHoanThanh() != null ? tienDo.getPhanTramHoanThanh() : 0)
                    .timeSpent(timeStr)
                    .build();
        }).collect(Collectors.toList());

        // Fetch up to 5 most recent badges
        List<KhenThuongHocSinh> badges = khenThuongHocSinhRepository.findTop5ByHocSinh_HocSinhIdOrderByThoiDiemTraoDesc(hocSinhId);
        List<BadgeDTO> badgeDTOs = badges.stream().map(kt -> BadgeDTO.builder()
                .id(kt.getKhenThuongId())
                .name(kt.getHuyHieu() != null ? kt.getHuyHieu().getTenHuyHieu() : "N/A")
                .description(kt.getHuyHieu() != null ? kt.getHuyHieu().getMoTa() : "")
                .iconUrl(kt.getHuyHieu() != null ? kt.getHuyHieu().getIconUrl() : null)
                .date(kt.getThoiDiemTrao().toLocalDate().toString())
                .source(kt.getNguonCap() != null ? kt.getNguonCap().name() : "N/A")
                .build()).collect(Collectors.toList());

        return ParentDashboardResponse.builder()
                .recentProgress(progressDTOs)
                .recentBadges(badgeDTOs)
                .build();
    }

    public List<com.LMS.LVTN.dto.response.AchievementBadgeDTO> getAchievementBadges(Long hocSinhId) {
        List<KhenThuongHocSinh> badges = khenThuongHocSinhRepository.findByHocSinh_HocSinhId(hocSinhId);
        
        // Sort descending by date
        badges.sort((b1, b2) -> b2.getThoiDiemTrao().compareTo(b1.getThoiDiemTrao()));
        
        return badges.stream().map(kt -> {
            String color = "bg-amber-100 text-amber-500";
            if (kt.getHuyHieu() != null) {
                if ("THU_CONG".equals(kt.getNguonCap().name())) {
                    color = "bg-blue-100 text-blue-500";
                }
            }

            return com.LMS.LVTN.dto.response.AchievementBadgeDTO.builder()
                .id(kt.getKhenThuongId())
                .name(kt.getHuyHieu() != null ? kt.getHuyHieu().getTenHuyHieu() : "Huy hiệu")
                .date(kt.getThoiDiemTrao().toLocalDate().toString())
                .message(kt.getThuKhen() != null ? kt.getThuKhen() : "Chúc mừng con đã nhận được huy hiệu mới!")
                .teacher(kt.getGiaoVien() != null ? kt.getGiaoVien().getHoTen() : "Hệ thống")
                .color(color)
                .iconUrl(kt.getHuyHieu() != null ? kt.getHuyHieu().getIconUrl() : null)
                .icon(null)
                .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<com.LMS.LVTN.dto.response.ParentAssignmentDTO> getAssignmentsForStudent(Long hocSinhId) {
        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findById(hocSinhId)
                .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));

        if (hocSinh.getLopHoc() == null) {
            return java.util.Collections.emptyList();
        }

        List<BaiTap> baiTaps = baiTapRepository.findByLopHoc_LopHocId(hocSinh.getLopHoc().getLopHocId());
        return baiTaps.stream().map(bt -> {
            String type = "TRAC_NGHIEM";
            if (bt.getDangBai() != null) {
                type = bt.getDangBai().getLoaiNoiDung() != null ? bt.getDangBai().getLoaiNoiDung().name() : type;
            }

            String subjectName = "Bài tập";
            if (bt.getDangBai() != null && bt.getDangBai().getBaiHoc() != null &&
                bt.getDangBai().getBaiHoc().getChuDe() != null &&
                bt.getDangBai().getBaiHoc().getChuDe().getSach() != null &&
                bt.getDangBai().getBaiHoc().getChuDe().getSach().getMaMon() != null) {
                String maMon = bt.getDangBai().getBaiHoc().getChuDe().getSach().getMaMon();
                subjectName = monHocRepository.findByMaMon(maMon)
                        .map(MonHoc::getTenMon)
                        .orElse(maMon);
            }
            
            int xpReward = 50;
            if (bt.getDangBai() != null && bt.getDangBai().getXpThuong() != null) {
                xpReward = bt.getDangBai().getXpThuong();
            }

            return com.LMS.LVTN.dto.response.ParentAssignmentDTO.builder()
                    .id(bt.getBaiTapId())
                    .title(bt.getTieuDe() != null ? bt.getTieuDe() : (bt.getDangBai() != null ? bt.getDangBai().getTenDangBai() : "Bài tập"))
                    .dueDate(bt.getDeadline())
                    .xpReward(xpReward)
                    .completed(false) // Assuming not completed by default since parent just views it. Or could query BaiNop
                    .subjectName(subjectName)
                    .type(type)
                    .build();
        }).collect(Collectors.toList());
    }
}
