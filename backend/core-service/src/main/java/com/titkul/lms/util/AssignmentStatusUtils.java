package com.titkul.lms.util;

import com.titkul.lms.dto.BaiTapResponse;
import com.titkul.lms.entity.BaiTap;
import com.titkul.lms.entity.BaiNop;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class AssignmentStatusUtils {

    private static final DateTimeFormatter DEADLINE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private AssignmentStatusUtils() {}

    public static BaiTapResponse toDto(BaiTap assignment, BaiNop sub) {
        boolean isLate = false;
        String status;

        if (sub != null) {
            status = "DA_NOP";
        } else if (assignment.getDeadline() != null && assignment.getDeadline().isBefore(LocalDateTime.now())) {
            isLate = true;
            status = "QUA_HAN";
        } else {
            status = "CHUA_NOP";
        }

        return BaiTapResponse.builder()
                .id(assignment.getBaiTapId())
                .title(assignment.getTieuDe())
                .subject("Bài tập")
                .type(assignment.getLoaiBaiTap().name())
                .status(status)
                .deadline(assignment.getDeadline() != null
                        ? assignment.getDeadline().format(DEADLINE_FMT)
                        : "Không thời hạn")
                .timeRemaining(calcTimeRemaining(assignment, sub, isLate))
                .isLate(isLate)
                .build();
    }

    private static String calcTimeRemaining(BaiTap assignment, BaiNop sub, boolean isLate) {
        if (isLate || assignment.getDeadline() == null || sub != null) return "-";
        Duration d = Duration.between(LocalDateTime.now(), assignment.getDeadline());
        if (d.toDays() > 0) return d.toDays() + " ngày";
        if (d.toHours() > 0) return d.toHours() + " giờ";
        return d.toMinutes() + " phút";
    }
}
