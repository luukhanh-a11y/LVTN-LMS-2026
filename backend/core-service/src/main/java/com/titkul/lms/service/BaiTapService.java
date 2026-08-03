package com.titkul.lms.service;

import com.titkul.lms.dto.BaiTapRequest;
import com.titkul.lms.entity.BaiTap;
import com.titkul.lms.entity.LoaiBaiTap;
import com.titkul.lms.entity.LopHoc;
import com.titkul.lms.entity.TrangThaiLopHoc;
import com.titkul.lms.entity.HocLieu;
import com.titkul.lms.entity.HoSoGiaoVien;
import com.titkul.lms.repository.BaiTapRepository;
import com.titkul.lms.repository.LopHocRepository;
import com.titkul.lms.repository.HocLieuRepository;
import com.titkul.lms.repository.HoSoGiaoVienRepository;
import com.titkul.lms.repository.BaiHocRepository;
import com.titkul.lms.repository.DangBaiRepository;
import com.titkul.lms.repository.HocKyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BaiTapService {

    private final BaiTapRepository assignmentRepository;
    private final LopHocRepository classRoomRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final BaiHocRepository baiHocRepository;
    private final DangBaiRepository contentNodeRepository;
    private final HocKyRepository semesterRepository;
    private final HocLieuRepository hocLieuRepository;

    public BaiTap createAssignment(BaiTapRequest dto) {
        BaiTap assignment = new BaiTap();
        assignment.setTieuDe(dto.getTitle());
        assignment.setMoTa(dto.getDescription());
        assignment.setDeadline(dto.getDeadline());
        // DB có constraint chk_nop_lai: cho_nop_lai=false đòi so_lan_nop_lai_toi_da=0,
        // cho_nop_lai=true đòi so_lan_nop_lai_toi_da trong khoảng 1-10 — 2 field phải khớp nhau.
        if (dto.getMaxResubmitCount() != null && dto.getMaxResubmitCount() > 10) {
            throw new IllegalArgumentException("Số lần nộp lại tối đa không được vượt quá 10.");
        }
        boolean choPhepNopLai = dto.getMaxResubmitCount() != null && dto.getMaxResubmitCount() > 0;
        assignment.setChoNopLai(choPhepNopLai);
        assignment.setSoLanNopLaiToiDa(choPhepNopLai ? dto.getMaxResubmitCount() : 0);

        if (dto.getType() != null) {
            assignment.setLoaiBaiTap(LoaiBaiTap.valueOf(dto.getType()));
        } else {
            assignment.setLoaiBaiTap(LoaiBaiTap.TU_LUAN); // Default
        }

        if (dto.getClassId() != null) {
            LopHoc classRoom = classRoomRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy Lớp học với ID: " + dto.getClassId()));
            if (classRoom.getTrangThai() != TrangThaiLopHoc.ACTIVE) {
                throw new IllegalArgumentException("Lớp học đã đóng băng (DONG_BANG), không thể giao bài tập mới.");
            }
            assignment.setLopHoc(classRoom);
        } else {
            throw new IllegalArgumentException("classId không được để trống!");
        }

        if (dto.getTeacherId() != null) {
            HoSoGiaoVien teacher = teacherProfileRepository.findByNguoiDung_NguoiDungId(dto.getTeacherId())
                    .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy Giáo viên với User ID: " + dto.getTeacherId()));
            assignment.setGiaoVien(teacher);
        } else {
            throw new IllegalArgumentException("teacherId không được để trống!");
        }

        if (dto.getLessonId() != null) {
            assignment.setBaiHoc(baiHocRepository.findById(dto.getLessonId()).orElse(null));
        }
        if (dto.getContentNodeId() != null) {
            assignment.setDangBai(contentNodeRepository.findById(dto.getContentNodeId()).orElse(null));
        }
        if (dto.getHocLieuId() != null) {
            HocLieu hocLieu = hocLieuRepository.findById(dto.getHocLieuId())
                    .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy Học liệu với ID: " + dto.getHocLieuId()));
            assignment.setHocLieu(hocLieu);
        }
        if (dto.getSemesterId() != null) {
            assignment.setHocKy(semesterRepository.findById(dto.getSemesterId()).orElse(null));
        }

        if (assignment.getLoaiBaiTap() == LoaiBaiTap.H5P) {
            String h5pContentId = assignment.getHocLieu() != null ? assignment.getHocLieu().getH5pContentId()
                    : assignment.getDangBai() != null ? assignment.getDangBai().getH5pNoiDungId() : null;
            if (h5pContentId == null || h5pContentId.isBlank()) {
                throw new IllegalArgumentException("Bài tập H5P phải gắn với một học liệu (hoặc bài giảng) đã có nội dung H5P.");
            }
        }

        if (assignment.getLoaiBaiTap() == LoaiBaiTap.TRAC_NGHIEM) {
            if (assignment.getDangBai() == null || assignment.getDangBai().getDapAnChuan() == null) {
                throw new IllegalArgumentException("Bài tập bộ sách phải gắn với một bài đã được soạn nội dung quiz (trắc nghiệm/nối cặp/điền khuyết).");
            }
        }

        return assignmentRepository.save(assignment);
    }

    public org.springframework.data.domain.Page<BaiTap> getAssignmentsByClassId(Long classId, org.springframework.data.domain.Pageable pageable) {
        return assignmentRepository.findByLopHoc_LopHocId(classId, pageable);
    }
}
