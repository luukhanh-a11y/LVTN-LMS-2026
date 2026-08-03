package com.titkul.lms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BaiNopTuLuanRequest {
    @NotBlank(message = "Nội dung bài làm không được để trống")
    private String textContent;

    private Boolean isDraft;

    private String attachmentUrl;
}
