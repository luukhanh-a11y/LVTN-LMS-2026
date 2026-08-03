package com.titkul.lms.service;

import com.titkul.lms.entity.LopHoc;
import com.titkul.lms.repository.LopHocRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LopHocService {

    private final LopHocRepository classRoomRepository;
    private final com.titkul.lms.repository.HoSoGiaoVienRepository teacherProfileRepository;
    private final com.titkul.lms.repository.HoSoHocSinhRepository studentProfileRepository;
    private final com.titkul.lms.repository.NamHocRepository academicYearRepository;

    public List<LopHoc> getAllClasses() {
        List<LopHoc> classes = classRoomRepository.findAll();
        for (LopHoc c : classes) {
            c.setSiSoHienTai((int) studentProfileRepository.countByLopHoc_LopHocId(c.getLopHocId()));
        }
        return classes;
    }

    public LopHoc getClassById(Long id) {
        LopHoc c = classRoomRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        c.setSiSoHienTai((int) studentProfileRepository.countByLopHoc_LopHocId(c.getLopHocId()));
        return c;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<com.titkul.lms.dto.HocSinhLopResponse> getStudentsByClassId(Long classId) {
        return studentProfileRepository.findByLopHoc_LopHocId(classId).stream().map(student -> {
            com.titkul.lms.dto.HocSinhLopResponse dto = new com.titkul.lms.dto.HocSinhLopResponse();
            dto.setId(student.getNguoiDung().getNguoiDungId());
            dto.setCode(student.getMaHocSinh());
            dto.setName(student.getHoTen());
            if (student.getPhuHuynh() != null && student.getPhuHuynh().getNguoiDung() != null) {
                dto.setParentName(student.getPhuHuynh().getHoTen());
                dto.setPhone(student.getPhuHuynh().getNguoiDung().getSoDienThoai() != null ? student.getPhuHuynh().getNguoiDung().getSoDienThoai() : "");
            } else {
                dto.setParentName("");
                dto.setPhone(student.getNguoiDung().getSoDienThoai() != null ? student.getNguoiDung().getSoDienThoai() : "");
            }
            dto.setDob(student.getNgaySinh() != null ? student.getNgaySinh().toString() : "");
            dto.setEvaluation("Chưa đánh giá");
            dto.setAttendance(100);
            dto.setBadges(student.getTongXp());
            return dto;
        }).toList();
    }

    public LopHoc createClass(com.titkul.lms.dto.LopHocRequest dto) {
        com.titkul.lms.entity.NamHoc academicYear = academicYearRepository.findById(dto.getAcademicYearId())
                .orElseThrow(() -> new RuntimeException("Niên khóa không tồn tại"));

        if (classRoomRepository.existsByTenLopAndNamHoc(dto.getName(), academicYear)) {
            throw new RuntimeException("Lớp học đã tồn tại trong niên khóa này");
        }

        LopHoc classRoom = new LopHoc();
        classRoom.setTenLop(dto.getName());
        classRoom.setKhoiLop(dto.getGrade());
        classRoom.setNamHoc(academicYear);
        classRoom.setSiSoToiDa(dto.getMaxCapacity());
        classRoom.setTrangThai(com.titkul.lms.entity.TrangThaiLopHoc.ACTIVE);

        if (dto.getHomeroomTeacherId() != null) {
            com.titkul.lms.entity.HoSoGiaoVien teacher = teacherProfileRepository.findById(dto.getHomeroomTeacherId())
                    .orElseThrow(() -> new RuntimeException("Giáo viên không tồn tại"));
            classRoom.setGiaoVienChuNhiem(teacher);
        }

        return classRoomRepository.save(classRoom);
    }

    public LopHoc updateClass(Long id, com.titkul.lms.dto.LopHocRequest dto) {
        LopHoc classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lớp học không tồn tại"));

        com.titkul.lms.entity.NamHoc academicYear = academicYearRepository.findById(dto.getAcademicYearId())
                .orElseThrow(() -> new RuntimeException("Niên khóa không tồn tại"));

        if (!classRoom.getTenLop().equals(dto.getName()) || !classRoom.getNamHoc().getNamHocId().equals(dto.getAcademicYearId())) {
            if (classRoomRepository.existsByTenLopAndNamHoc(dto.getName(), academicYear)) {
                throw new RuntimeException("Tên lớp đã tồn tại trong niên khóa này");
            }
        }

        classRoom.setTenLop(dto.getName());
        classRoom.setKhoiLop(dto.getGrade());
        classRoom.setNamHoc(academicYear);
        classRoom.setSiSoToiDa(dto.getMaxCapacity());

        if (dto.getHomeroomTeacherId() != null) {
            com.titkul.lms.entity.HoSoGiaoVien teacher = teacherProfileRepository.findById(dto.getHomeroomTeacherId())
                    .orElseThrow(() -> new RuntimeException("Giáo viên không tồn tại"));
            classRoom.setGiaoVienChuNhiem(teacher);
        } else {
            classRoom.setGiaoVienChuNhiem(null);
        }

        return classRoomRepository.save(classRoom);
    }

    public LopHoc toggleStatus(Long id) {
        LopHoc classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lớp học không tồn tại"));

        if (classRoom.getTrangThai() == com.titkul.lms.entity.TrangThaiLopHoc.ACTIVE) {
            classRoom.setTrangThai(com.titkul.lms.entity.TrangThaiLopHoc.DONG_BANG);
        } else {
            classRoom.setTrangThai(com.titkul.lms.entity.TrangThaiLopHoc.ACTIVE);
        }
        return classRoomRepository.save(classRoom);
    }
}
