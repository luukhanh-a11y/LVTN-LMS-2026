package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.TrangThaiBaiNop;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BaiNopRequest {

    private Long baiTapId;
    private Long hocSinhId;
    private String noiDungText;
    private String fileDinhKem;
    private String chiTietBaiLam;
}
