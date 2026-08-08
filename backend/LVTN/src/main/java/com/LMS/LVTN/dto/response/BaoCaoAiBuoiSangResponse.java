package com.LMS.LVTN.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaoCaoAiBuoiSangResponse {
    private Long id;
    private Long classId;
    private String className;
    private String reportDate;
    private String summary;
    private String generatedAt;
}
