package com.LMS.LVTN.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class NamHocRequest {

    private String tenNamHoc;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private Integer cloneTuNamHocId;
}
