package com.titkul.lms.service;

import com.titkul.lms.entity.CauHinhHeThong;
import com.titkul.lms.repository.CauHinhHeThongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CauHinhHeThongService {

    private final CauHinhHeThongRepository systemConfigRepository;

    @Transactional(readOnly = true)
    public CauHinhHeThong getSystemConfig() {
        return systemConfigRepository.findAll().stream().findFirst().orElseGet(() -> {
            CauHinhHeThong config = new CauHinhHeThong();
            config.setId(1L);
            return config;
        });
    }

    @Transactional
    public CauHinhHeThong updateSystemConfig(CauHinhHeThong newConfig) {
        CauHinhHeThong config = getSystemConfig();
        config.setTenTruong(newConfig.getTenTruong());
        config.setNamHocHienTai(newConfig.getNamHocHienTai());
        config.setNamHocCu(newConfig.getNamHocHienTai());
        config.setHocKyHienTai(newConfig.getHocKyHienTai());
        config.setLogoUrl(newConfig.getLogoUrl());

        if (newConfig.getDanhSachKhoi() != null) {
            config.setDanhSachKhoi(newConfig.getDanhSachKhoi());
        }
        if (newConfig.getDanhSachMon() != null) {
            config.setDanhSachMon(newConfig.getDanhSachMon());
        }

        return systemConfigRepository.save(config);
    }
}
