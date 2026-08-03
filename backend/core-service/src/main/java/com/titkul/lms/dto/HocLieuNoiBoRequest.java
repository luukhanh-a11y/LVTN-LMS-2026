package com.titkul.lms.dto;

import lombok.Data;

// DTO nhận từ NestJS (h5p-service) mỗi khi GV lưu/cập nhật một học liệu H5P.
@Data
public class HocLieuNoiBoRequest {
    private String h5pContentId;
    private String tieuDe;
    private String loaiHocLieu; // TAI_LIEU / BAI_GIANG_H5P / BAI_TAP_H5P
    private String nguonGoc;    // THU_VIEN_GOC / GIAO_VIEN_TAO
    private Long giaoVienId;    // NguoiDung id (nguoi_dung_id) của GV, không phải giao_vien_id
    private Short khoiLop;      // Khối lớp — chỉ gửi khi tạo mới, null thì giữ nguyên giá trị cũ
    private Integer monHocId;   // Môn học — chỉ gửi khi tạo mới, null thì giữ nguyên giá trị cũ
}
