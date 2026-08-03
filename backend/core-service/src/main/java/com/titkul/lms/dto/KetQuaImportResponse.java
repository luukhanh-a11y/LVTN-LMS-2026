package com.titkul.lms.dto;

import lombok.Data;
import java.util.List;

@Data
public class KetQuaImportResponse {
    private int totalRows;
    private int successCount;
    private int failureCount;
    private List<BanGhiImportResponse> failures;
}
