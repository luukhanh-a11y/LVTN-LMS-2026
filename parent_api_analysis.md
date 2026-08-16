# Phân tích API dành cho Phụ Huynh trong hệ thống BE

Tương tự như giáo viên, dưới đây là danh sách các API quan trọng mà Phụ Huynh (Parent) sẽ sử dụng để theo dõi tình hình học tập của con em mình.

---

## 1. Quản lý Hồ sơ Phụ Huynh (`HoSoPhuHuynhController`)

API để phụ huynh xem và cập nhật thông tin cá nhân của mình.

- **Endpoints chính:** 
  - `GET /api/hoso-phuhuynh/my-profile`: Lấy thông tin hồ sơ bằng Token.
  - `PUT /api/hoso-phuhuynh/{id}`: Cập nhật thông tin liên hệ.
- **Service Flow:** `HoSoPhuHuynhService` lấy user từ context (Token), tìm bản ghi tương ứng trong bảng `HoSoPhuHuynh`.
- **Cấu trúc DTO:**
  - **Request (`HoSoPhuHuynhRequest`)**: Các thông tin như họ tên, số điện thoại, nghề nghiệp.
  - **Response (`HoSoPhuHuynhResponse`)**: Trả về `phuHuynhId`, `hoTen`, `soDienThoai` và các liên kết tới tài khoản NguoiDung.

---

## 2. Liên kết Phụ Huynh - Học Sinh (`PhuHuynhHocSinhController`)

API để lấy danh sách các con (học sinh) mà phụ huynh này đang quản lý/theo dõi. 

- **Endpoints chính:** 
  - `GET /api/phu-huynh-hoc-sinh/hoc-sinh/phu-huynh/{idUser}`: Lấy danh sách các học sinh thuộc về một phụ huynh (thường gọi ngay sau khi login để chọn profile con).
- **Service Flow:** `PhuHuynhHocSinhService` truy vấn bảng trung gian `PhuHuynhHocSinh` dựa trên ID của phụ huynh, map ra các `HoSoHocSinh` liên quan.
- **Cấu trúc DTO:**
  - **Response (`PhuHuynhHocSinhResponse`)**:
    - Chứa `hoSoPhuHuynhResponse` (thông tin ba/mẹ).
    - Chứa `hoSoHocSinhResponse` (thông tin chi tiết của con: tên, mã học sinh, trường, lớp).
    - `quanHe` (String): Mối quan hệ (Cha, Mẹ, Người giám hộ).
    - `thoiDiemLienKet`.

---

## 3. Xem Tiến Độ Học Tập của Con (`TienDoHocSinhController`)

API để phụ huynh xem con mình đã học đến đâu, hoàn thành bài giảng nào.

- **Endpoints chính:** 
  - `GET /api/tien-do-hoc-sinh/tra-cuu?hocSinhId={hocSinhId}&baiHocId={baiHocId}`: Xem tiến độ của 1 bài học cụ thể.
- **Service Flow:** Truy xuất thông tin từ `TienDoHocSinhRepository` để xem số `%` hoàn thành, thời gian học.
- **Cấu trúc DTO:**
  - **Response (`TienDoHocSinhResponse`)**: 
    - Bao gồm `phanTramHoanThanh` (VD: 80%).
    - `thoiGianHoc` (tổng số phút/giây).
    - `daHoanThanh` (Boolean: đã học xong chưa).
    - Các trường flattened: `hoTenHocSinh`, `tenBaiHoc`.

---

## 4. Xem Bảng Điểm Trung Bình (`ThongKeDiemController`)

Học sinh không hiển thị chức năng này để giảm áp lực thành tích, nhưng **Phụ Huynh bắt buộc phải có** để theo dõi điểm số của con. Phụ huynh sẽ truyền vào `hocSinhId` của con mình.

- **Endpoints chính:** 
  - `GET /api/thong-ke-diem/hoc-sinh/{hocSinhId}/hoc-ky/{hocKyId}`: Xem điểm phẩy các môn học.
- **Cấu trúc DTO:**
  - **Response (`DiemTrungBinhMonResponse`)**: Bao gồm chi tiết: `monHocId`, `maMon`, `tenMon`, `diemTrungBinhBaiTap` (điểm từ bài GV giao), `diemTrungBinhTuHoc` (điểm tự luyện trên sách), và `diemTrungBinhChung` (điểm phẩy tổng hợp). Dùng dữ liệu này để vẽ biểu đồ hoặc bảng điểm cho phụ huynh xem.

---

## 5. Xem Kết Quả Tổng Kết Cuối Năm (`KetQuaCuoiNamController`)

Chức năng đặc quyền dành cho Phụ Huynh xem con mình được xếp loại gì (Học sinh Giỏi, Khá...), có được lên lớp hay không vào cuối mỗi năm học.

- **Endpoints chính:** 
  - `GET /api/ket-qua-cuoi-nam/hoc-sinh/{hocSinhId}/nam-hoc?namHoc=2026-2027`
