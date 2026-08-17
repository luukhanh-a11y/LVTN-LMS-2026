package com.LMS.LVTN.validation;

import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.repository.NguoiDungRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

// Trước đây quy tắc "tenDangNhap/email không trùng" được viết riêng ở
// NguoiDungService (existsBy...) và NguoiDungExcelService (findBy...isPresent()),
// 2 cách khác nhau cho cùng 1 luật. Gom về đây để chỉ có 1 hành vi.
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NguoiDungUniquenessValidator {

    NguoiDungRepository nguoiDungRepository;

    public void validateTenDangNhapUnique(String tenDangNhap) {
        validateTenDangNhapUnique(tenDangNhap, "");
    }

    public void validateTenDangNhapUnique(String tenDangNhap, String context) {
        if (tenDangNhap != null && !tenDangNhap.isEmpty() && nguoiDungRepository.existsByTenDangNhap(tenDangNhap)) {
            throw new AppExceptions(Errorcode.DATA_EXISTED,
                    context + "Tên đăng nhập '" + tenDangNhap + "' đã tồn tại trong hệ thống");
        }
    }

    public void validateEmailUnique(String email) {
        validateEmailUnique(email, "");
    }

    public void validateEmailUnique(String email, String context) {
        if (email != null && !email.isEmpty() && nguoiDungRepository.existsByEmail(email)) {
            throw new AppExceptions(Errorcode.DATA_EXISTED,
                    context + "Email '" + email + "' đã được sử dụng cho tài khoản khác");
        }
    }
}
