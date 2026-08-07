package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.LoaiImport;
import com.LMS.LVTN.enums.TrangThaiImport;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class LoImportResponse {

    private Long loId;
    private String nguoiThucHienId;
    private String tenNguoiThucHien; // Flattened
    private LoaiImport loaiImport;
    private String tenFile;

    private TrangThaiImport trangThai;
    private Integer soThanhCong;
    private String chiTietLoi; // JSON string
    private String tomTatKetQua; // JSON string
    private LocalDateTime thoiDiemImport;
}
