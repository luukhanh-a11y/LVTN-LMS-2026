package com.titkul.lms.service;

import com.titkul.lms.dto.XuLyPhieuHoTroRequest;
import com.titkul.lms.dto.PhieuHoTroResponse;
import com.titkul.lms.dto.PhieuHoTroRequest;
import com.titkul.lms.entity.PhieuHoTro;
import com.titkul.lms.entity.TrangThaiPhieu;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.repository.PhieuHoTroRepository;
import com.titkul.lms.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhieuHoTroService {

    private final PhieuHoTroRepository ticketRepository;
    private final NguoiDungRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public PhieuHoTroResponse createTicket(String teacherUsername, PhieuHoTroRequest request) {
        NguoiDung teacher = userRepository.findByTenDangNhap(teacherUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên"));
        NguoiDung student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh"));

        PhieuHoTro ticket = new PhieuHoTro();
        ticket.setTeacher(teacher);
        ticket.setStudent(student);
        ticket.setLoaiYeuCau(request.getType() != null ? request.getType() : "RESET_MAT_KHAU");
        ticket.setMoTa(request.getDescription());
        ticket.setTrangThai(TrangThaiPhieu.CHO_DUYET);

        ticket = ticketRepository.save(ticket);
        return mapToDto(ticket);
    }

    @Transactional(readOnly = true)
    public List<PhieuHoTroResponse> getTicketsByTeacherUsername(String teacherUsername) {
        NguoiDung teacher = userRepository.findByTenDangNhap(teacherUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên"));
        return ticketRepository.findByTeacher_NguoiDungIdOrderByNgayTaoDesc(teacher.getNguoiDungId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhieuHoTroResponse> getPendingTickets() {
        return ticketRepository.findByTrangThaiOrderByNgayTaoAsc(TrangThaiPhieu.CHO_DUYET)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public PhieuHoTroResponse processTicket(Long ticketId, String adminUsername, XuLyPhieuHoTroRequest request) {
        PhieuHoTro ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu hỗ trợ"));
        NguoiDung admin = userRepository.findByTenDangNhap(adminUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Admin"));

        if (ticket.getTrangThai() != TrangThaiPhieu.CHO_DUYET) {
            throw new RuntimeException("Phiếu này đã được xử lý");
        }

        ticket.setTrangThai(request.getStatus());
        ticket.setAdmin(admin);
        ticket.setGhiChuXuLy(request.getAdminNote());
        ticket.setNgayXuLy(LocalDateTime.now());

        if (request.getStatus() == TrangThaiPhieu.DA_DUYET && "RESET_MAT_KHAU".equals(ticket.getLoaiYeuCau())) {
            NguoiDung student = ticket.getStudent();
            // Reset mật khẩu về mặc định (ví dụ: số điện thoại hoặc mã học sinh, hoặc chuỗi cố định)
            // Lấy username của học sinh làm mật khẩu mặc định luôn
            student.setMatKhauHash(passwordEncoder.encode(student.getTenDangNhap()));
            student.setBatBuocDoiMk(true);
            userRepository.save(student);
        }

        ticket = ticketRepository.save(ticket);
        return mapToDto(ticket);
    }

    private PhieuHoTroResponse mapToDto(PhieuHoTro ticket) {
        PhieuHoTroResponse dto = new PhieuHoTroResponse();
        dto.setId(ticket.getPhieuId());
        dto.setTeacherId(ticket.getTeacher().getNguoiDungId());
        dto.setTeacherName(ticket.getTeacher().getTenDangNhap()); // Should map to profile name if available
        dto.setStudentId(ticket.getStudent().getNguoiDungId());
        dto.setStudentName(ticket.getStudent().getTenDangNhap()); // Should map to profile name if available
        dto.setType(ticket.getLoaiYeuCau());
        dto.setDescription(ticket.getMoTa());
        dto.setStatus(ticket.getTrangThai().name());
        dto.setAdminNote(ticket.getGhiChuXuLy());
        dto.setCreatedAt(ticket.getNgayTao());
        dto.setProcessedAt(ticket.getNgayXuLy());
        return dto;
    }
}
