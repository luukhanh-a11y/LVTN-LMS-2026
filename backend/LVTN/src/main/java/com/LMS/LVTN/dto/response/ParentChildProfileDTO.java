package com.LMS.LVTN.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentChildProfileDTO {
    private Long id;
    private String maHocSinh;
    private String hoTen;
    private LocalDate ngaySinh;
    private String gioiTinh;
    private String className;
    private Integer tongXp;
    private String tenGiaoVienChuNhiem;
    private String sdtGiaoVienChuNhiem;
}
