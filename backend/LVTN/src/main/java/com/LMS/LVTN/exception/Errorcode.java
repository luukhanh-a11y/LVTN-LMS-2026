package com.LMS.LVTN.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum Errorcode {

    UNCATEGORIZED(9999, "Lỗi hệ thống chưa phân loại", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(9998, "Key cấu hình không hợp lệ", HttpStatus.BAD_REQUEST),
    PAYLOAD_TOO_LARGE(9001, "Dung lượng file vượt quá giới hạn", HttpStatus.PAYLOAD_TOO_LARGE),
    DATA_EXISTED(9002, "Dữ liệu đã tồn tại", HttpStatus.CONFLICT),
    REQUEST_IS_PROCESSED(9003, "Yêu cầu đã được xử lý", HttpStatus.CONFLICT),
    USER_NOT_FOUND(1001, "Người dùng không tồn tại", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1002, "Không xác thực", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1003, "Không có quyền truy cập", HttpStatus.FORBIDDEN),
    INVALID_TOKEN(1004, "Token không hợp lệ", HttpStatus.UNAUTHORIZED),
    THONG_BAO_NOT_FOUND(1005, "Thông báo không tồn tại", HttpStatus.NOT_FOUND),
    SACH_NOT_FOUND(1006, "Sách không tồn tại", HttpStatus.NOT_FOUND),
    PHIEU_HO_TRO_NOT_FOUND(1007, "Phiếu hỗ trợ không tồn tại", HttpStatus.NOT_FOUND),
    NAM_HOC_NOT_FOUND(1008, "Năm học không tồn tại", HttpStatus.NOT_FOUND),
    MON_HOC_NOT_FOUND(1009, "Môn học không tồn tại", HttpStatus.NOT_FOUND),
    LOP_HOC_NOT_FOUND(1010, "Lớp học không tồn tại", HttpStatus.NOT_FOUND),
    HO_SO_PHU_HUYNH_NOT_FOUND(1011, "Hồ sơ phụ huynh không tồn tại", HttpStatus.NOT_FOUND),
    HO_SO_HOC_SINH_NOT_FOUND(1012, "Hồ sơ học sinh không tồn tại", HttpStatus.NOT_FOUND),
    HO_SO_GIAO_VIEN_NOT_FOUND(1013, "Hồ sơ giáo viên không tồn tại", HttpStatus.NOT_FOUND),
    CHU_DE_NOT_FOUND(1014, "Chủ đề không tồn tại", HttpStatus.NOT_FOUND),
    QUAN_HE_NOT_EXIST(1015,"Mối quan hệ này không thực sự tồn tại" ,HttpStatus.NOT_FOUND),
    USER_INACTIVE(1016, "Tài khoản người dùng đã bị khóa hoặc không hoạt động", HttpStatus.FORBIDDEN),
    DANG_BAI_NOT_FOUND(1017, "Dạng bài không tồn tại", HttpStatus.NOT_FOUND),
    BAI_HOC_NOT_FOUND(1018, "Bài học không tồn tại", HttpStatus.NOT_FOUND),
    GAME_TYPE_UNSUPPORTED(1019, "Loại game không được hỗ trợ", HttpStatus.BAD_REQUEST),
    JSON_PROCESSING_ERROR(1020, "Lỗi xử lý JSON", HttpStatus.INTERNAL_SERVER_ERROR),
    TOKEN_GENERATION_FAILED(1021, "Không thể tạo token", HttpStatus.INTERNAL_SERVER_ERROR),
    DATA_NOT_FOUND(1022, "Dữ liệu không tồn tại", HttpStatus.NOT_FOUND),
    INVALID_DATA(1023, "Dữ liệu không hợp lệ", HttpStatus.BAD_REQUEST),
    LICH_SU_TU_HOC_NOT_FOUND(1024, "Lịch sử tự học không tồn tại", HttpStatus.NOT_FOUND),
    HOC_KY_NOT_FOUND(1024, "Học kỳ không tồn tại", HttpStatus.NOT_FOUND);






    private int code;
    private String message;
    private HttpStatus status;

    Errorcode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
