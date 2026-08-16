# Phân tích API dành cho Admin (Quản trị viên) trong hệ thống BE

Admin (hoặc Content Creator) có toàn quyền kiểm soát hệ thống, từ quản lý người dùng đến việc biên soạn nội dung giảng dạy. Dưới đây là phân tích chi tiết các luồng API, Endpoints, Request và Response dành cho màn hình Quản trị.

---

## 1. Dashboard & Báo Cáo Thống Kê
Màn hình đầu tiên khi Admin đăng nhập, cung cấp số liệu tổng quan.

- **Endpoints chính:**
  - `GET /api/admin/dashboard`
- **Cấu trúc DTO (`AdminDashboardResponse`)**: 
  - Trả về các số liệu thống kê như tổng số học sinh, giáo viên, số lớp học, số bài tập đã giao... để vẽ các biểu đồ tổng quan.

---

## 2. Quản lý Người Dùng (`NguoiDungController`)
Nơi Admin quản lý mọi tài khoản (Giáo viên, Học sinh, Phụ huynh) trong hệ thống.

- **Endpoints chính:**
  - `GET /api/nguoi-dung` (hoặc `/api/nguoi-dung/search?role={..}&keyword={..}`): Lấy danh sách tài khoản có phân trang.
  - `POST /api/nguoi-dung`: Tạo tài khoản mới.
  - `PUT /api/nguoi-dung/{id}`: Cập nhật thông tin cơ bản.
  - `PUT /api/nguoi-dung/{id}/role`: Phân quyền (Thay đổi Vai trò).
  - `PUT /api/nguoi-dung/{id}/trang-thai`: Khóa/Mở khóa tài khoản.
- **Cấu trúc DTO:**
  - **Request (`NguoiDungCreateRequest` / `NguoiDungRequest`)**: Gửi lên `tenDangNhap`, `matKhau`, `email`, `soDienThoai`.
  - **Response (`NguoiDungResponse`)**: Backend đã tổng hợp dữ liệu từ nhiều bảng và trả về: `nguoiDungId`, `tenDangNhap`, `vaiTro`, `trangThai`, `email`, `soDienThoai`, `hoTen` (dùng chung). Ngoài ra còn có các trường riêng biệt như `maHocSinh`, `tenLop` (nếu là học sinh), hoặc `maGiaoVien`, `boMon` (nếu là giáo viên), hoặc `tenCon` (nếu là phụ huynh) để hiển thị ngay trên bảng DataTable.

*(Lưu ý: Để sửa hồ sơ chi tiết hơn, Admin gọi tới `HoSoGiaoVienController`, `HoSoHocSinhController`, hoặc `HoSoPhuHuynhController` với cơ chế tương tự).*

---

## 3. Quản lý Cấu trúc Trường Học
Thiết lập danh mục gốc cho nhà trường.

### 3.1. Môn Học (`MonHocController`)
- **Endpoints:** `GET /api/mon-hoc`, `POST /api/mon-hoc`, `PUT /api/mon-hoc/{id}`
- **Request (`MonHocRequest`)**: `maMon`, `tenMonHoc`, `moTa`, `trangThai`.
- **Response (`MonHocResponse`)**: `monHocId`, `maMon`, `tenMonHoc`...

### 3.2. Lớp Học (`LopHocController`)
- **Endpoints:** `GET /api/lophoc`, `POST /api/lophoc`
- **Request (`LopHocRequest`)**: `tenLop`, `khoiLop`, `siSoToiDa`, `namHocId`.
- **Response (`LopHocResponse`)**: Trả về chi tiết lớp, niên khóa và sĩ số hiện tại.

### 3.3. Năm Học & Học Kỳ (`NamHocController`, `HocKyController`)
- **Endpoints:** `POST /api/nam-hoc`, `POST /api/hoc-ky`
- **Request/Response**: Định nghĩa các mốc thời gian học (`tenNamHoc`, `soHocKy`, `ngayBatDau`, `ngayKetThuc`).

---

## 4. Phân Công Giảng Dạy (`PhanCongGiangDayController`)
Admin gắn kết Giáo viên với Lớp học và Môn học.

- **Endpoints chính:**
  - `POST /api/phan-cong-giang-day`
  - `GET /api/phan-cong-giang-day`
- **Cấu trúc DTO:**
  - **Request (`PhanCongGiangDayRequest`)**: `giaoVienId`, `lopHocId`, `monHocId`, `hocKyId`.
  - **Response (`PhanCongGiangDayResponse`)**: Trả về chuỗi thông tin liên kết (`tenGiaoVien`, `tenLop`, `tenMonHoc`, `tenHocKy`).

