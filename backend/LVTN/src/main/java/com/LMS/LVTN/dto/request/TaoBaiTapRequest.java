package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class TaoBaiTapRequest {

    private BaiTapRequest baiTap;
    private List<ChiTietBaiTapRequest> danhSachChiTiet;
}
