package com.LMS.LVTN.dto.request;

import jakarta.validation.Valid;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class TaoBaiTapRequest {

    @Valid
    private BaiTapRequest baiTap;

    private List<ChiTietBaiTapRequest> danhSachChiTiet;
}
