package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.TrangThaiMonHoc;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MonHocRequest {

    private String tenMon;
    private String maMon;
    private String moTa;
    private TrangThaiMonHoc trangThai;
}
