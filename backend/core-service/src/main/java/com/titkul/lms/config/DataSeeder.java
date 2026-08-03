package com.titkul.lms.config;

import com.titkul.lms.entity.LopHoc;
import com.titkul.lms.entity.VaiTro;
import com.titkul.lms.entity.HoSoGiaoVien;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.entity.TrangThaiNguoiDung;
import com.titkul.lms.entity.NamHoc;
import com.titkul.lms.repository.NamHocRepository;
import com.titkul.lms.repository.LopHocRepository;
import com.titkul.lms.repository.HoSoGiaoVienRepository;
import com.titkul.lms.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final NguoiDungRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final LopHocRepository classRoomRepository;
    private final NamHocRepository academicYearRepository;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByTenDangNhap("HS001")) {
            NguoiDung user = new NguoiDung();
            user.setTenDangNhap("HS001");
            user.setMatKhauHash(passwordEncoder.encode("Password123!"));
            user.setVaiTro(VaiTro.HOC_SINH);
            user.setTrangThai(TrangThaiNguoiDung.ACTIVE);
            user.setBatBuocDoiMk(false);
            userRepository.save(user);
            System.out.println("====== SEEDED TEST USER: HS001 / Password123! ======");
        }

        if (!userRepository.existsByTenDangNhap("GV001")) {
            NguoiDung teacherUser = new NguoiDung();
            teacherUser.setTenDangNhap("GV001");
            teacherUser.setMatKhauHash(passwordEncoder.encode("Password123!"));
            teacherUser.setVaiTro(VaiTro.GIAO_VIEN);
            teacherUser.setTrangThai(TrangThaiNguoiDung.ACTIVE);
            teacherUser.setBatBuocDoiMk(false);
            userRepository.save(teacherUser);
        }

        if (!userRepository.existsByTenDangNhap("AD001")) {
            NguoiDung adminUser = new NguoiDung();
            adminUser.setTenDangNhap("AD001");
            adminUser.setMatKhauHash(passwordEncoder.encode("Password123!"));
            adminUser.setVaiTro(VaiTro.ADMIN);
            adminUser.setTrangThai(TrangThaiNguoiDung.ACTIVE);
            adminUser.setBatBuocDoiMk(false);
            userRepository.save(adminUser);
            System.out.println("====== SEEDED TEST ADMIN: AD001 / Password123! ======");
        }

        if (!userRepository.existsByTenDangNhap("PH001")) {
            NguoiDung parentUser = new NguoiDung();
            parentUser.setTenDangNhap("PH001");
            parentUser.setMatKhauHash(passwordEncoder.encode("Password123!"));
            parentUser.setVaiTro(VaiTro.PHU_HUYNH);
            parentUser.setTrangThai(TrangThaiNguoiDung.ACTIVE);
            parentUser.setBatBuocDoiMk(false);
            userRepository.save(parentUser);
            System.out.println("====== SEEDED TEST PARENT: PH001 / Password123! ======");
        }

        // Ensure GV001 always has a HoSoGiaoVien, regardless of classroom count
        NguoiDung teacherUser = userRepository.findByTenDangNhap("GV001").orElseThrow();
        HoSoGiaoVien teacherProfile = teacherProfileRepository.findByNguoiDung_NguoiDungId(teacherUser.getNguoiDungId())
                .orElseGet(() -> {
                    HoSoGiaoVien p = new HoSoGiaoVien();
                    p.setNguoiDung(teacherUser);
                    p.setMaGiaoVien("GV001");
                    p.setHoTen("Nguyễn Văn GV");
                    p.setBoMon("Toán");
                    return teacherProfileRepository.save(p);
                });

        if (classRoomRepository.count() == 0) {
            NamHoc academicYear = academicYearRepository.findByTenNamHoc("2026-2027")
                    .orElseGet(() -> {
                        NamHoc newYear = new NamHoc();
                        newYear.setTenNamHoc("2026-2027");
                        newYear.setNgayBatDau(java.time.LocalDate.of(2026, 9, 5));
                        newYear.setNgayKetThuc(java.time.LocalDate.of(2027, 5, 31));
                        return academicYearRepository.save(newYear);
                    });

            LopHoc classRoom = new LopHoc();
            classRoom.setTenLop("Lớp 5A");
            classRoom.setKhoiLop((short) 5);
            classRoom.setNamHoc(academicYear);
            classRoom.setGiaoVienChuNhiem(teacherProfile);
            classRoom.setSiSoToiDa((short) 40);
            classRoomRepository.save(classRoom);

            System.out.println("====== SEEDED TEST CLASSROOM: Lớp 5A ======");
        }

        System.out.println("====== SEEDED TEST TEACHER: GV001 / Password123! ======");
    }
}
