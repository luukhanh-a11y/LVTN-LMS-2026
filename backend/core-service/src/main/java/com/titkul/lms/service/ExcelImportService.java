package com.titkul.lms.service;

import com.titkul.lms.service.excel.ExcelRowParser;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.titkul.lms.dto.ParsedHocSinhExcelRow;
import com.titkul.lms.dto.ParsedGiaoVienExcelRow;
import com.titkul.lms.service.excel.HocSinhExcelParser;
import com.titkul.lms.service.excel.GiaoVienExcelParser;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelImportService {

    private final HocSinhExcelParser studentParser;
    private final GiaoVienExcelParser teacherParser;

    public List<ParsedHocSinhExcelRow> parseStudentImportFile(MultipartFile file) {
        return parseFile(file, studentParser);
    }

    public List<ParsedGiaoVienExcelRow> parseTeacherImportFile(MultipartFile file) {
        return parseFile(file, teacherParser);
    }

    private <T> List<T> parseFile(MultipartFile file, ExcelRowParser<T> parser) {
        List<T> rows = new ArrayList<>();
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                rows.add(parser.parse(row, i + 1));
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xử lý file Excel: " + e.getMessage(), e);
        }
        return rows;
    }
}
