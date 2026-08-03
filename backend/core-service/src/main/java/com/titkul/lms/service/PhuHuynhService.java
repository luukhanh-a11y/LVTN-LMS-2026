package com.titkul.lms.service;

import com.titkul.lms.dto.BaiTapResponse;
import com.titkul.lms.dto.PhuHuynhDashboardResponse;
import com.titkul.lms.entity.*;
import com.titkul.lms.repository.*;
import com.titkul.lms.util.AssignmentStatusUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhuHuynhService {

    private static final List<DoiTuongNhanThongBao> PARENT_AUDIENCE =
            List.of(DoiTuongNhanThongBao.TAT_CA, DoiTuongNhanThongBao.PHU_HUYNH);

    private final NguoiDungRepository userRepository;
    private final HoSoPhuHuynhRepository parentProfileRepository;
    private final DanhGiaBaiLamRepository evaluationRepository;
    private final BaiTapRepository assignmentRepository;
    private final ThongBaoRepository notificationRepository;
    private final TrangThaiDocThongBaoRepository notificationReadStatusRepository;
    private final BaiNopRepository submissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final HocSinhService studentService;

    @Transactional(readOnly = true)
    public PhuHuynhDashboardResponse getDashboard(String username, Long childId) {
        HoSoPhuHuynh profile = resolveProfile(resolveUser(username));

        List<HoSoHocSinh> children = profile.getDanhSachHocSinh() != null ? profile.getDanhSachHocSinh() : Collections.emptyList();

        List<PhuHuynhDashboardResponse.ChildDto> childDtos = children.stream()
                .map(c -> PhuHuynhDashboardResponse.ChildDto.builder()
                        .id(c.getHocSinhId())
                        .studentName(c.getHoTen())
                        .className(c.getLopHoc() != null ? c.getLopHoc().getTenLop() : "Chưa có lớp")
                        .build())
                .collect(Collectors.toList());

        List<HoSoHocSinh> scopedChildren = childId != null
                ? children.stream().filter(c -> c.getHocSinhId().equals(childId)).collect(Collectors.toList())
                : children;
        List<Long> scopedChildIds = scopedChildren.stream().map(HoSoHocSinh::getHocSinhId).collect(Collectors.toList());

        List<PhuHuynhDashboardResponse.ActivityDto> activities = buildActivities(scopedChildIds);
        List<PhuHuynhDashboardResponse.AlertDto> alerts = buildAlerts(scopedChildren);
        List<PhuHuynhDashboardResponse.AnnouncementDto> announcements = buildAnnouncements(profile);

        return PhuHuynhDashboardResponse.builder()
                .fullName(profile.getHoTen())
                .childrenCount(children.size())
                .children(childDtos)
                .recentActivities(activities)
                .alerts(alerts)
                .announcements(announcements)
                .build();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getChildren(String username) {
        HoSoPhuHuynh profile = resolveProfile(resolveUser(username));
        if (profile.getDanhSachHocSinh() == null) return Collections.emptyList();

        return profile.getDanhSachHocSinh().stream().map(child -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", child.getHocSinhId());
            map.put("name", child.getHoTen());
            map.put("grade", child.getLopHoc() != null ? child.getLopHoc().getTenLop() : "Chưa có lớp");
            map.put("school", "Tiểu học Titkul Kids");
            map.put("username", child.getMaHocSinh());
            map.put("className", child.getLopHoc() != null ? child.getLopHoc().getTenLop() : "Chưa phân lớp");
            map.put("totalXp", child.getTongXp());
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getGrades(String username, Long childId) {
        HoSoPhuHuynh profile = resolveProfile(resolveUser(username));
        List<Long> allChildIds = profile.getDanhSachHocSinh() != null
                ? profile.getDanhSachHocSinh().stream().map(HoSoHocSinh::getHocSinhId).collect(Collectors.toList())
                : Collections.emptyList();
        List<Long> childIds = childId != null
                ? allChildIds.stream().filter(id -> id.equals(childId)).collect(Collectors.toList())
                : allChildIds;

        if (childIds.isEmpty()) return Collections.emptyList();

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return evaluationRepository.findByBaiNop_HocSinh_HocSinhIdInOrderByThoiDiemChamDesc(childIds)
                .stream()
                .map(eval -> {
                    com.titkul.lms.entity.BaiTap assignment = eval.getBaiNop().getBaiTap();
                    String subjectName = "Chưa phân loại";
                    if (assignment.getHocLieu() != null && assignment.getHocLieu().getSubject() != null) {
                        subjectName = assignment.getHocLieu().getSubject().getTenMon();
                    } else if (assignment.getDangBai() != null && assignment.getDangBai().getMonHoc() != null) {
                        subjectName = assignment.getDangBai().getMonHoc().getTenMon();
                    }

                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", eval.getDanhGiaId());
                    map.put("subject", subjectName);
                    map.put("assignment", assignment.getTieuDe());
                    map.put("score", eval.getXepLoai() != null ? eval.getXepLoai().name() : (eval.getDiemSo() != null ? eval.getDiemSo().toString() : "Đã chấm"));
                    map.put("type", assignment.getLoaiBaiTap().name());
                    map.put("date", eval.getThoiDiemCham() != null ? eval.getThoiDiemCham().format(fmt) : "");
                    map.put("studentName", eval.getBaiNop().getHocSinh().getHoTen());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BaiTapResponse> getAssignments(String username, Long childId) {
        HoSoPhuHuynh profile = resolveProfile(resolveUser(username));

        HoSoHocSinh child = profile.getDanhSachHocSinh().stream()
                .filter(c -> c.getHocSinhId().equals(childId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Học sinh không thuộc phụ huynh này"));

        LopHoc classRoom = child.getLopHoc();
        if (classRoom == null) return Collections.emptyList();

        List<BaiTap> assignments = assignmentRepository
                .findByLopHoc_LopHocId(classRoom.getLopHocId(), PageRequest.of(0, 100))
                .getContent();

        Map<Long, BaiNop> submissionMap = submissionRepository.findByHocSinh_HocSinhId(child.getHocSinhId())
                .stream()
                .collect(Collectors.toMap(s -> s.getBaiTap().getBaiTapId(), s -> s, (a, b) -> a));

        return assignments.stream()
                .map(a -> AssignmentStatusUtils.toDto(a, submissionMap.get(a.getBaiTapId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getNotifications(String username) {
        NguoiDung user = resolveUser(username);
        HoSoPhuHuynh profile = resolveProfile(user);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return resolveVisibleNotifications(profile).stream()
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
        NguoiDung user = resolveUser(username);
        markNotificationReadForUser(user, notificationId);
    }

    @Transactional
    public void markAllNotificationsRead(String username) {
        NguoiDung user = resolveUser(username);
        HoSoPhuHuynh profile = resolveProfile(user);
        resolveVisibleNotifications(profile).forEach(n -> markNotificationReadForUser(user, n.getThongBaoId()));
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

    // Thông báo hiển thị cho phụ huynh: theo lớp của TẤT CẢ các con + thông báo hệ thống toàn trường.
    private List<ThongBao> resolveVisibleNotifications(HoSoPhuHuynh profile) {
        List<Long> classIds = profile.getDanhSachHocSinh() == null ? List.of() : profile.getDanhSachHocSinh().stream()
                .filter(c -> c.getLopHoc() != null)
                .map(c -> c.getLopHoc().getLopHocId())
                .distinct()
                .collect(Collectors.toList());

        Map<Long, ThongBao> byId = new LinkedHashMap<>();
        for (ThongBao n : notificationRepository.findGlobalOnly(PARENT_AUDIENCE)) {
            byId.putIfAbsent(n.getThongBaoId(), n);
        }
        for (Long classId : classIds) {
            for (ThongBao n : notificationRepository.findVisibleToClass(classId, PARENT_AUDIENCE)) {
                byId.putIfAbsent(n.getThongBaoId(), n);
            }
        }
        return byId.values().stream()
                .sorted(Comparator.comparing(ThongBao::getNgayDang).reversed())
                .collect(Collectors.toList());
    }

    public Map<String, Object> getRewards(String username, Long childId) {
        HoSoPhuHuynh profile = resolveProfile(resolveUser(username));
        HoSoHocSinh child = profile.getDanhSachHocSinh().stream()
                .filter(c -> c.getHocSinhId().equals(childId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Học sinh không thuộc phụ huynh này"));
        return studentService.buildRewardsPayload(child);
    }

    // QT01.3 - Luồng 2, Ưu tiên 1: PH tự cấp lại mật khẩu cho con
    @Transactional
    public void resetChildPassword(String username, Long childId, String newPassword) {
        HoSoPhuHuynh profile = resolveProfile(resolveUser(username));

        HoSoHocSinh child = profile.getDanhSachHocSinh().stream()
                .filter(c -> c.getHocSinhId().equals(childId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Học sinh không thuộc phụ huynh này"));

        NguoiDung childUser = child.getNguoiDung();
        childUser.setMatKhauHash(passwordEncoder.encode(newPassword));
        childUser.setBatBuocDoiMk(true);
        userRepository.save(childUser);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSubjectTree(String username, Long childId, Integer subjectId) {
        HoSoPhuHuynh profile = resolveProfile(resolveUser(username));
        HoSoHocSinh child = profile.getDanhSachHocSinh().stream()
                .filter(c -> c.getHocSinhId().equals(childId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Học sinh không thuộc phụ huynh này"));
        return studentService.buildSubjectTree(child, subjectId);
    }

    // ── Private helpers ───────────────────────────────────────────────────────────

    private NguoiDung resolveUser(String username) {
        return userRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
    }

    private HoSoPhuHuynh resolveProfile(NguoiDung user) {
        return parentProfileRepository.findByNguoiDung_NguoiDungId(user.getNguoiDungId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ phụ huynh"));
    }

    private List<PhuHuynhDashboardResponse.ActivityDto> buildActivities(List<Long> childIds) {
        if (childIds.isEmpty()) return Collections.emptyList();
        return evaluationRepository.findByBaiNop_HocSinh_HocSinhIdInOrderByThoiDiemChamDesc(childIds, PageRequest.of(0, 5))
                .stream()
                .map(eval -> PhuHuynhDashboardResponse.ActivityDto.builder()
                        .title("Bài tập - " + eval.getBaiNop().getBaiTap().getTieuDe())
                        .type(eval.getBaiNop().getBaiTap().getLoaiBaiTap() == LoaiBaiTap.H5P ? "Bài tập H5P" : "Bài tự luận")
                        .badge(eval.getXepLoai() != null ? eval.getXepLoai().name() : "Đã chấm điểm")
                        .build())
                .collect(Collectors.toList());
    }

    private List<PhuHuynhDashboardResponse.AlertDto> buildAlerts(List<HoSoHocSinh> children) {
        List<Long> classRoomIds = children.stream()
                .filter(c -> c.getLopHoc() != null)
                .map(c -> c.getLopHoc().getLopHocId())
                .distinct()
                .collect(Collectors.toList());

        if (classRoomIds.isEmpty()) return Collections.emptyList();

        return assignmentRepository.findByLopHoc_LopHocIdInOrderByDeadlineAsc(classRoomIds)
                .stream()
                .filter(a -> a.getDeadline() != null && a.getDeadline().isAfter(LocalDateTime.now()))
                .limit(3)
                .map(a -> PhuHuynhDashboardResponse.AlertDto.builder()
                        .title("Sắp đến hạn nộp bài!")
                        .description("Bài tập \"" + a.getTieuDe() + "\" sẽ hết hạn vào "
                                + a.getDeadline().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) + ".")
                        .build())
                .collect(Collectors.toList());
    }

    private List<PhuHuynhDashboardResponse.AnnouncementDto> buildAnnouncements(HoSoPhuHuynh profile) {
        return resolveVisibleNotifications(profile).stream()
                .limit(3)
                .map(n -> PhuHuynhDashboardResponse.AnnouncementDto.builder()
                        .title(n.getTieuDe())
                        .content(n.getNoiDung())
                        .date(n.getNgayDang().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                        .tag(n.isLaGhim() ? "Ghim" : "Thông báo")
                        .build())
                .collect(Collectors.toList());
    }
}
