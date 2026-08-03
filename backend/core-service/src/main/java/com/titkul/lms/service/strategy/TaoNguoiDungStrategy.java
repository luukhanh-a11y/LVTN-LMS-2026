package com.titkul.lms.service.strategy;

import com.titkul.lms.dto.TaoNguoiDungRequest;
import com.titkul.lms.entity.VaiTro;
import com.titkul.lms.entity.NguoiDung;

public interface TaoNguoiDungStrategy {
    boolean supports(String roleStr);
    NguoiDung createUser(TaoNguoiDungRequest dto, String defaultPasswordHash);
}
