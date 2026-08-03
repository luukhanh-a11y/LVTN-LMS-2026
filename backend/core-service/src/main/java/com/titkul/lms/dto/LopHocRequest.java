package com.titkul.lms.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LopHocRequest {
    @NotBlank(message = "Tên lớp không được để trống")
    private String name;

    @NotNull(message = "Khối lớp không được để trống")
    @Min(value = 1, message = "Khối lớp không hợp lệ")
    @Max(value = 12, message = "Khối lớp không hợp lệ")
    private Short grade;

    @NotNull(message = "Niên khóa không được để trống")
    private Integer academicYearId;

    @NotNull(message = "Sĩ số tối đa không được để trống")
    @Min(value = 1, message = "Sĩ số tối đa phải lớn hơn 0")
    private Short maxCapacity;

    private Long homeroomTeacherId;
}
