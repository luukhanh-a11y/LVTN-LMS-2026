package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.LoaiImport;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoImportRequest {

    private String nguoiThucHienId;
    private LoaiImport loaiImport;
    private String tenFile;
}

