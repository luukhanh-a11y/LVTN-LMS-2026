package com.titkul.lms.service.excel;

import org.apache.poi.ss.usermodel.Row;

public interface ExcelRowParser<T> {
    T parse(Row row, int rowNum);
}
