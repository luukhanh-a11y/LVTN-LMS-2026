package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.LoaiBaiTap;
import com.LMS.LVTN.enums.TrangThaiBaiTap;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BaiTapRequest {

    private Long giaoVienId;
    private Long lopHocId;
    private Integer hocKyId;

    // Chỉ dùng cho bài tự luận tự do (không có nội dung SGK để suy ra môn học)
    private Integer monHocId;

    @NotBlank(message = "Tiêu đề bài tập không được để trống")
    private String tieuDe;

    private String moTa;
    private LoaiBaiTap loaiBaiTap;
    private LocalDateTime thoiDiemBatDau;

    @Future(message = "Hạn nộp phải ở tương lai")
    private LocalDateTime deadline;

    // -1 = không giới hạn số lần nộp lại
    @Min(value = -1, message = "Số lần nộp lại tối đa không hợp lệ")
    @Max(value = 20, message = "Số lần nộp lại tối đa không hợp lệ")
    private Short soLanNopLaiToiDa;

    private TrangThaiBaiTap trangThai;
}
