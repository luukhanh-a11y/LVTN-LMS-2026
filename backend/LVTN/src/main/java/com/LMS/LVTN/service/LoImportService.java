package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.response.LoImportResponse;
import com.LMS.LVTN.entity.LoImport;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.enums.LoaiImport;
import com.LMS.LVTN.enums.TrangThaiImport;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.LoImportMapper;
import com.LMS.LVTN.repository.LoImportRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class LoImportService {

    LoImportRepository loImportRepository;
    LoImportMapper loImportMapper;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveLogImport(NguoiDung nguoiThucHien, LoaiImport loaiImport, String tenFile,
                              TrangThaiImport trangThai, Integer soThanhCong,
                              String tomTatKetQua, String chiTietLoi) {
        try {
            LoImport loImport = new LoImport();
            loImport.setNguoiThucHien(nguoiThucHien);
            loImport.setLoaiImport(loaiImport);
            loImport.setTenFile(tenFile != null && !tenFile.isEmpty() ? tenFile : "unknown.xlsx");
            loImport.setTrangThai(trangThai);
            loImport.setSoThanhCong(soThanhCong != null ? soThanhCong : 0);
            loImport.setTomTatKetQua(tomTatKetQua);
            loImport.setChiTietLoi(chiTietLoi);

            loImportRepository.save(loImport);
            log.info("Đã lưu kết quả Lô Import: File [{}], Trạng thái [{}], Số thành công [{}]", tenFile, trangThai, soThanhCong);
        } catch (Exception e) {
            log.error("Lỗi khi ghi lại lịch sử LoImport: ", e);
        }
    }

    public List<LoImportResponse> getAll() {
        return loImportRepository.findAllByOrderByThoiDiemImportDesc().stream()
                .map(loImportMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<LoImportResponse> getByLoaiImport(LoaiImport loaiImport) {
        return loImportRepository.findByLoaiImportOrderByThoiDiemImportDesc(loaiImport).stream()
                .map(loImportMapper::toResponse)
                .collect(Collectors.toList());
    }

    public LoImportResponse getById(Long id) {
        LoImport loImport = loImportRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND, "Không tìm thấy lịch sử import với ID: " + id));
        return loImportMapper.toResponse(loImport);
    }
}
