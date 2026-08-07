package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.response.AdminDashboardResponse;
import com.LMS.LVTN.repository.HoSoGiaoVienRepository;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.HoSoPhuHuynhRepository;
import com.LMS.LVTN.repository.LopHocRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminService {

    HoSoHocSinhRepository hoSoHocSinhRepository;
    HoSoGiaoVienRepository hoSoGiaoVienRepository;
    HoSoPhuHuynhRepository hoSoPhuHuynhRepository;
    LopHocRepository lopHocRepository;

    public AdminDashboardResponse getDashboardStats() {
        long totalStudents = hoSoHocSinhRepository.count();
        long totalTeachers = hoSoGiaoVienRepository.count();
        long totalParents = hoSoPhuHuynhRepository.count();
        long totalClasses = lopHocRepository.count();

        // Mặc định lớp đang hoạt động là số lớp có trong DB
        long activeClasses = totalClasses;

        return AdminDashboardResponse.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalParents(totalParents)
                .totalClasses(totalClasses)
                .activeClasses(activeClasses)
                .trafficData(Collections.emptyList())
                .systemWarnings(Collections.emptyList())
                .build();
    }
}
