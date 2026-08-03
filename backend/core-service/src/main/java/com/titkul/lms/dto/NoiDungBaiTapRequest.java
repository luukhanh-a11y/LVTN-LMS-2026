package com.titkul.lms.dto;

import lombok.Data;

import java.util.Map;

@Data
public class NoiDungBaiTapRequest {
    private String loai; // TRAC_NGHIEM | NOI_CAP | DIEN_KHUYET
    private Map<String, Object> cauHinh;   // câu hỏi, KHÔNG chứa đáp án
    private Map<String, Object> dapAnChuan; // đáp án, chỉ Admin/GV thấy được
}