- **Service Flow:** Truy xuất từ `KetQuaCuoiNamRepository` (dữ liệu do Giáo Viên Chủ Nhiệm đã chốt duyệt).
- **Cấu trúc DTO:**
  - **Response (`KetQuaCuoiNamResponse`)**:
    - `ketQuaHocTap`: Enum (TOT, KHA, DAT, CHUA_DAT...).
    - `ketQuaRenLuyen`: Enum.
    - `quyetDinh`: Enum (Ví dụ: `LEN_LOP`, `O_LAI_LOP`).
    - `ghiChu` và `tenGiaoVienXet`.

---

## 6. Xem Bộ Sưu Tập Huy Hiệu (`KhenThuongHocSinhController`)

API để phụ huynh xem danh sách các huy hiệu/phần thưởng mà con mình đã đạt được do giáo viên trao tặng.

- **Endpoints chính:**
  - `GET /api/khen-thuong-hoc-sinh/hoc-sinh/{hocSinhId}`: Lấy toàn bộ danh sách huy hiệu của học sinh.
- **Cấu trúc DTO:**
  - **Response (`KhenThuongHocSinhResponse`)**: Trả về các trường như `tenHuyHieu`, `hinhAnh`, `moTaHuyHieu`, `tenGiaoVienTang`, `ngayTang`, và `tinNhanKhenThuong`.

---

## 7. Xem Lịch Sử Chuyển Lớp (`LichSuChuyenLopController`)

Tra cứu lại lịch sử thăng cấp/chuyển lớp qua các năm học của con mình.

- **Endpoints chính:**
  - `GET /api/lich-su-chuyen-lop/hoc-sinh/{hocSinhId}`: Lấy lịch sử chuyển lớp.
- **Cấu trúc DTO (`LichSuChuyenLopResponse`)**:
  - `lopCuId`, `tenLopCu`, `namHocCu` (Lớp cũ).
  - `lopMoiId`, `tenLopMoi`, `namHocMoi` (Lớp mới).
  - `lyDo` (Enum như Lên lớp, Ở lại lớp, Chuyển trường), `ghiChu`, `thoiDiemChuyen`.

---

## 8. Các API dùng chung (Common APIs)

### 8.1. Cấu hình Hệ thống (`CauHinhHeThongController`)
- **Endpoints chính:** `GET /api/cau-hinh-he-thong` (Gọi ngay khi load ứng dụng).
- **Cấu trúc DTO (`CauHinhHeThongResponse`)**: Trả về `tenTruong`, `logoUrl`, `hocKyHienTaiId`, `soHocKyHienTai`, `tenNamHocHienTai`.

### 8.2. Thông báo (`ThongBaoController`)
- **Endpoints chính:** `GET /api/thongbao/nguoi-dung/{idNguoiDung}` (Dùng cho quả chuông ở Header).
- **Cấu trúc DTO (`ThongBaoResponse`)**: `thongBaoId`, `tieuDe`, `noiDung`, `loaiThongBao`.

### 8.3. Hỗ trợ & Trợ giúp (`PhieuHoTroController`)
- **Endpoints chính:** `POST /api/phieu-ho-tro` (Gửi ticket hỗ trợ kỹ thuật hoặc thắc mắc tới Admin).

### 8.4. Xác thực và Tài khoản (`AuthenticationController` & `NguoiDungController`)
- **Endpoints chính:** Login, Logout, Forgot Password, Update Password...

### 8.5. Dữ liệu Danh mục (`HocKyController` & `NamHocController`)
- Cho phép phụ huynh chọn "Học kỳ" (`HocKyResponse`) hoặc "Năm học" (`NamHocResponse`) trong các bộ lọc khi xem Bảng điểm hoặc Kết quả cuối năm.

---

## Tóm tắt định hướng thiết kế UI/UX cho Phụ Huynh
1. **Lựa chọn Profile Con (Child Selector):** Phụ huynh cần giao diện Dropdown/Avatar để chọn bé muốn theo dõi ngay từ Header (Gọi `PhuHuynhHocSinhController`).
2. **Dashboard Tổng Quan (Parent Dashboard):** Hiển thị tổng quan Tiến độ bài học (`TienDoHocSinh`) và Góc thành tích (`KhenThuongHocSinh`).
3. **Màn hình Bảng Điểm & Báo Cáo Chuyên Sâu:** 
   - Đây là màn hình **cực kỳ quan trọng đối với phụ huynh**. Vẽ biểu đồ cột/đường từ dữ liệu `ThongKeDiemController` để so sánh điểm bài tập và điểm tự học.
   - Panel hiển thị kết quả tổng kết cuối năm (Lên lớp, Ở lại lớp, Xếp loại) từ `KetQuaCuoiNamController`.
   - Lịch sử quá trình học tập qua các năm từ `LichSuChuyenLopController`.
