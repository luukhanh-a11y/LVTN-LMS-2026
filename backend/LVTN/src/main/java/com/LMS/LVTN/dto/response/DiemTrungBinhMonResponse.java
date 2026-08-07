package com.LMS.LVTN.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiemTrungBinhMonResponse {
    private Short monHocId;
    private String maMon;
    private String tenMon;
    private Double diemTrungBinhBaiTap; // Điểm TB các bài tập được giáo viên giao & chấm
    private Double diemTrungBinhTuHoc;  // Điểm TB tự rèn luyện trên Sách
    private Double diemTrungBinhChung;  // Điểm TB kết hợp của môn học
}
