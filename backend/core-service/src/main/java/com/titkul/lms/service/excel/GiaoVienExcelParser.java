package com.titkul.lms.service.excel;

import com.titkul.lms.dto.ParsedGiaoVienExcelRow;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Component;

@Component
public class GiaoVienExcelParser implements ExcelRowParser<ParsedGiaoVienExcelRow> {

    @Override
    public ParsedGiaoVienExcelRow parse(Row row, int rowNum) {
        ParsedGiaoVienExcelRow parsed = new ParsedGiaoVienExcelRow();
        parsed.setRowNumber(rowNum);
        try {
            parsed.setTeacherCode(ExcelCellReader.getString(row.getCell(0)));
            parsed.setFullName(ExcelCellReader.getString(row.getCell(1)));
            parsed.setPhone(ExcelCellReader.getString(row.getCell(2)));
            parsed.setDepartment(ExcelCellReader.getString(row.getCell(3)));
            parsed.setDateOfBirth(ExcelCellReader.getDate(row.getCell(4)));
            validate(parsed);
        } catch (Exception e) {
            parsed.setValid(false);
            parsed.setErrorMsg("Lỗi đọc dữ liệu: " + e.getMessage());
        }
        return parsed;
    }

    private void validate(ParsedGiaoVienExcelRow row) {
        StringBuilder errors = new StringBuilder();
        if (isBlank(row.getTeacherCode())) errors.append("Thiếu Mã Giáo Viên; ");
        if (isBlank(row.getFullName()))    errors.append("Thiếu Họ Tên; ");
        if (!errors.isEmpty()) {
            row.setValid(false);
            row.setErrorMsg(errors.toString());
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
