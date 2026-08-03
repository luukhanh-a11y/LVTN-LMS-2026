package com.titkul.lms.service;

import com.titkul.lms.dto.DanhGiaRequest;
import com.titkul.lms.dto.BaiNopDetailResponse;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BaiNopService {

    private final BaiNopRepository submissionRepository;
    private final BaiTapRepository assignmentRepository;
    private final DanhGiaBaiLamRepository evaluationRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;
    private final HuyHieuTuDongService huyHieuTuDongService;

    public BaiNop submitAssignment(BaiNop submission) {
        com.titkul.lms.entity.BaiTap assignment = assignmentRepository.findById(submission.getBaiTap().getBaiTapId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy bài tập!"));

        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (now.isAfter(assignment.getDeadline())) {
            submission.setLaNopTre(true);
            submission.setTrangThai(com.titkul.lms.entity.TrangThaiBaiNop.NOP_TRE);
        } else {
            if (submission.getTrangThai() == null || submission.getTrangThai() == com.titkul.lms.entity.TrangThaiBaiNop.CHUA_NOP) {
                submission.setTrangThai(com.titkul.lms.entity.TrangThaiBaiNop.DA_NOP);
            }
        }

        submission.setThoiDiemNop(now);
        BaiNop saved = submissionRepository.save(submission);

        try {
            huyHieuTuDongService.kiemTraVaTraoHuyHieu(saved.getHocSinh().getHocSinhId());
        } catch (Exception e) {
            // Không được để lỗi xét huy hiệu làm hỏng luồng nộp bài chính
        }

        return saved;
    }

    public List<BaiNop> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByBaiTap_BaiTapId(assignmentId);
    }

    private static final DateTimeFormatter DETAIL_DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public BaiNopDetailResponse getSubmissionDetail(Long submissionId) {
        BaiNop submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy bài nộp!"));
        DanhGiaBaiLam evaluation = evaluationRepository.findByBaiNop_BaiNopId(submissionId).orElse(null);

        return BaiNopDetailResponse.builder()
                .id(submission.getBaiNopId())
                .studentName(submission.getHocSinh().getHoTen())
                .assignmentTitle(submission.getBaiTap().getTieuDe())
                .textContent(submission.getNoiDungText())
                .attachmentUrl(submission.getFileDinhKem())
                .autoScore(submission.getDiemTuDong())
                .xpEarned(submission.getXpNhanDuoc())
                .attemptNumber(submission.getSoLanLam())
                .status(submission.getTrangThai().name())
                .isLate(submission.getLaNopTre())
                .submittedAt(submission.getThoiDiemNop() != null ? submission.getThoiDiemNop().format(DETAIL_DATE_FMT) : null)
                .evaluationScore(evaluation != null ? evaluation.getDiemSo() : null)
                .evaluationGrade(evaluation != null && evaluation.getXepLoai() != null ? evaluation.getXepLoai().name() : null)
                .evaluationComment(evaluation != null ? evaluation.getNhanXet() : null)
                .evaluationAction(evaluation != null ? evaluation.getHanhDong().name() : null)
                .evaluatedAt(evaluation != null ? evaluation.getThoiDiemCham().format(DETAIL_DATE_FMT) : null)
                .build();
    }

    @Transactional
    public DanhGiaBaiLam evaluateSubmission(Long submissionId, DanhGiaRequest dto) {
        BaiNop submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Không tìm thấy bài nộp!"));

        if (submission.getBaiTap().getLopHoc().getTrangThai() != TrangThaiLopHoc.ACTIVE) {
            throw new IllegalArgumentException("Lớp học đã đóng băng (DONG_BANG), không thể chấm điểm bài mới.");
        }

        // Tìm Giáo viên chấm bài theo userId (nguoi_dung_id) từ JWT token
        HoSoGiaoVien teacher = teacherProfileRepository.findByNguoiDung_NguoiDungId(dto.getTeacherId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                    "Không tìm thấy hồ sơ Giáo viên cho user ID: " + dto.getTeacherId() + ". Hãy kiểm tra bảng ho_so_giao_vien!"));

        // Tạo bản ghi DanhGiaBaiLam
        DanhGiaBaiLam evaluation = new DanhGiaBaiLam();
        evaluation.setBaiNop(submission);
        evaluation.setGiaoVien(teacher);
        evaluation.setNhanXet(dto.getComment());

        if (dto.getGrade() != null) {
            evaluation.setXepLoai(XepLoai.valueOf(dto.getGrade()));
        }

        HanhDongDanhGia action = HanhDongDanhGia.valueOf(dto.getAction());
        evaluation.setHanhDong(action);

        // Cập nhật trạng thái bài nộp
        if (action == HanhDongDanhGia.YC_LAM_LAI) {
            submission.setTrangThai(TrangThaiBaiNop.YC_LAM_LAI);
        } else {
            submission.setTrangThai(TrangThaiBaiNop.DA_CHAM);
        }
        submissionRepository.save(submission);

        return evaluationRepository.save(evaluation);
    }
}
