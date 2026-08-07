package com.LMS.LVTN.service;

import com.LMS.LVTN.entity.*;
import com.LMS.LVTN.enums.*;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NguoiDungExcelService {

    NguoiDungRepository nguoiDungRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    HoSoGiaoVienRepository hoSoGiaoVienRepository;
    HoSoPhuHuynhRepository hoSoPhuHuynhRepository;
    PhuHuynhHocSinhRepository phuHuynhHocSinhRepository;
    LopHocRepository lopHocRepository;
    AuthenticationService authenticationService;
    LoImportService loImportService;

    @NonFinal
    @Value("${app.default.reset-password:123456}")
    String defaultResetPassword;

    private NguoiDung getAdminUser(String token) {
        try {
            String nguoiDungId = authenticationService.getMaNguoiDungFromToken(token);
            NguoiDung nguoiDung = nguoiDungRepository.findById(nguoiDungId)
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            if (nguoiDung.getVaiTro() != VaiTro.ADMIN) {
                throw new AppExceptions(Errorcode.UNAUTHORIZED, "Chỉ tài khoản ADMIN mới có quyền thực hiện chức năng import Excel này!");
            }
            return nguoiDung;
        } catch (ParseException e) {
            throw new AppExceptions(Errorcode.INVALID_TOKEN);
        }
    }

    public void exportTemplate(HttpServletResponse response) {
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Template Import Nguoi Dung");

            // Tạo Header Row
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "Vai trò (*)", "Tên đăng nhập (*)", "Mật khẩu", "Họ tên (*)", "Email",
                    "SĐT", "Giới tính", "Ngày sinh (dd/MM/yyyy)", "Mã HS/GV", 
                    "Lớp học ID (HS) / Bộ môn (GV)", "Mã con (*nếu là Phụ huynh)", "Mối quan hệ"
            };

            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 5000); // Set auto width (approximate)
            }

            // Tạo Sample Row
            Row sampleRow1 = sheet.createRow(1);
            sampleRow1.createCell(0).setCellValue("HOC_SINH");
            sampleRow1.createCell(1).setCellValue("hs_nguyenvana");
            sampleRow1.createCell(2).setCellValue("123456");
            sampleRow1.createCell(3).setCellValue("Nguyễn Văn A");
            sampleRow1.createCell(4).setCellValue("nguyenvana@example.com");
            sampleRow1.createCell(5).setCellValue("0901234567");
            sampleRow1.createCell(6).setCellValue("Nam");
            sampleRow1.createCell(7).setCellValue("15/05/2010");
            sampleRow1.createCell(8).setCellValue("HS001");
            sampleRow1.createCell(9).setCellValue("101 (ID lớp học)");
            sampleRow1.createCell(10).setCellValue("");
            sampleRow1.createCell(11).setCellValue("");

            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=Template_Import_NguoiDung.xlsx");
            workbook.write(response.getOutputStream());
        } catch (IOException e) {
            throw new AppExceptions(Errorcode.INVALID_DATA, "Lỗi khi tạo file Excel: " + e.getMessage());
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public String importUsersFromExcel(String token, MultipartFile file) {
        NguoiDung adminUser = getAdminUser(token);

        if (file == null || file.isEmpty()) {
            throw new AppExceptions(Errorcode.INVALID_DATA, "File Excel trống hoặc không hợp lệ!");
        }

        int countHocSinh = 0;
        int countGiaoVien = 0;
        int countPhuHuynh = 0;

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter dataFormatter = new DataFormatter();

            // Phụ huynh sẽ được xử lý trong đợt 2 để đảm bảo các tài khoản con (học sinh) trong file đã được tạo
            List<Row> parentRows = new ArrayList<>();

            // ĐỢT 1: Tạo tài khoản Học Sinh & Giáo Viên trước
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || isRowEmpty(row, dataFormatter)) continue;

                String valCol0 = getCellString(row, 0, dataFormatter).toUpperCase();
                int startCol = isRoleString(valCol0) ? 0 : 1;
                String vaiTroStr = getCellString(row, startCol, dataFormatter).toUpperCase();

                VaiTro vaiTro = parseVaiTro(vaiTroStr, i + 1);

                if (vaiTro == VaiTro.PHU_HUYNH) {
                    parentRows.add(row);
                    continue;
                }

                if (vaiTro == VaiTro.HOC_SINH) {
                    processHocSinh(row, startCol, i + 1, dataFormatter);
                    countHocSinh++;
                } else if (vaiTro == VaiTro.GIAO_VIEN) {
                    processGiaoVien(row, startCol, i + 1, dataFormatter);
                    countGiaoVien++;
                } else {
                    throw new AppExceptions(Errorcode.INVALID_DATA, "Dòng " + (i + 1) + ": Hiện tại hỗ trợ import cho vai trò: HOC_SINH, GIAO_VIEN, PHU_HUYNH.");
                }
            }

            // ĐỢT 2: Tạo tài khoản Phụ Huynh và liên kết Mối quan hệ
            for (Row row : parentRows) {
                int rowNum = row.getRowNum() + 1;
                String valCol0 = getCellString(row, 0, dataFormatter).toUpperCase();
                int startCol = isRoleString(valCol0) ? 0 : 1;

                processPhuHuynh(row, startCol, rowNum, dataFormatter);
                countPhuHuynh++;
            }

        } catch (AppExceptions ae) {
            String errorMsg = ae.getCustomMessage() != null ? ae.getCustomMessage() : ae.getErrorCode().getMessage();
            String jsonError = String.format("{\"error\": \"%s\"}", errorMsg.replace("\"", "\\\"").replace("\r", "").replace("\n", " "));
            loImportService.saveLogImport(adminUser, LoaiImport.TAI_KHOAN, file.getOriginalFilename(), TrangThaiImport.CO_LOI, 0, null, jsonError);
            throw ae; // Giữ nguyên thông báo lỗi chi tiết
        } catch (Exception e) {
            log.error("Lỗi khi đọc file Excel import: ", e);
            String errorMsg = "Lỗi đọc cấu trúc file Excel: " + e.getMessage();
            String jsonError = String.format("{\"error\": \"%s\"}", errorMsg.replace("\"", "\\\"").replace("\r", "").replace("\n", " "));
            loImportService.saveLogImport(adminUser, LoaiImport.TAI_KHOAN, file.getOriginalFilename(), TrangThaiImport.CO_LOI, 0, null, jsonError);
            throw new AppExceptions(Errorcode.INVALID_DATA, errorMsg);
        }

        int tongSo = countHocSinh + countGiaoVien + countPhuHuynh;
        String tomTatJson = String.format("{\"hoc_sinh\": %d, \"giao_vien\": %d, \"phu_huynh\": %d, \"tong_so\": %d}", countHocSinh, countGiaoVien, countPhuHuynh, tongSo);
        loImportService.saveLogImport(adminUser, LoaiImport.TAI_KHOAN, file.getOriginalFilename(), TrangThaiImport.THANH_CONG, tongSo, tomTatJson, null);

        return String.format("Import thành công: %d Học sinh, %d Giáo viên, %d Phụ huynh (đã tạo mối quan hệ với học sinh).", countHocSinh, countGiaoVien, countPhuHuynh);
    }


    private void processHocSinh(Row row, int startCol, int rowNum, DataFormatter df) {
        NguoiDung nguoiDung = createCommonUser(row, startCol, rowNum, VaiTro.HOC_SINH, df);

        HoSoHocSinh hoSo = new HoSoHocSinh();
        hoSo.setNguoiDung(nguoiDung);
        hoSo.setHoTen(getCellString(row, startCol + 3, df));
        hoSo.setGioiTinh(parseGioiTinh(getCellString(row, startCol + 6, df)));
        hoSo.setNgaySinh(parseDate(getCellString(row, startCol + 7, df)));
        hoSo.setTongXp(0);

        String maHS = getCellString(row, startCol + 8, df);
        if (maHS.isEmpty()) {
            maHS = "HS_" + nguoiDung.getTenDangNhap();
        } else if (hoSoHocSinhRepository.findByMaHocSinh(maHS) != null) {
            throw new AppExceptions(Errorcode.DATA_EXISTED, "Dòng " + rowNum + ": Mã học sinh '" + maHS + "' đã tồn tại!");
        }
        hoSo.setMaHocSinh(maHS);

        String lopHocStr = getCellString(row, startCol + 9, df);
        if (!lopHocStr.isEmpty()) {
            try {
                Long lopId = Long.parseLong(lopHocStr);
                lopHocRepository.findById(lopId).ifPresent(hoSo::setLopHoc);
            } catch (NumberFormatException ignored) {}
        }

        hoSoHocSinhRepository.save(hoSo);
    }

    private void processGiaoVien(Row row, int startCol, int rowNum, DataFormatter df) {
        NguoiDung nguoiDung = createCommonUser(row, startCol, rowNum, VaiTro.GIAO_VIEN, df);

        HoSoGiaoVien hoSo = new HoSoGiaoVien();
        hoSo.setNguoiDung(nguoiDung);
        hoSo.setHoTen(getCellString(row, startCol + 3, df));
        hoSo.setGioiTinh(parseGioiTinh(getCellString(row, startCol + 6, df)));
        hoSo.setNgaySinh(parseDate(getCellString(row, startCol + 7, df)));
        hoSo.setBoMon(getCellString(row, startCol + 9, df));

        String maGV = getCellString(row, startCol + 8, df);
        if (maGV.isEmpty()) {
            maGV = "GV_" + nguoiDung.getTenDangNhap();
        } else if (hoSoGiaoVienRepository.findByMaGiaoVien(maGV) != null) {
            throw new AppExceptions(Errorcode.DATA_EXISTED, "Dòng " + rowNum + ": Mã giáo viên '" + maGV + "' đã tồn tại!");
        }
        hoSo.setMaGiaoVien(maGV);

        hoSoGiaoVienRepository.save(hoSo);
    }

    private void processPhuHuynh(Row row, int startCol, int rowNum, DataFormatter df) {
        String maCon = getCellString(row, startCol + 10, df);
        String hoTen = getCellString(row, startCol + 3, df);

        if (maCon.isEmpty()) {
            throw new AppExceptions(Errorcode.INVALID_DATA, "Dòng " + rowNum + ": BẮT BUỘC phải nhập Mã học sinh hoặc Tên đăng nhập của con (ở cột Mã con) khi import Phụ huynh '" + hoTen + "'!");
        }

        // Kiểm tra bắt buộc tài khoản học sinh tồn tại
        HoSoHocSinh hocSinh = hoSoHocSinhRepository.findByMaHocSinh(maCon);
        if (hocSinh == null) {
            NguoiDung hsUser = nguoiDungRepository.findByTenDangNhap(maCon).orElse(null);
            if (hsUser != null) {
                hocSinh = hsUser.getHoSoHocSinh();
            }
        }
        if (hocSinh == null) {
            throw new AppExceptions(Errorcode.DATA_NOT_FOUND, "Dòng " + rowNum + ": Không tìm thấy tài khoản học sinh nào với Mã hoặc Tên đăng nhập là '" + maCon + "'. Bắt buộc tài khoản học sinh phải tồn tại trước thì mới tạo được phụ huynh và mối quan hệ!");
        }

        // Tạo user Phụ Huynh
        NguoiDung nguoiDung = createCommonUser(row, startCol, rowNum, VaiTro.PHU_HUYNH, df);

        HoSoPhuHuynh phuHuynh = new HoSoPhuHuynh();
        phuHuynh.setNguoiDung(nguoiDung);
        phuHuynh.setHoTen(hoTen);
        String email = getCellString(row, startCol + 4, df);
        if (!email.isEmpty()) {
            phuHuynh.setEmailNhanThongBao(email);
        }
        phuHuynh = hoSoPhuHuynhRepository.save(phuHuynh);

        // Tạo mối quan hệ phụ huynh - học sinh
        String quanHe = getCellString(row, startCol + 11, df);
        if (quanHe.isEmpty()) quanHe = "Phụ huynh";

        PhuHuynhHocSinh lienKet = PhuHuynhHocSinh.builder()
                .phuHuynh(phuHuynh)
                .hocSinh(hocSinh)
                .quanHe(quanHe)
                .build();

        phuHuynhHocSinhRepository.save(lienKet);
    }

    private NguoiDung createCommonUser(Row row, int startCol, int rowNum, VaiTro vaiTro, DataFormatter df) {
        String tenDangNhap = getCellString(row, startCol + 1, df);
        String matKhau = getCellString(row, startCol + 2, df);
        String hoTen = getCellString(row, startCol + 3, df);
        String email = getCellString(row, startCol + 4, df);
        String sdt = getCellString(row, startCol + 5, df);

        if (tenDangNhap.isEmpty()) {
            throw new AppExceptions(Errorcode.INVALID_DATA, "Dòng " + rowNum + ": Tên đăng nhập không được để trống!");
        }
        if (hoTen.isEmpty()) {
            throw new AppExceptions(Errorcode.INVALID_DATA, "Dòng " + rowNum + ": Họ tên không được để trống!");
        }
        if (nguoiDungRepository.findByTenDangNhap(tenDangNhap).isPresent()) {
            throw new AppExceptions(Errorcode.DATA_EXISTED, "Dòng " + rowNum + ": Tên đăng nhập '" + tenDangNhap + "' đã tồn tại trong hệ thống!");
        }
        if (!email.isEmpty() && nguoiDungRepository.findByEmail(email).isPresent()) {
            throw new AppExceptions(Errorcode.DATA_EXISTED, "Dòng " + rowNum + ": Email '" + email + "' đã được sử dụng cho tài khoản khác!");
        }

        NguoiDung user = new NguoiDung();
        user.setTenDangNhap(tenDangNhap);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setMatKhauHash(passwordEncoder.encode(matKhau.isEmpty() ? defaultResetPassword : matKhau));
        user.setVaiTro(vaiTro);
        user.setTrangThai(TrangThaiNguoiDung.ACTIVE);
        user.setEmail(email.isEmpty() ? null : email);
        user.setSoDienThoai(sdt.isEmpty() ? null : sdt);
        user.setBatBuocDoiMk(false);

        return nguoiDungRepository.save(user);
    }

    private boolean isRoleString(String str) {
        return "HOC_SINH".equals(str) || "HỌC SINH".equalsIgnoreCase(str) ||
               "GIAO_VIEN".equals(str) || "GIÁO VIEN".equalsIgnoreCase(str) || "GIÁO VIÊN".equalsIgnoreCase(str) ||
               "PHU_HUYNH".equals(str) || "PHỤ HUYNH".equalsIgnoreCase(str);
    }

    private VaiTro parseVaiTro(String str, int rowNum) {
        if ("HOC_SINH".equals(str) || "HỌC SINH".equalsIgnoreCase(str)) return VaiTro.HOC_SINH;
        if ("GIAO_VIEN".equals(str) || "GIÁO VIÊN".equalsIgnoreCase(str) || "GIÁO VIEN".equalsIgnoreCase(str)) return VaiTro.GIAO_VIEN;
        if ("PHU_HUYNH".equals(str) || "PHỤ HUYNH".equalsIgnoreCase(str)) return VaiTro.PHU_HUYNH;
        throw new AppExceptions(Errorcode.INVALID_DATA, "Dòng " + rowNum + ": Vai trò '" + str + "' không hợp lệ. Vui lòng nhập: HOC_SINH, GIAO_VIEN hoặc PHU_HUYNH.");
    }

    private GioiTinh parseGioiTinh(String str) {
        if (str == null || str.isEmpty()) return GioiTinh.KHAC;
        String upper = str.trim().toUpperCase();
        if ("NAM".equals(upper)) return GioiTinh.NAM;
        if ("NỮ".equalsIgnoreCase(upper) || "NU".equals(upper)) return GioiTinh.NU;
        return GioiTinh.KHAC;
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) return null;
        String[] patterns = {"dd/MM/yyyy", "yyyy-MM-dd", "dd-MM-yyyy", "d/M/yyyy"};
        for (String p : patterns) {
            try {
                return LocalDate.parse(dateStr.trim(), DateTimeFormatter.ofPattern(p));
            } catch (DateTimeParseException ignored) {}
        }
        return null;
    }

    private String getCellString(Row row, int colIdx, DataFormatter df) {
        Cell cell = row.getCell(colIdx);
        if (cell == null) return "";
        return df.formatCellValue(cell).trim();
    }

    private boolean isRowEmpty(Row row, DataFormatter df) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && !df.formatCellValue(cell).trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }
}
