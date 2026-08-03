package com.LMS.LVTN.service;

import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.HuyHieu;
import com.LMS.LVTN.entity.KhenThuongHocSinh;
import com.LMS.LVTN.enums.LoaiHuyHieu;
import com.LMS.LVTN.enums.NguonCap;
import com.LMS.LVTN.repository.BaiNopRepository;
import com.LMS.LVTN.repository.DanhGiaBaiLamRepository;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.HuyHieuRepository;
import com.LMS.LVTN.repository.KhenThuongHocSinhRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class HuyHieuEvaluationService {

    HuyHieuRepository huyHieuRepository;
    KhenThuongHocSinhRepository khenThuongHocSinhRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    BaiNopRepository baiNopRepository;
    DanhGiaBaiLamRepository danhGiaBaiLamRepository;
    ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public void evaluate(Long hocSinhId) {
        Optional<HoSoHocSinh> hocSinhOpt = hoSoHocSinhRepository.findById(hocSinhId);
        if (hocSinhOpt.isEmpty()) {
            return;
        }
        HoSoHocSinh hocSinh = hocSinhOpt.get();

        List<HuyHieu> autoBadges = huyHieuRepository.findByLoai(LoaiHuyHieu.TU_DONG);

        for (HuyHieu huyHieu : autoBadges) {
            // Kiểm tra xem đã nhận huy hiệu này chưa
            if (khenThuongHocSinhRepository.existsByHocSinh_HocSinhIdAndHuyHieu_HuyHieuId(hocSinhId, huyHieu.getHuyHieuId())) {
                continue; // Đã nhận rồi thì bỏ qua
            }

            try {
                if (huyHieu.getDieuKien() == null || huyHieu.getDieuKien().isBlank()) {
                    continue;
                }

                JsonNode conditionNode = objectMapper.readTree(huyHieu.getDieuKien());
                String type = conditionNode.path("type").asText();
                long threshold = conditionNode.path("threshold").asLong();

                boolean isEligible = false;

                switch (type) {
                    case "SUBMISSION_COUNT":
                        long subCount = baiNopRepository.countByHocSinh_HocSinhId(hocSinhId);
                        if (subCount >= threshold) isEligible = true;
                        break;
                    case "ON_TIME_SUBMISSION_COUNT":
                        long onTimeCount = baiNopRepository.countByHocSinh_HocSinhIdAndLaNopTreFalse(hocSinhId);
                        if (onTimeCount >= threshold) isEligible = true;
                        break;
                    case "PERFECT_SCORE_COUNT":
                        long perfectCount = danhGiaBaiLamRepository.countByBaiNop_HocSinh_HocSinhIdAndDiemSoGreaterThanEqual(hocSinhId, BigDecimal.TEN);
                        if (perfectCount >= threshold) isEligible = true;
                        break;
                    default:
                        log.warn("Unknown condition type: {}", type);
                }

                if (isEligible) {
                    // Trao huy hiệu tự động
                    KhenThuongHocSinh khenThuong = new KhenThuongHocSinh();
                    khenThuong.setHocSinh(hocSinh);
                    khenThuong.setHuyHieu(huyHieu);
                    khenThuong.setNguonCap(NguonCap.HE_THONG);
                    khenThuong.setThuKhen("Hệ thống tự động trao thưởng vì đạt thành tích xuất sắc!");
                    khenThuongHocSinhRepository.save(khenThuong);
                    log.info("Automatically awarded badge {} to student {}", huyHieu.getTenHuyHieu(), hocSinhId);
                }

            } catch (Exception e) {
                log.error("Error evaluating condition for badge ID {}: {}", huyHieu.getHuyHieuId(), e.getMessage());
            }
        }
    }
}