---

## 5. Quản lý Thư Viện Sách (`SachController`)
- **Endpoints chính:** `POST /api/sach`, `GET /api/sach`
- **Đặc biệt (Tính năng Clone):** `POST /api/sach/nhan-ban-kem-chu-de` hoặc `/nhan-ban-khong-chu-de` để nhân bản nhanh bộ sách sang học kỳ khác.
- **Request (`SachRequest`)**: `loaiSach`, `boSach`, `khoiLop`, `maMon`, `hocKyId`, `tenSach`, `anhBiaUrl`...
- **Response (`SachResponse`)**: Trả về toàn bộ chi tiết sách.

---

## 6. Biên soạn Câu Hỏi & Trò Chơi (Game Authoring - `DangBaiController`)
Tính năng độc quyền của Admin / Content Creator để soạn thảo các mini-game rèn luyện.

- **Endpoints chính:**
  - `POST /api/he-thong/dang-bai`: Tạo mới.
  - `PUT /api/he-thong/dang-bai/{id}`: Chỉnh sửa.
  - `POST /api/he-thong/dang-bai/nhan-ban?baiHocCuId={..}&baiHocMoiId={..}`: Sao chép câu hỏi.
- **Cấu trúc DTO:**
  - **Request (`DangBaiRequest`)**: Gửi lên `baiHocId`, `tenDangBai`, `loaiNoiDung` (Ví dụ: NATIVE), `nguonGoc` (HE_THONG), `xpThuong`. 
    - **Quan trọng nhất**: Khối dữ liệu Game phải truyền qua 2 trường chuỗi JSON độc lập là `duLieuGame` (dùng cho Frontend render màn hình trò chơi) và `dapAnChuan` (dùng cho Backend tự động chấm điểm).
  - **Response (`DangBaiResponse`)**: Trả về toàn bộ chi tiết game đã khởi tạo.

---

## 7. Các Công Cụ Quản Trị Khác

### 7.1. Cấu hình Hệ thống (`CauHinhHeThongController`)
- **Endpoints:** `PUT /api/cau-hinh-he-thong`
- **Request/Response**: `tenTruong`, `hocKyHienTaiId`, `namHocDanhGia` và cờ `danhGiaCuoiNamDangMo` (Boolean) để quyết định thời điểm giáo viên được phép chốt sổ học bạ.

### 7.2. Gửi Thông Báo Toàn Trường (`ThongBaoController`)
- **Endpoints:** `POST /api/thongbao/he-thong`
- **Request (`ThongBaoRequest`)**: Gửi lên `tieuDe`, `noiDung`, `loaiThongBao`. Hệ thống sẽ đẩy thông báo này tới chuông của mọi người dùng.

### 7.3. Công cụ Nhập liệu hàng loạt (`LoImportController`)
- **Endpoints:** `POST /api/import/upload` (hoặc trong `NguoiDungController` có `POST /api/nguoi-dung/import`).
- **Request**: Truyền qua chuẩn `MultipartFile` (Form Data chứa file Excel `.xlsx`).
- **Response**: Trả về trạng thái xử lý chuỗi (Bao nhiêu bản ghi thành công, bao nhiêu lỗi).

---

## Tóm tắt định hướng thiết kế UI/UX cho Admin
1. **Layout / Giao diện chính:** Thiết kế Sidebar bên trái (Quản lý User, Học Vụ, Nội Dung). Phần hiển thị chính dùng các DataTables (Bảng dữ liệu) có sẵn tính năng Pagination, Search, Filter.
2. **Form nhập liệu (CRUD Forms):** Các form tạo mới `Người dùng`, `Môn học`, `Lớp học` nên dùng Modal (Popup) để thao tác nhanh mà không cần chuyển trang.
3. **Màn hình Game Authoring (Đặc biệt):** Cần thiết kế một **Builder UI** chuyên dụng. Thay vì bắt Admin tự gõ JSON thủ công vào `duLieuGame` và `dapAnChuan`, Frontend nên cung cấp các Component kéo thả, thêm dòng (Ví dụ: Nhấn "Thêm lựa chọn" sẽ tự sinh ra `{id, noiDung}`), sau đó ấn nút "Lưu" thì Frontend tự động gom (Serialize) thành 2 chuỗi JSON chuẩn để gửi lên `DangBaiController`.
