package com.LMS.LVTN.exception;

import com.LMS.LVTN.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.stream.Collectors;


@ControllerAdvice
@Slf4j
public class handleExceptions {

    // SỬA LẠI HÀM NÀY
    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse> xulyRuntimeException (RuntimeException exception)
    {
        // In lỗi ra console để bạn biết nó chết ở đâu (Quan trọng!)
        log.error("Exception occurred: ", exception);

        ApiResponse apiResponse = new ApiResponse();

        // Thay vì UNAUTHORIZED, hãy dùng UNCATEGORIZED (9999)
        apiResponse.setCode(Errorcode.UNCATEGORIZED.getCode());

        // Lấy message lỗi chính
        String message = exception.getMessage();

        // NẾU CÓ NGUYÊN NHÂN SÂU XA (ROOT CAUSE), NỐI THÊM VÀO ĐỂ DỄ ĐỌC LỖI
        if (exception.getCause() != null) {
            message += " -> Caused by: " + exception.getCause().getMessage();
            // Đào sâu thêm 1 lớp nữa nếu có (thường là lỗi SQL nằm ở đây)
            if (exception.getCause().getCause() != null) {
                message += " -> Root: " + exception.getCause().getCause().getMessage();
            }
        }

        // Kèm theo message thực tế của lỗi để debug
        apiResponse.setMessage(Errorcode.UNCATEGORIZED.getMessage() + ": " + exception.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = AppExceptions.class)
    ResponseEntity<ApiResponse> xulyAppexception (AppExceptions exception)
    {
        Errorcode errorCode=exception.getErrorCode();
        return ResponseEntity.status(errorCode.getStatus()).body(
                ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> xulyValidation(MethodArgumentNotValidException exception) {

        // Thử parse ErrorCode trước, nếu không có thì lấy message gốc
        String enumKey = exception.getFieldError().getDefaultMessage();

        try {
            Errorcode errorCode = Errorcode.valueOf(enumKey);
            return ResponseEntity.status(errorCode.getStatus()).body(
                    ApiResponse.builder()
                            .code(errorCode.getCode())
                            .message(errorCode.getMessage())
                            .build()
            );
        } catch (IllegalArgumentException e) {
            // Không tìm thấy ErrorCode → trả message gốc
            String message = exception.getBindingResult()
                    .getFieldErrors()
                    .stream()
                    .map(err -> err.getField() + ": " + err.getDefaultMessage())
                    .collect(Collectors.joining(", "));

            return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                            .code(400)
                            .message(message)
                            .build()
            );
        }
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        Errorcode errorCode = Errorcode.PAYLOAD_TOO_LARGE;

        return ResponseEntity.status(errorCode.getStatus()).body(
                ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build()
        );
    }

}
