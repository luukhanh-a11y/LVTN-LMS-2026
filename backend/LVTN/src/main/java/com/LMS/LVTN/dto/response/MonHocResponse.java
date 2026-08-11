package com.LMS.LVTN.dto.response;

import com.LMS.LVTN.enums.TrangThaiMonHoc;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class MonHocResponse {

    private Integer monHocId;
    private String maMon;
    private String tenMon;
    private String moTa;
    private TrangThaiMonHoc trangThai;
    private LocalDateTime ngayTao;
}
