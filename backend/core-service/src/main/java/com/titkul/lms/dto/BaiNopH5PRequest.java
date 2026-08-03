package com.titkul.lms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BaiNopH5PRequest {
    @NotNull(message = "rawScore không được để trống")
    private Integer rawScore;

    @NotNull(message = "maxScore không được để trống")
    private Integer maxScore;

    private Boolean completed;

    private String interactionDetails;
}
