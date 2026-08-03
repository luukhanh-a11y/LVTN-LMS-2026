package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.TrangThaiNguoiDung;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateTrangThaiUser {
    private TrangThaiNguoiDung trangThai;
}
