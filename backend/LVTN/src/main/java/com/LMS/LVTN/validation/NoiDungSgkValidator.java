package com.LMS.LVTN.validation;

import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.repository.DangBaiRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

// Trước đây quy tắc "không giao bài từ Sách giáo khoa" bị viết tay lặp lại ở
// BaiTapService và 2 lần trong ChiTietBaiTapService, mỗi nơi trả một Errorcode
// khác nhau cho cùng 1 vi phạm. Gom về đây để chỉ có 1 hành vi/1 thông báo lỗi.
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NoiDungSgkValidator {

    DangBaiRepository dangBaiRepository;

    public void validateKhongPhaiSgk(Integer dangBaiId) {
        if (dangBaiId != null && dangBaiRepository.isSachGiaoKhoa(dangBaiId)) {
            throw new AppExceptions(Errorcode.INVALID_DATA, "Không thể giao bài tập từ Sách giáo khoa");
        }
    }
}
