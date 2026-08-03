# TÀI LIỆU THIẾT KẾ REST API — LMS TITKUL KIDS (ĐÃ RÀ SOÁT)

Tài liệu này định nghĩa các tiêu chuẩn và danh sách API (chuẩn RESTful) cho dự án TITKUL LMS dựa trên 14 quy trình nghiệp vụ đã thống nhất và các phản hồi thực tế từ quá trình thiết kế UI.

---

## 1. CHIẾN LƯỢC QUẢN LÝ VERSION (Versioning Strategy)
- **URL Versioning:** `/api/v1/...`
- Dịch vụ **Spring Boot** sử dụng base URL: `https://api.titkul.com/api/v1`
- Dịch vụ **NestJS** sử dụng base URL: `https://h5p.titkul.com/api/v1`

## 2. AUTHENTICATION & AUTHORIZATION
- **Phương thức:** JSON Web Token (JWT) + Stateless.
- **Truyền token:** Truyền qua HTTP Header: `Authorization: Bearer <token>`.
- **RBAC:** Xác thực quyền dựa trên claim `role` trong JWT (ADMIN, GIAO_VIEN, HOC_SINH, PHU_HUYNH).

## 3. CHIẾN LƯỢC PHÂN TRANG (Pagination)
- **Tham số Query:** `?page=0&size=20&sort=ngayTao,desc`
- **Response Format (Spring Data Page chuẩn):**
  ```json
  {
    "data": [ ... ],
    "page": { "size": 20, "number": 0, "totalElements": 150, "totalPages": 8 }
  }
  ```

## 4. ĐỊNH DẠNG LỖI THỐNG NHẤT (Error Response Format)
```json
{
  "timestamp": "2026-06-19T14:30:00Z",
  "status": 400,
  "errorCode": "VALIDATION_ERROR",
  "message": "Dữ liệu đầu vào không hợp lệ",
  "path": "/api/v1/auth/login",
  "details": [
    { "field": "email", "issue": "Email không đúng định dạng" }
  ]
}
```

## 5. QUY TẮC VALIDATE & RATE LIMITING
- **Global Validation:** 
  - Chống XSS (Sanitize input), `@Email`, `@Pattern` SĐT VN.
- **Rate Limiting:**
  - **Public API (Login/Quên MK):** 5 requests/phút/IP.
  - **Private API:** 100 requests/phút/User. Trả về `429 Too Many Requests`.

---

## 6. DANH SÁCH ENDPOINTS CHI TIẾT (Spring Boot Core)

### 6.1. Auth & Identity (QT01)
| HTTP | URL Path | Vai trò | Mô tả |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Public | Đăng nhập hệ thống (trả về JWT). |
| POST | `/api/v1/auth/forgot-password` | Public | Quên MK chủ động (PH/GV/Admin). |
| POST | `/api/v1/tickets` | GV | GV tạo Phiếu hỗ trợ xin Cấp lại mật khẩu cho Học sinh. |
| PATCH | `/api/v1/tickets/{id}/approve` | Admin | Admin duyệt Phiếu hỗ trợ -> Hệ thống tự reset MK Học sinh. |

### 6.2. Quản lý Lớp học & Dữ liệu (QT03, QT04)
| HTTP | URL Path | Vai trò | Mô tả |
|---|---|---|---|
| GET | `/api/v1/classes` | Admin, GV | Lấy danh sách lớp (GV chỉ thấy lớp mình quản lý). |
| GET | `/api/v1/classes/{id}/students` | Admin, GV | Lấy chi tiết HS trong lớp (Hiển thị đầy đủ thông tin cá nhân HS như đã góp ý). |
| POST | `/api/v1/admin/import/users` | Admin | Import Excel (All-or-Nothing). Rollback nếu dính 1 lỗi. |

### 6.3. Học liệu & H5P (QT05, QT06)
| HTTP | URL Path | Vai trò | Mô tả |
|---|---|---|---|
| GET | `/api/v1/materials` | GV, HS | Lấy danh sách kho học liệu (có filter Khối, Môn). |
| POST | `/api/v1/internal/materials` | API Nội bộ | NestJS gọi sang Spring Boot để lưu record sau khi tạo H5P. |

### 6.4. Bài tập & Chấm điểm (QT07, QT08, QT10)
| HTTP | URL Path | Vai trò | Mô tả |
|---|---|---|---|
| GET | `/api/v1/assignments?classId={id}` | GV, HS | Lấy DS bài tập (Có filter theo lớp cho GV để dễ quản lý). |
| POST | `/api/v1/submissions` | HS | Học sinh nộp bài tự luận/trắc nghiệm (Bắt xAPI H5P). |
| GET | `/api/v1/assignments/{id}/submissions` | GV | Xem DS HS nộp bài của 1 bài tập cụ thể. |
| POST | `/api/v1/submissions/{id}/evaluate` | GV | Chấm bài **Định tính** (Không dùng điểm số theo chuẩn Tiểu học). |

### 6.5. Truyền thông nội bộ (QT13)
| HTTP | URL Path | Vai trò | Mô tả |
|---|---|---|---|
| POST | `/api/v1/announcements` | GV | Đăng thông báo. Có payload `audience`: PARENT / STUDENT / ALL. |
| GET | `/api/v1/announcements` | HS, PH | Xem thông báo (PH chỉ thấy thông báo PARENT/ALL của lớp con). |

### 6.6. Trí tuệ Nhân tạo - Gemma2 (QT06, QT10, QT14)
| HTTP | URL Path | Vai trò | Mô tả |
|---|---|---|---|
| POST | `/api/v1/ai/suggestions/evaluation` | GV | Gợi ý nhận xét học sinh từ Gemma2. Trạng thái: NHAP. |
| GET | `/api/v1/ai/reports/morning` | GV | Báo cáo tóm tắt lớp buổi sáng. Cache: UNIQUE(GV, Lớp, Ngày). |

---

## 7. JSON EXAMPLES (Các Endpoint Quan trọng)

### 7.1. Giáo viên đăng Thông báo phân quyền (Đã cập nhật theo yêu cầu thực tế)
**POST `/api/v1/announcements`**
```json
{
  "classId": 5,
  "title": "Nhắc nhở đóng học phí tháng 6",
  "content": "Kính nhờ Quý phụ huynh hoàn tất học phí trước ngày 15/06.",
  "audience": "PARENT", 
  "isPinned": true
}
```

### 7.2. Import Excel All-or-Nothing
**POST `/api/v1/admin/import/users`**
```json
{
  "timestamp": "2026-06-19T14:40:00Z",
  "status": 422,
  "errorCode": "IMPORT_VALIDATION_FAILED",
  "message": "Quá trình Import thất bại. Vui lòng sửa file và thử lại.",
  "details": [
    { "row": 15, "issue": "Mã học sinh 'HS001' đã tồn tại trong hệ thống." }
  ]
}
```

### 7.3. Giáo viên chấm bài Định tính (Đã chấn chỉnh: Không dùng Điểm số)
**POST `/api/v1/submissions/{id}/evaluate`**
```json
{
  "evaluationType": "HOAN_THANH_TOT",
  "comment": "Con làm bài rất cẩn thận, nét chữ đẹp. Tiếp tục phát huy nhé!",
  "action": "DUYET" 
}
```
