package com.titkul.lms.service.excel;

import com.titkul.lms.dto.ParsedHocSinhExcelRow;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Component;

@Component
public class HocSinhExcelParser implements ExcelRowParser<ParsedHocSinhExcelRow> {

    @Override
    public ParsedHocSinhExcelRow parse(Row row, int rowNum) {
        ParsedHocSinhExcelRow parsed = new ParsedHocSinhExcelRow();
        parsed.setRowNumber(rowNum);
        try {
            parsed.setClassName(ExcelCellReader.getString(row.getCell(0)));
            parsed.setStudentCode(ExcelCellReader.getString(row.getCell(1)));
            parsed.setStudentName(ExcelCellReader.getString(row.getCell(2)));
            parsed.setStudentDob(ExcelCellReader.getDate(row.getCell(3)));
            parsed.setParentName(ExcelCellReader.getString(row.getCell(4)));
            parsed.setParentPhone(ExcelCellReader.getString(row.getCell(5)));
            parsed.setParentEmail(ExcelCellReader.getString(row.getCell(6)));
            validate(parsed);
        } catch (Exception e) {
            parsed.setValid(false);
            parsed.setErrorMsg("Lỗi đọc dữ liệu: " + e.getMessage());
        }
        return parsed;
    }

    private void validate(ParsedHocSinhExcelRow row) {
        StringBuilder errors = new StringBuilder();
        if (isBlank(row.getClassName()))   errors.append("Thiếu Lớp Học; ");
        if (isBlank(row.getStudentCode())) errors.append("Thiếu Mã Học Sinh; ");
        if (isBlank(row.getStudentName())) errors.append("Thiếu Họ Tên Học Sinh; ");
        if (isBlank(row.getParentName()))  errors.append("Thiếu Họ Tên Phụ Huynh; ");
        if (isBlank(row.getParentPhone())) {
            errors.append("Thiếu SĐT Phụ Huynh; ");
        } else if (!row.getParentPhone().matches("\\d{9,12}")) {
            errors.append("SĐT Phụ Huynh không hợp lệ; ");
        }
        if (!errors.isEmpty()) {
            row.setValid(false);
            row.setErrorMsg(errors.toString());
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
