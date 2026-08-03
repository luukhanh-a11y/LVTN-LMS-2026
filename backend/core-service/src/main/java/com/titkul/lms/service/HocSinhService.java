package com.titkul.lms.service;

import com.titkul.lms.dto.BaiTapResponse;
import com.titkul.lms.dto.DangBaiHoanThanhResponse;
import com.titkul.lms.dto.DangBaiDetailResponse;
import com.titkul.lms.dto.BaiTapTuLuanDetailResponse;
import com.titkul.lms.dto.BaiNopTuLuanRequest;
import com.titkul.lms.dto.BaiNopTuLuanResultResponse;
import com.titkul.lms.dto.BaiTapH5PDetailResponse;
import com.titkul.lms.dto.BaiNopH5PRequest;
import com.titkul.lms.dto.BaiNopH5PResultResponse;
import com.titkul.lms.dto.HocSinhDashboardResponse;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import com.titkul.lms.util.AssignmentStatusUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HocSinhService {

    private static final DateTimeFormatter DEADLINE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final List<DoiTuongNhanThongBao> STUDENT_AUDIENCE =
            List.of(DoiTuongNhanThongBao.TAT_CA, DoiTuongNhanThongBao.HOC_SINH);

    private final NguoiDungRepository userRepository;
    private final HoSoHocSinhRepository studentProfileRepository;
    private final DanhGiaBaiLamRepository evaluationRepository;
    private final BaiTapRepository assignmentRepository;
    private final BaiNopRepository submissionRepository;
    private final BaiNopService submissionService;
    private final DangBaiRepository contentNodeRepository;
    private final StudentProgressRepository studentProgressRepository;
    private final HocKyRepository semesterRepository;
    private final ThongBaoRepository notificationRepository;
    private final TrangThaiDocThongBaoRepository notificationReadStatusRepository;
    private final HuyHieuRepository huyHieuRepository;
    private final KhenThuongHocSinhRepository khenThuongHocSinhRepository;
    private final ChamDiemBaiTapBoSachService chamDiemBaiTapBoSachService;
    private final HuyHieuTuDongService huyHieuTuDongService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public HocSinhDashboardResponse getDashboard(String username) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        HoSoHocSinh profile = studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        LopHoc classRoom = profile.getLopHoc();

        List<DanhGiaBaiLam> recentEvaluations = evaluationRepository
                .findByBaiNop_HocSinh_HocSinhIdOrderByThoiDiemChamDesc(profile.getHocSinhId(), PageRequest.of(0, 5));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        List<HocSinhDashboardResponse.EvaluationDto> evalDtos = recentEvaluations.stream()
                .map(eval -> HocSinhDashboardResponse.EvaluationDto.builder()
                        .assignmentTitle(eval.getBaiNop().getBaiTap().getTieuDe())
                        .score(eval.getDiemSo() != null ? eval.getDiemSo().toString() : null)
                        .grade(eval.getXepLoai() != null ? eval.getXepLoai().name() : null)
                        .comment(eval.getNhanXet())
                        .evaluatedAt(eval.getThoiDiemCham().format(formatter))
                        .build())
                .collect(Collectors.toList());

        List<HocSinhDashboardResponse.SubjectProgressDto> subjects = buildSubjectProgress(profile, classRoom);

        List<HocSinhDashboardResponse.UpcomingTaskDto> upcomingTasks = List.of(
            HocSinhDashboardResponse.UpcomingTaskDto.builder().id(1L).title("Luyện tập phép cộng trừ").subject("Toán Học").time("3 giờ nữa").build()
        );

        List<ThongBao> visibleNotifications = classRoom != null
                ? notificationRepository.findVisibleToClass(classRoom.getLopHocId(), STUDENT_AUDIENCE)
                : notificationRepository.findGlobalOnly(STUDENT_AUDIENCE);
        DateTimeFormatter notiFmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        List<HocSinhDashboardResponse.NotificationDto> notifications = visibleNotifications.stream()
                .limit(3)
                .map(n -> {
                    boolean read = notificationReadStatusRepository
                            .findByUser_NguoiDungIdAndThongBao_ThongBaoId(user.getNguoiDungId(), n.getThongBaoId())
                            .map(TrangThaiDocThongBao::isDaDoc)
                            .orElse(false);
                    return HocSinhDashboardResponse.NotificationDto.builder()
                            .id(n.getThongBaoId())
                            .title(n.getTieuDe())
                            .isNew(!read)
                            .content(n.getNoiDung())
                            .date(n.getNgayDang().format(notiFmt))
                            .type(n.getLoaiThongBao().name())
                            .pinned(n.isLaGhim())
                            .build();
                })
                .collect(Collectors.toList());

        return HocSinhDashboardResponse.builder()
                .fullName(profile.getHoTen())
                .className(classRoom != null ? classRoom.getTenLop() : "Chưa có lớp")
                .academicYear(classRoom != null && classRoom.getNamHoc() != null ? classRoom.getNamHoc().getTenNamHoc() : "")
                .totalXp(profile.getTongXp())
                .recentEvaluations(evalDtos)
                .subjects(subjects)
                .upcomingTasks(upcomingTasks)
                .recentNotifications(notifications)
                .build();
    }

    private static final Map<String, String[]> SUBJECT_STYLE = Map.of(
            "Toán", new String[]{"https://img.icons8.com/color/96/calculator--v1.png", "text-blue-700", "bg-blue-50 text-blue-600 hover:bg-blue-100", "bg-blue-500"},
            "Tiếng Việt", new String[]{"https://img.icons8.com/color/96/books.png", "text-orange-700", "bg-orange-50 text-orange-600 hover:bg-orange-100", "bg-orange-500"}
    );
    private static final String[] DEFAULT_SUBJECT_STYLE =
            {"https://img.icons8.com/color/96/school.png", "text-slate-700", "bg-slate-50 text-slate-600 hover:bg-slate-100", "bg-slate-500"};

    // Chỉ hiện những môn ĐÃ có nội dung thật trong cây SGK cho đúng khối của lớp học sinh —
    // không hiện môn giả/rỗng. % tiến độ tính thật từ StudentProgress.
    private List<HocSinhDashboardResponse.SubjectProgressDto> buildSubjectProgress(HoSoHocSinh profile, LopHoc classRoom) {
        if (classRoom == null || classRoom.getKhoiLop() == null) return List.of();
        Integer grade = classRoom.getKhoiLop().intValue();
        List<MonHoc> subjectsWithContent = contentNodeRepository.findDistinctSubjectsByGrade(grade);

        return subjectsWithContent.stream().map(subject -> {
            List<DangBai> nodes = contentNodeRepository.findBySubjectAndGradeOrdered(subject.getMonHocId(), grade);
            long completed = studentProgressRepository.countByStudent_HocSinhIdAndContentNode_MonHoc_MonHocIdAndCompletedTrue(profile.getHocSinhId(), subject.getMonHocId());
            int progress = nodes.isEmpty() ? 0 : (int) Math.round(completed * 100.0 / nodes.size());
            String[] style = SUBJECT_STYLE.getOrDefault(subject.getTenMon(), DEFAULT_SUBJECT_STYLE);

            return HocSinhDashboardResponse.SubjectProgressDto.builder()
                    .id(String.valueOf(subject.getMonHocId()))
                    .name(subject.getTenMon())
                    .desc(nodes.size() + " bài học")
                    .icon(style[0])
                    .color("bg-white border-slate-200 " + style[1])
                    .btnColor(style[2])
                    .trackColor("bg-slate-100")
                    .barColor(style[3])
                    .progress(progress)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<BaiTapResponse> getAssignments(String username) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        HoSoHocSinh profile = studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        LopHoc classRoom = profile.getLopHoc();
        if (classRoom == null) return List.of();

        List<BaiTap> assignments = assignmentRepository
                .findByLopHoc_LopHocId(classRoom.getLopHocId(), PageRequest.of(0, 100))
                .getContent();

        Map<Long, BaiNop> submissionMap = submissionRepository.findByHocSinh_HocSinhId(profile.getHocSinhId())
                .stream()
                .collect(Collectors.toMap(s -> s.getBaiTap().getBaiTapId(), s -> s, (a, b) -> a));

        return assignments.stream()
                .map(a -> AssignmentStatusUtils.toDto(a, submissionMap.get(a.getBaiTapId())))
                .collect(Collectors.toList());
    }

    public BaiTapH5PDetailResponse getH5PAssignmentDetail(String username, Long assignmentId) {
        HoSoHocSinh profile = resolveProfile(username);
        BaiTap assignment = resolveH5PAssignmentForStudent(assignmentId, profile);

        List<BaiNop> attempts = submissionRepository.findByBaiTap_BaiTapIdAndHocSinh_HocSinhId(assignmentId, profile.getHocSinhId());
        int attemptsUsed = attempts.size();
        boolean hasSubmitted = attemptsUsed > 0;
        boolean pastDeadline = assignment.getDeadline() != null && assignment.getDeadline().isBefore(LocalDateTime.now());
        boolean canSubmit = !hasSubmitted
                || (Boolean.TRUE.equals(assignment.getChoNopLai()) && attemptsUsed < assignment.getSoLanNopLaiToiDa());

        return BaiTapH5PDetailResponse.builder()
                .assignmentId(assignment.getBaiTapId())
                .title(assignment.getTieuDe())
                .h5pContentId(resolveH5pContentId(assignment))
                .xpReward(resolveXpReward(assignment))
                .allowResubmit(assignment.getChoNopLai())
                .maxResubmitCount(assignment.getSoLanNopLaiToiDa())
                .attemptsUsed(attemptsUsed)
                .canSubmit(canSubmit)
                .deadline(assignment.getDeadline() != null ? assignment.getDeadline().format(DEADLINE_FMT) : null)
                .isPastDeadline(pastDeadline)
                .build();
    }

    @Transactional
    public BaiNopH5PResultResponse submitH5PAssignment(String username, Long assignmentId, BaiNopH5PRequest request) {
        HoSoHocSinh profile = resolveProfile(username);
        BaiTap assignment = resolveH5PAssignmentForStudent(assignmentId, profile);
        Integer xpReward = resolveXpReward(assignment);

        if (request.getMaxScore() == null || request.getMaxScore() <= 0) {
            throw new IllegalArgumentException("Dữ liệu điểm số không hợp lệ.");
        }

        List<BaiNop> previousAttempts = submissionRepository.findByBaiTap_BaiTapIdAndHocSinh_HocSinhId(assignmentId, profile.getHocSinhId());
        boolean hasSubmitted = !previousAttempts.isEmpty();
        boolean canResubmit = Boolean.TRUE.equals(assignment.getChoNopLai()) && previousAttempts.size() < assignment.getSoLanNopLaiToiDa();
        if (hasSubmitted && !canResubmit) {
            throw new RuntimeException("Bạn đã hết lượt làm lại cho bài tập này.");
        }

        BigDecimal score = BigDecimal.valueOf(request.getRawScore())
                .divide(BigDecimal.valueOf(request.getMaxScore()), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(10))
                .setScale(1, RoundingMode.HALF_UP);

        BaiNop submission = new BaiNop();
        submission.setBaiTap(assignment);
        submission.setHocSinh(profile);
        submission.setDangBai(assignment.getDangBai());
        submission.setDiemTuDong(score);
        submission.setChiTietBaiLam(request.getInteractionDetails());
        submission.setSoLanLam((short) (previousAttempts.size() + 1));

        // Chỉ thưởng XP ở lần nộp đầu tiên hoàn thành, tránh cày XP qua nộp lại nhiều lần
        boolean completed = Boolean.TRUE.equals(request.getCompleted());
        int xpEarned = (completed && !hasSubmitted && xpReward != null) ? xpReward : 0;
        submission.setXpNhanDuoc(xpEarned);

        BaiNop saved = submissionService.submitAssignment(submission);

        if (xpEarned > 0) {
            profile.setTongXp(profile.getTongXp() + xpEarned);
            studentProfileRepository.save(profile);
        }

        return BaiNopH5PResultResponse.builder()
                .submissionId(saved.getBaiNopId())
                .score(score)
                .xpEarned(xpEarned)
                .totalXp(profile.getTongXp())
                .status(saved.getTrangThai().name())
                .isLate(saved.getLaNopTre())
                .build();
    }

    public BaiTapTuLuanDetailResponse getEssayAssignmentDetail(String username, Long assignmentId) {
        HoSoHocSinh profile = resolveProfile(username);
        BaiTap assignment = resolveEssayAssignmentForStudent(assignmentId, profile);

        List<BaiNop> attempts = submissionRepository.findByBaiTap_BaiTapIdAndHocSinh_HocSinhId(assignmentId, profile.getHocSinhId());
        BaiNop draft = attempts.stream().filter(s -> s.getTrangThai() == TrangThaiBaiNop.LUU_NHAP).findFirst().orElse(null);
        long finalizedCount = attempts.stream().filter(s -> s.getTrangThai() != TrangThaiBaiNop.LUU_NHAP).count();

        boolean hasFinalized = finalizedCount > 0;
        boolean pastDeadline = assignment.getDeadline() != null && assignment.getDeadline().isBefore(LocalDateTime.now());
        boolean canSubmit = !hasFinalized
                || (Boolean.TRUE.equals(assignment.getChoNopLai()) && finalizedCount < assignment.getSoLanNopLaiToiDa());

        return BaiTapTuLuanDetailResponse.builder()
                .assignmentId(assignment.getBaiTapId())
                .title(assignment.getTieuDe())
                .description(assignment.getMoTa())
                .deadline(assignment.getDeadline() != null ? assignment.getDeadline().format(DEADLINE_FMT) : null)
                .isPastDeadline(pastDeadline)
                .allowResubmit(assignment.getChoNopLai())
                .maxResubmitCount(assignment.getSoLanNopLaiToiDa())
                .attemptsUsed((int) finalizedCount)
                .canSubmit(canSubmit)
                .draftText(draft != null ? draft.getNoiDungText() : null)
                .draftAttachmentUrl(draft != null ? draft.getFileDinhKem() : null)
                .build();
    }

    @Transactional
    public BaiNopTuLuanResultResponse submitEssay(String username, Long assignmentId, BaiNopTuLuanRequest request) {
        HoSoHocSinh profile = resolveProfile(username);
        BaiTap assignment = resolveEssayAssignmentForStudent(assignmentId, profile);

        List<BaiNop> attempts = submissionRepository.findByBaiTap_BaiTapIdAndHocSinh_HocSinhId(assignmentId, profile.getHocSinhId());
        BaiNop draft = attempts.stream().filter(s -> s.getTrangThai() == TrangThaiBaiNop.LUU_NHAP).findFirst().orElse(null);
        long finalizedCount = attempts.stream().filter(s -> s.getTrangThai() != TrangThaiBaiNop.LUU_NHAP).count();

        boolean isDraft = Boolean.TRUE.equals(request.getIsDraft());
        if (!isDraft) {
            boolean hasFinalized = finalizedCount > 0;
            boolean canResubmit = Boolean.TRUE.equals(assignment.getChoNopLai()) && finalizedCount < assignment.getSoLanNopLaiToiDa();
            if (hasFinalized && !canResubmit) {
                throw new RuntimeException("Bạn đã hết lượt nộp lại cho bài tập này.");
            }
        }

        BaiNop submission = draft != null ? draft : new BaiNop();
        submission.setBaiTap(assignment);
        submission.setHocSinh(profile);
        submission.setNoiDungText(request.getTextContent());
        submission.setFileDinhKem(request.getAttachmentUrl());
        submission.setSoLanLam((short) (finalizedCount + 1));

        if (isDraft) {
            submission.setTrangThai(TrangThaiBaiNop.LUU_NHAP);
            BaiNop saved = submissionRepository.save(submission);
            return BaiNopTuLuanResultResponse.builder()
                    .submissionId(saved.getBaiNopId())
                    .status(saved.getTrangThai().name())
                    .isLate(false)
                    .build();
        }

        BaiNop saved = submissionService.submitAssignment(submission);
        return BaiNopTuLuanResultResponse.builder()
                .submissionId(saved.getBaiNopId())
                .status(saved.getTrangThai().name())
                .isLate(saved.getLaNopTre())
                .build();
    }

    // AI-03 bổ sung: bài tập bộ sách (trắc nghiệm/nối cặp/điền khuyết) — chỉ trả cauHinh
    // (câu hỏi), KHÔNG BAO GIỜ trả dapAnChuan cho học sinh.
    public Map<String, Object> getQuizAssignmentDetail(String username, Long assignmentId) {
        HoSoHocSinh profile = resolveProfile(username);
        BaiTap assignment = resolveQuizAssignmentForStudent(assignmentId, profile);
        DangBai dangBai = assignment.getDangBai();

        List<BaiNop> attempts = submissionRepository.findByBaiTap_BaiTapIdAndHocSinh_HocSinhId(assignmentId, profile.getHocSinhId());
        int attemptsUsed = attempts.size();
        boolean hasSubmitted = attemptsUsed > 0;
        boolean pastDeadline = assignment.getDeadline() != null && assignment.getDeadline().isBefore(LocalDateTime.now());
        boolean canSubmit = !hasSubmitted
                || (Boolean.TRUE.equals(assignment.getChoNopLai()) && attemptsUsed < assignment.getSoLanNopLaiToiDa());

        Map<String, Object> cauHinh;
        String loai;
        try {
            Map<String, Object> parsed = objectMapper.readValue(dangBai.getCauHinh(), Map.class);
            loai = (String) parsed.get("loai");
            cauHinh = parsed;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc nội dung bài tập");
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("assignmentId", assignment.getBaiTapId());
        result.put("title", assignment.getTieuDe());
        result.put("loai", loai);
        result.put("cauHinh", cauHinh);
        result.put("allowResubmit", assignment.getChoNopLai());
        result.put("maxResubmitCount", assignment.getSoLanNopLaiToiDa());
        result.put("attemptsUsed", attemptsUsed);
        result.put("canSubmit", canSubmit);
        result.put("deadline", assignment.getDeadline() != null ? assignment.getDeadline().format(DEADLINE_FMT) : null);
        result.put("isPastDeadline", pastDeadline);
        return result;
    }

    @Transactional
    public Map<String, Object> submitQuizAssignment(String username, Long assignmentId, Map<String, Object> baiLam) {
        HoSoHocSinh profile = resolveProfile(username);
        BaiTap assignment = resolveQuizAssignmentForStudent(assignmentId, profile);
        DangBai dangBai = assignment.getDangBai();

        List<BaiNop> previousAttempts = submissionRepository.findByBaiTap_BaiTapIdAndHocSinh_HocSinhId(assignmentId, profile.getHocSinhId());
        boolean hasSubmitted = !previousAttempts.isEmpty();
        boolean canResubmit = Boolean.TRUE.equals(assignment.getChoNopLai()) && previousAttempts.size() < assignment.getSoLanNopLaiToiDa();
        if (hasSubmitted && !canResubmit) {
            throw new RuntimeException("Bạn đã hết lượt làm lại cho bài tập này.");
        }

        String baiLamJson;
        try {
            baiLamJson = objectMapper.writeValueAsString(baiLam);
        } catch (Exception e) {
            throw new RuntimeException("Dữ liệu bài làm không hợp lệ");
        }
        // Không tin điểm client gửi lên — luôn chấm lại từ dap_an_chuan lưu ở server.
        BigDecimal score = chamDiemBaiTapBoSachService.chamDiem(dangBai.getDapAnChuan(), baiLamJson);

        BaiNop submission = new BaiNop();
        submission.setBaiTap(assignment);
        submission.setHocSinh(profile);
        submission.setDangBai(dangBai);
        submission.setDiemTuDong(score);
        submission.setChiTietBaiLam(baiLamJson);
        submission.setSoLanLam((short) (previousAttempts.size() + 1));

        // XP chỉ thưởng lần nộp đầu, tỷ lệ theo điểm đạt được (điểm/10 * xpThuong)
        int xpEarned = 0;
        if (!hasSubmitted && dangBai.getXpThuong() != null && dangBai.getXpThuong() > 0) {
            xpEarned = score.multiply(BigDecimal.valueOf(dangBai.getXpThuong()))
                    .divide(BigDecimal.TEN, 0, RoundingMode.HALF_UP)
                    .intValue();
        }
        submission.setXpNhanDuoc(xpEarned);

        BaiNop saved = submissionService.submitAssignment(submission);

        if (xpEarned > 0) {
            profile.setTongXp(profile.getTongXp() + xpEarned);
            studentProfileRepository.save(profile);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("submissionId", saved.getBaiNopId());
        result.put("score", score);
        result.put("xpEarned", xpEarned);
        result.put("totalXp", profile.getTongXp());
        result.put("status", saved.getTrangThai().name());
        result.put("isLate", saved.getLaNopTre());
        return result;
    }

    private BaiTap resolveQuizAssignmentForStudent(Long assignmentId, HoSoHocSinh profile) {
        BaiTap assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập"));
        if (assignment.getLoaiBaiTap() != LoaiBaiTap.TRAC_NGHIEM) {
            throw new RuntimeException("Bài tập này không phải dạng trắc nghiệm bộ sách.");
        }
        if (profile.getLopHoc() == null || !assignment.getLopHoc().getLopHocId().equals(profile.getLopHoc().getLopHocId())) {
            throw new RuntimeException("Bạn không thuộc lớp được giao bài tập này.");
        }
        if (assignment.getDangBai() == null || assignment.getDangBai().getDapAnChuan() == null) {
            throw new RuntimeException("Bài tập chưa có nội dung quiz.");
        }
        return assignment;
    }

    private BaiTap resolveEssayAssignmentForStudent(Long assignmentId, HoSoHocSinh profile) {
        BaiTap assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập"));
        if (assignment.getLoaiBaiTap() != LoaiBaiTap.TU_LUAN) {
            throw new RuntimeException("Bài tập này không phải dạng tự luận.");
        }
        if (profile.getLopHoc() == null || !assignment.getLopHoc().getLopHocId().equals(profile.getLopHoc().getLopHocId())) {
            throw new RuntimeException("Bạn không thuộc lớp được giao bài tập này.");
        }
        return assignment;
    }

    private HoSoHocSinh resolveProfile(String username) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        return studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));
    }

    private BaiTap resolveH5PAssignmentForStudent(Long assignmentId, HoSoHocSinh profile) {
        BaiTap assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập"));
        if (assignment.getLoaiBaiTap() != LoaiBaiTap.H5P) {
            throw new RuntimeException("Bài tập này không phải dạng H5P.");
        }
        if (profile.getLopHoc() == null || !assignment.getLopHoc().getLopHocId().equals(profile.getLopHoc().getLopHocId())) {
            throw new RuntimeException("Bạn không thuộc lớp được giao bài tập này.");
        }
        if (resolveH5pContentId(assignment) == null) {
            throw new RuntimeException("Bài tập chưa gắn nội dung H5P.");
        }
        return assignment;
    }

    // Bài H5P có thể nguồn từ HocLieu (kho học liệu GV tự soạn) hoặc DangBai (cây SGK) — ưu tiên HocLieu.
    private String resolveH5pContentId(BaiTap assignment) {
        if (assignment.getHocLieu() != null && assignment.getHocLieu().getH5pContentId() != null) {
            return assignment.getHocLieu().getH5pContentId();
        }
        return assignment.getDangBai() != null ? assignment.getDangBai().getH5pNoiDungId() : null;
    }

    private Integer resolveXpReward(BaiTap assignment) {
        if (assignment.getHocLieu() != null) {
            return assignment.getHocLieu().getXpReward();
        }
        return assignment.getDangBai() != null ? assignment.getDangBai().getXpThuong() : null;
    }

    public List<Map<String, Object>> getNotifications(String username) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoHocSinh profile = studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        List<ThongBao> notifications = profile.getLopHoc() != null
                ? notificationRepository.findVisibleToClass(profile.getLopHoc().getLopHocId(), STUDENT_AUDIENCE)
                : notificationRepository.findGlobalOnly(STUDENT_AUDIENCE);

        return notifications.stream()
                .map(n -> {
                    boolean read = notificationReadStatusRepository
                            .findByUser_NguoiDungIdAndThongBao_ThongBaoId(user.getNguoiDungId(), n.getThongBaoId())
                            .map(TrangThaiDocThongBao::isDaDoc)
                            .orElse(false);
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", n.getThongBaoId());
                    map.put("title", n.getTieuDe());
                    map.put("content", n.getNoiDung());
                    map.put("date", n.getNgayDang().format(fmt));
                    map.put("read", read);
                    map.put("type", n.getLoaiThongBao().name());
                    map.put("pinned", n.isLaGhim());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void markNotificationRead(String username, Long notificationId) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        markNotificationReadForUser(user, notificationId);
    }

    @Transactional
    public void markAllNotificationsRead(String username) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoHocSinh profile = studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        List<ThongBao> notifications = profile.getLopHoc() != null
                ? notificationRepository.findVisibleToClass(profile.getLopHoc().getLopHocId(), STUDENT_AUDIENCE)
                : notificationRepository.findGlobalOnly(STUDENT_AUDIENCE);
        notifications.forEach(n -> markNotificationReadForUser(user, n.getThongBaoId()));
    }

    private void markNotificationReadForUser(NguoiDung user, Long notificationId) {
        TrangThaiDocThongBao status = notificationReadStatusRepository
                .findByUser_NguoiDungIdAndThongBao_ThongBaoId(user.getNguoiDungId(), notificationId)
                .orElseGet(TrangThaiDocThongBao::new);
        if (status.getTrangThaiId() == null) {
            status.setUser(user);
            status.setThongBao(notificationRepository.getReferenceById(notificationId));
        }
        status.setDaDoc(true);
        status.setThoiDiemDoc(LocalDateTime.now());
        notificationReadStatusRepository.save(status);
    }

    public Map<String, Object> getRewards(String username) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoHocSinh profile = studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));

        return buildRewardsPayload(profile);
    }

    // Dùng chung cho cả HS xem của mình và PH xem của con — ghép danh mục huy hiệu
    // thật (huy_hieu) với những huy hiệu học sinh này đã thật sự được trao (khen_thuong_hoc_sinh).
    Map<String, Object> buildRewardsPayload(HoSoHocSinh profile) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        List<KhenThuongHocSinh> earned = khenThuongHocSinhRepository.findByHocSinh_HocSinhIdOrderByThoiDiemTraoDesc(profile.getHocSinhId());
        Map<Integer, KhenThuongHocSinh> earnedByHuyHieuId = earned.stream()
                .collect(Collectors.toMap(r -> r.getHuyHieu().getHuyHieuId(), r -> r, (a, b) -> a));

        List<Map<String, Object>> huyHieu = huyHieuRepository.findAll().stream()
                .map(hh -> {
                    KhenThuongHocSinh khenThuong = earnedByHuyHieuId.get(hh.getHuyHieuId());
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", hh.getHuyHieuId());
                    map.put("ten", hh.getTenHuyHieu());
                    map.put("moTa", hh.getMoTa());
                    map.put("icon", hh.getIconUrl());
                    map.put("ngayTrao", khenThuong != null ? khenThuong.getThoiDiemTrao().format(fmt) : "");
                    map.put("daMoKhoa", khenThuong != null);
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> thuKhen = earned.stream()
                .filter(r -> r.getThuKhen() != null && !r.getThuKhen().isBlank())
                .map(r -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", r.getKhenThuongId());
                    map.put("giaoVien", r.getGiaoVien() != null ? r.getGiaoVien().getHoTen() : "Giáo viên");
                    map.put("monHoc", r.getGiaoVien() != null ? r.getGiaoVien().getBoMon() : "");
                    map.put("noiDung", r.getThuKhen());
                    map.put("ngayTrao", r.getThoiDiemTrao().format(fmt));
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("huyHieu", huyHieu);
        result.put("thuKhen", thuKhen);
        result.put("tongXp", profile.getTongXp());
        return result;
    }

    // Mở khóa tuần tự: bài đầu tiên chưa hoàn thành trong toàn bộ môn là "current",
    // các bài sau đó "locked", các bài trước (đã hoàn thành) là "completed".
    public Map<String, Object> getSubjectTree(String username, Integer subjectId) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoHocSinh profile = studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));
        return buildSubjectTree(profile, subjectId);
    }

    // Dùng chung cho cả HS xem của mình (getSubjectTree) và PH xem của con (PhuHuynhService).
    Map<String, Object> buildSubjectTree(HoSoHocSinh profile, Integer subjectId) {
        if (profile.getLopHoc() == null || profile.getLopHoc().getKhoiLop() == null || subjectId == null) {
            return Map.of("subjectName", "", "totalLessons", 0, "completedLessons", 0, "chapters", List.of());
        }
        Integer grade = profile.getLopHoc().getKhoiLop().intValue();
        List<DangBai> nodes = contentNodeRepository.findBySubjectAndGradeOrdered(subjectId, grade);
        if (nodes.isEmpty()) {
            return Map.of("subjectName", "", "totalLessons", 0, "completedLessons", 0, "chapters", List.of());
        }

        List<StudentProgress> progressList = studentProgressRepository
                .findByStudent_HocSinhIdAndContentNode_MonHoc_MonHocId(profile.getHocSinhId(), subjectId);
        Map<Integer, StudentProgress> progressByNodeId = progressList.stream()
                .collect(Collectors.toMap(p -> p.getContentNode().getDangBaiId(), p -> p, (a, b) -> a));

        java.util.LinkedHashMap<Integer, Map<String, Object>> chaptersByTopicId = new java.util.LinkedHashMap<>();
        java.util.LinkedHashMap<Integer, Map<String, Object>> lessonsByLessonId = new java.util.LinkedHashMap<>();

        for (DangBai node : nodes) {
            BaiHoc baiHoc = node.getBaiHoc();
            ChuDe chuDe = baiHoc.getChuDe();
            
            Map<String, Object> chapter = chaptersByTopicId.computeIfAbsent(chuDe.getChuDeId(), tid -> {
                Map<String, Object> c = new java.util.HashMap<>();
                c.put("id", tid);
                c.put("title", chuDe.getTenChuDe());
                c.put("icon", "https://img.icons8.com/color/96/1-circle.png");
                c.put("lessons", new java.util.ArrayList<Map<String, Object>>());
                return c;
            });

            Map<String, Object> lesson = lessonsByLessonId.computeIfAbsent(baiHoc.getBaiHocId(), bid -> {
                Map<String, Object> l = new java.util.HashMap<>();
                l.put("id", bid);
                l.put("title", baiHoc.getTenBaiHoc());
                l.put("type", "quiz");
                l.put("completed", true);
                
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> lessonsList = (List<Map<String, Object>>) chapter.get("lessons");
                lessonsList.add(l);
                return l;
            });

            StudentProgress progress = progressByNodeId.get(node.getDangBaiId());
            boolean completed = progress != null && Boolean.TRUE.equals(progress.getCompleted());
            if (!completed) {
                lesson.put("completed", false);
            }
            if (node.getH5pNoiDungId() != null) {
                lesson.put("type", "h5p");
            }
        }

        boolean foundCurrent = false;
        int completedCount = 0;
        for (Map<String, Object> chapter : chaptersByTopicId.values()) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> lessonsList = (List<Map<String, Object>>) chapter.get("lessons");
            for (Map<String, Object> lesson : lessonsList) {
                boolean completed = Boolean.TRUE.equals(lesson.get("completed"));
                String status;
                if (completed) {
                    status = "completed";
                    completedCount++;
                } else if (!foundCurrent) {
                    status = "current";
                    foundCurrent = true;
                } else {
                    status = "locked";
                }
                lesson.put("status", status);
            }
        }

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("subjectName", nodes.get(0).getMonHoc().getTenMon());
        result.put("totalLessons", lessonsByLessonId.size());
        result.put("completedLessons", completedCount);
        result.put("chapters", new java.util.ArrayList<>(chaptersByTopicId.values()));
        return result;
    }

    public Map<String, Object> getContentNodeDetail(String username, Integer baiHocId) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoHocSinh profile = studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));
        
        List<DangBai> games = contentNodeRepository.findByBaiHocIdOrdered(baiHocId);
        if (games.isEmpty()) {
            throw new RuntimeException("Không tìm thấy nội dung bài học");
        }
        
        BaiHoc bh = games.get(0).getBaiHoc();
        
        List<StudentProgress> progressList = studentProgressRepository
                .findByStudent_HocSinhIdAndContentNode_MonHoc_MonHocId(profile.getHocSinhId(), bh.getChuDe().getSach().getMonHoc().getMonHocId());
        Map<Integer, StudentProgress> progressByNodeId = progressList.stream()
                .collect(Collectors.toMap(p -> p.getContentNode().getDangBaiId(), p -> p, (a, b) -> a));

        boolean allCompleted = true;
        List<Map<String, Object>> items = new java.util.ArrayList<>();
        for (DangBai contentNode : games) {
            StudentProgress progress = progressByNodeId.get(contentNode.getDangBaiId());
            boolean completed = progress != null && Boolean.TRUE.equals(progress.getCompleted());
            if (!completed) {
                allCompleted = false;
            }

            Object cauHinh = null;
            String loai = null;
            if (contentNode.getCauHinh() != null) {
                try {
                    Map<String, Object> parsed = objectMapper.readValue(contentNode.getCauHinh(), Map.class);
                    loai = (String) parsed.get("loai");
                    cauHinh = parsed;
                } catch (Exception ignored) {}
            }

            Object dapAnChuan = null;
            if (contentNode.getDapAnChuan() != null) {
                try {
                    dapAnChuan = objectMapper.readValue(contentNode.getDapAnChuan(), Object.class);
                } catch (Exception ignored) {}
            }

            Map<String, Object> item = new java.util.HashMap<>();
            item.put("id", contentNode.getDangBaiId());
            item.put("title", contentNode.getTenDangBai());
            item.put("completed", completed);
            item.put("h5pContentId", contentNode.getH5pNoiDungId());
            item.put("xpReward", contentNode.getXpThuong());
            item.put("loaiNoiDung", contentNode.getLoaiNoiDung() != null ? contentNode.getLoaiNoiDung().name() : null);
            item.put("loai", loai);
            item.put("cauHinh", cauHinh);
            item.put("dapAnChuan", dapAnChuan);
            items.add(item);
        }

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("id", baiHocId);
        result.put("title", bh.getTenBaiHoc());
        result.put("completed", allCompleted);
        result.put("items", items);
        return result;
    }

    // Cham diem + danh dau hoan thanh cho quiz "bo sach" (JSON_TEXT) trong luong tu hoc
    // (khac voi submitQuizAssignment: khong gan voi BaiTap/BaiNop, dung chung co che
    // StudentProgress+XP nhu H5P de nhat quan voi luong "danh dau hoan thanh" hien co).
    @Transactional
    public Map<String, Object> submitContentNodeQuiz(String username, Integer contentNodeId, Map<String, Object> baiLam) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoHocSinh profile = studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));
        DangBai contentNode = contentNodeRepository.findById(contentNodeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nội dung bài học"));

        if (contentNode.getLoaiNoiDung() != com.titkul.lms.entity.LoaiNoiDung.JSON_TEXT || contentNode.getDapAnChuan() == null) {
            throw new RuntimeException("Bài này không phải dạng quiz có thể nộp bài");
        }

        String baiLamJson;
        try {
            baiLamJson = objectMapper.writeValueAsString(baiLam);
        } catch (Exception e) {
            throw new RuntimeException("Dữ liệu bài làm không hợp lệ");
        }
        BigDecimal score = chamDiemBaiTapBoSachService.chamDiem(contentNode.getDapAnChuan(), baiLamJson);

        DangBaiHoanThanhResponse hoanThanh = markContentNodeComplete(username, contentNodeId);

        Object dapAnChuan = null;
        try {
            dapAnChuan = objectMapper.readValue(contentNode.getDapAnChuan(), Object.class);
        } catch (Exception ignored) {
        }

        Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("diem", score);
        result.put("xpEarned", hoanThanh.getXpEarned());
        result.put("totalXp", hoanThanh.getTotalXp());
        result.put("alreadyCompleted", hoanThanh.getAlreadyCompleted());
        result.put("dapAnChuan", dapAnChuan);
        return result;
    }

    // Chỉ cộng XP lần đầu hoàn thành, tránh cày XP qua việc gọi lại API nhiều lần.
    @Transactional
    public DangBaiHoanThanhResponse markContentNodeComplete(String username, Integer contentNodeId) {
        NguoiDung user = userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        HoSoHocSinh profile = studentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học sinh"));
        DangBai contentNode = contentNodeRepository.findById(contentNodeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nội dung bài học"));

        StudentProgress progress = studentProgressRepository
                .findByStudent_HocSinhIdAndContentNode_DangBaiId(profile.getHocSinhId(), contentNodeId)
                .orElseGet(StudentProgress::new);

        boolean wasCompleted = Boolean.TRUE.equals(progress.getCompleted());

        if (progress.getId() == null) {
            progress.setStudent(profile);
            progress.setContentNode(contentNode);
            HocKy semester = semesterRepository.findTopByOrderByHocKyIdDesc()
                    .orElseThrow(() -> new RuntimeException("Chưa cấu hình học kỳ nào trong hệ thống"));
            progress.setSemester(semester);
        }
        progress.setCompleted(true);
        progress.setCompletionPercent((short) 100);
        progress.setLastViewedAt(LocalDateTime.now());
        studentProgressRepository.save(progress);

        int xpEarned = 0;
        if (!wasCompleted) {
            xpEarned = contentNode.getXpThuong() != null ? contentNode.getXpThuong() : 0;
            if (xpEarned > 0) {
                profile.setTongXp(profile.getTongXp() + xpEarned);
                studentProfileRepository.save(profile);
            }
        }

        try {
            huyHieuTuDongService.kiemTraVaTraoHuyHieu(profile.getHocSinhId());
        } catch (Exception e) {
            // Không được để lỗi xét huy hiệu làm hỏng luồng đánh dấu hoàn thành
        }

        return DangBaiHoanThanhResponse.builder()
                .xpEarned(xpEarned)
                .totalXp(profile.getTongXp())
                .alreadyCompleted(wasCompleted)
                .build();
    }
}
