package com.titkul.lms.service;

import com.titkul.lms.dto.HocLieuPhanLoaiRequest;
import com.titkul.lms.dto.HocLieuNoiBoRequest;
import com.titkul.lms.entity.HocLieu;
import com.titkul.lms.entity.LoaiHocLieu;
import com.titkul.lms.entity.NguonGocHocLieu;
import com.titkul.lms.entity.MonHoc;
import com.titkul.lms.entity.HoSoGiaoVien;
import com.titkul.lms.repository.HocLieuRepository;
import com.titkul.lms.repository.MonHocRepository;
import com.titkul.lms.repository.HoSoGiaoVienRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HocLieuService {

    private final HocLieuRepository hocLieuRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final MonHocRepository subjectRepository;

    // Upsert theo h5pContentId, tránh tạo trùng khi GV sửa lại bài.
    public HocLieu createOrUpdateFromH5p(HocLieuNoiBoRequest dto) {
        if (dto.getH5pContentId() == null || dto.getH5pContentId().isBlank()) {
            throw new IllegalArgumentException("h5pContentId không được để trống!");
        }

        HocLieu hocLieu = hocLieuRepository.findByH5pContentId(dto.getH5pContentId())
                .orElseGet(HocLieu::new);

        hocLieu.setH5pContentId(dto.getH5pContentId());
        hocLieu.setTitle(dto.getTieuDe());
        hocLieu.setType(LoaiHocLieu.valueOf(dto.getLoaiHocLieu()));
        hocLieu.setOrigin(NguonGocHocLieu.valueOf(dto.getNguonGoc()));

        if (dto.getGiaoVienId() != null) {
            HoSoGiaoVien teacher = teacherProfileRepository.findByNguoiDung_NguoiDungId(dto.getGiaoVienId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Không tìm thấy Giáo viên với User ID: " + dto.getGiaoVienId()));
            hocLieu.setTeacher(teacher);
        }

        // Chỉ set khi NestJS gửi kèm (lúc tạo mới) — null nghĩa là không đổi, tránh xóa mất
        // phân loại đã có mỗi khi GV sửa lại nội dung (upsert này chạy cho cả create lẫn update).
        if (dto.getKhoiLop() != null) {
            hocLieu.setGrade(dto.getKhoiLop());
        }
        if (dto.getMonHocId() != null) {
            MonHoc subject = subjectRepository.findById(dto.getMonHocId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Môn học với ID: " + dto.getMonHocId()));
            hocLieu.setSubject(subject);
        }

        return hocLieuRepository.save(hocLieu);
    }

    public List<HocLieu> listAll() {
        return hocLieuRepository.findAll();
    }

    public List<HocLieu> listByTeacherUserId(Long userId) {
        return hocLieuRepository.findByTeacher_NguoiDung_NguoiDungId(userId);
    }

    public HocLieu getById(Long id) {
        return hocLieuRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy học liệu với ID: " + id));
    }

    // Chỉ chủ sở hữu hoặc Admin mới được xóa.
    public void delete(Long id, String requesterUsername, boolean requesterIsAdmin) {
        HocLieu hocLieu = getById(id);
        boolean isOwner = hocLieu.getTeacher() != null
                && hocLieu.getTeacher().getNguoiDung() != null
                && hocLieu.getTeacher().getNguoiDung().getTenDangNhap().equals(requesterUsername);
        if (!requesterIsAdmin && !isOwner) {
            throw new IllegalArgumentException("Bạn không có quyền xóa học liệu này.");
        }
        hocLieuRepository.delete(hocLieu);
    }

    // Chỉ chủ sở hữu mới được gán Khối/Môn cho học liệu của mình.
    public HocLieu updateClassification(Long id, HocLieuPhanLoaiRequest dto, String requesterUsername) {
        HocLieu hocLieu = getById(id);
        boolean isOwner = hocLieu.getTeacher() != null
                && hocLieu.getTeacher().getNguoiDung() != null
                && hocLieu.getTeacher().getNguoiDung().getTenDangNhap().equals(requesterUsername);
        if (!isOwner) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa học liệu này.");
        }

        hocLieu.setGrade(dto.getGrade());
        if (dto.getSubjectId() != null) {
            MonHoc subject = subjectRepository.findById(dto.getSubjectId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Môn học với ID: " + dto.getSubjectId()));
            hocLieu.setSubject(subject);
        } else {
            hocLieu.setSubject(null);
        }

        return hocLieuRepository.save(hocLieu);
    }
}
