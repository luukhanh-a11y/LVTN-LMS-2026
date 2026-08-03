package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PhuHuynhHocSinhRequest {

    private Long phuHuynhId;
    private Long hocSinhId;
    private String quanHe;
}
