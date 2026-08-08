package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.LyDoChuyenLop;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class BulkChuyenLopRequest {
    private List<Long> hocSinhIds;
    private Long lopHocMoiId;
    private LyDoChuyenLop lyDo;
    private String ghiChu;
}
