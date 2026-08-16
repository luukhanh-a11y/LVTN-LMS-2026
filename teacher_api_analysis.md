# Phân tích API dành cho Giáo Viên trong hệ thống BE

Dựa trên cấu trúc Backend (Spring Boot), dưới đây là danh sách các API quan trọng mà Giáo viên (Teacher) sẽ sử dụng, kèm theo luồng hoạt động (Service flow) và cấu trúc Request/Response DTO để bạn thiết kế lại giao diện (UI).

---

## 1. Quản lý Hồ sơ Giáo viên (`HoSoGiaoVienController`)

API để giáo viên xem và cập nhật thông tin cá nhân của mình.

- **Endpoints chính:** 
  - `GET /api/hoso-giaovien/my-profile`: Lấy thông tin hồ sơ bằng Token.
  - `PUT /api/hoso-giaovien/{id}`: Cập nhật thông tin.
- **Service Flow:** `HoSoGiaoVienService` xác thực token qua `AuthenticationService`, truy xuất thông tin từ `HoSoGiaoVienRepository` và trả về.
- **Cấu trúc DTO:**
  - **Request (`HoSoGiaoVienRequest`)**: Chứa các thông tin cập nhật như họ tên, số điện thoại, ngày sinh, giới tính.
  - **Response (`HoSoGiaoVienResponse`)**: Trả về chi tiết `giaoVienId`, `hoTen`, `email`, `soDienThoai` và các thông tin liên kết người dùng.

---

## 2. Quản lý Phân công Giảng dạy (`PhanCongGiangDayController`)

API để giáo viên biết mình đang dạy những lớp nào, môn nào.

- **Endpoints chính:** 
  - `GET /api/phan-cong-giang-day/giao-vien/{giaoVienId}`: Lấy danh sách lớp được phân công.
- **Service Flow:** `PhanCongGiangDayService` truy vấn cơ sở dữ liệu để tìm tất cả các bản ghi phân công có chứa `giaoVienId` của giáo viên.
- **Cấu trúc DTO:**
  - **Request**: Không có (chỉ dùng Path Variable `giaoVienId`).
  - **Response (`PhanCongGiangDayResponse`)**: Bao gồm thông tin lớp học (`lopHocId`, tên lớp), môn học (`monHocId`, tên môn), và học kỳ.

---

## 3. Giao Bài Tập & Chi Tiết Bài Tập (`BaiTapController`, `ChiTietBaiTapController`)

API quản lý việc tạo bài tập mới, cấu hình deadline và gán bài tập cho lớp.

- **Endpoints chính:** 
  - `POST /api/bai-tap`: Tạo bài tập mới.
  - `GET /api/bai-tap/giao-vien/{giaoVienId}`: Lấy danh sách bài tập do giáo viên tạo.
  - `GET /api/bai-tap/lop-hoc/{lopHocId}`: Xem bài tập của một lớp cụ thể.
- **Service Flow (`BaiTapService.create`):** 
  1. Kiểm tra sự tồn tại của `GiaoVien`, `LopHoc`, `HocKy`.
  2. Lưu thực thể `BaiTap` vào CSDL.
  3. Gửi **Thông báo (Notification)** đến học sinh trong lớp về bài tập mới (Tên bài tập, Hạn nộp).
  4. Duyệt qua danh sách `ChiTietBaiTapRequest` và lưu vào bảng chi tiết thông qua `ChiTietBaiTapService`.
- **Cấu trúc DTO:**
  - **Request (`TaoBaiTapRequest`)**: 
    - Bao gồm `BaiTapRequest` (các field: `giaoVienId`, `lopHocId`, `hocKyId`, `tieuDe`, `moTa`, `loaiBaiTap`, `thoiDiemBatDau`, `deadline`, `soLanNopLaiToiDa`, `trangThai`).
    - Bao gồm danh sách `ChiTietBaiTapRequest`. Giáo viên sẽ chọn các câu hỏi/dạng bài (`DangBai`) từ Sách bài tập (`Sach`) hoặc Bài học (`BaiHoc`) để đưa vào Bài tập này. **Đặc biệt lưu ý:** Việc chọn chế độ giao diện (`cheDoGiaoDien` - ví dụ `MAC_DINH`, `GAME_A`, `GAME_B`) được thực hiện **riêng biệt cho từng dạng bài** trong danh sách, chứ không phải cấu hình chung cho toàn bộ bài tập.
  - **Response (`BaiTapResponse`)**: 
    - Trả về thông tin cơ bản kèm các trường đã làm phẳng (flattened) để tiện hiển thị trên UI: `tenGiaoVien`, `tenLop`, `tenNamHoc`, danh sách ID dạng bài, và thông tin `cheDoGiaoDien`.
    - Có các hàm Getter alias phục vụ trực tiếp cho React (ví dụ: `getIsPastDeadline()`).

---

## 4. Truy xuất Thư viện Nội dung (Sách, Chủ đề, Bài học, Dạng bài)

Để Giáo viên có thể "nhặt" các câu hỏi vào trong Bài tập, UI cần cung cấp một bộ lọc phân tầng (Drill-down) gọi qua các API sau:

1. **Chọn Sách Bài Tập (`SachController`)**:
   - `GET /api/sach/sach-bai-tap/phan-cong?giaoVienId={..}&lopHocId={..}&maMon={..}&hocKyId={..}`: Lấy danh sách Sách Bài Tập được phép dùng cho lớp/môn mà giáo viên đang dạy.
2. **Chọn Chủ đề (`ChuDeController`)**:
   - `GET /api/chude/sach/{sachId}`: Lấy danh sách chủ đề trong cuốn sách đã chọn.
3. **Chọn Bài học (`BaiHocController`)**:
   - `GET /api/bai-hoc/chu-de/{chuDeId}`: Lấy danh sách bài học thuộc chủ đề.
4. **Chọn Dạng bài / Câu hỏi (`DangBaiController`)**:
   - `GET /api/he-thong/dang-bai/bai-hoc/{baiHocId}`: Trả về danh sách các câu hỏi. Giáo viên sẽ tích chọn các câu hỏi từ danh sách này để tạo các `ChiTietBaiTapRequest`.

---

## 5. Xem Bài Làm Của Học Sinh (`BaiNopController`)

API để giáo viên xem danh sách các bài đã nộp từ học sinh để tiến hành chấm điểm.

- **Endpoints chính:** 
  - `GET /api/bai-nop/bai-tap/{baiTapId}/lop-hoc/{lopId}`: Lấy toàn bộ bài nộp của một lớp cho 1 bài tập.
- **Service Flow:** `BaiNopService` truy xuất các bài nộp thuộc về `baiTapId` và `lopId`, lấy ra file đính kèm, nội dung text của học sinh.
- **Cấu trúc DTO:**
  - **Request**: Path Variables.
  - **Response (`BaiNopResponse`)**: Bao gồm chi tiết của học sinh (`hocSinhId`, `hoTenHocSinh`), tiêu đề bài tập (`tieuDeBaiTap`), `noiDungText`, `fileDinhKem`, `chiTietBaiLam`, `diemTuDong`, `xpNhanDuoc`, `soLanLam`, `trangThai`, `laNopTre`, `thoiDiemNop`. Ngoài ra, DTO có sẵn các hàm Getter trả về alias cho UI React dễ parse như `score`, `xpEarned`, `isLate`, `status`.

### Cấu trúc JSON Phân tích Bài làm (`chiTietBaiLam` & `cauHinh`)
Đây là phần cốt lõi để hiển thị nội dung bài tập. Thay vì bắt giáo viên phải chơi lại game để xem học sinh làm gì, Frontend hoàn toàn có thể sử dụng các JSON này để vẽ lên một **Giao diện Review Mặc định** (Ví dụ: Hiển thị câu hỏi -> Hiển thị đáp án HS chọn -> Hiển thị `diemTuDong` (điểm hệ thống tự chấm)).

**Lưu ý:** Tất cả các `cauHinh` (Đề bài) đều kế thừa các trường cơ bản từ `NoiDungCoBan` gồm: `loai`, `giaoDien`, `cauHoi` (câu hỏi chính), `noiDung`, `hinhAnh`, `amThanh`, `video`. Các phần tử bên trong (như lựa chọn, vế nối) đều là `GameItemDTO` chứa `id`, `noiDung`, `hinhAnh`, `amThanh`.

1. **Dạng Trắc Nghiệm (TRAC_NGHIEM)**:
   - **`cauHinh` (Đề bài)**: Chứa thông tin câu hỏi (`thanhPhanCauHoi`) và danh sách các lựa chọn (`luaChon`).
   - **`chiTietBaiLam` (HS nộp)**: `{"dapAnDungId": "ID_đáp_án_đã_chọn"}`.

2. **Dạng Nối Cặp / Sắp xếp (NOI_CAP / SAP_XEP)**:
   - **`cauHinh` (Đề bài)**: Chứa danh sách các vế trái (`cotTrai`) và vế phải (`cotPhai`).
   - **`chiTietBaiLam` (HS nộp)**: Chứa danh sách các cặp HS đã nối: `{"capDung": [ {"traiId": "id_trai_1", "phaiId": "id_phai_1"}, ... ]}`. (Lưu ý: BE có hỗ trợ alias `capChon`).

3. **Dạng Điền Khuyết (DIEN_KHUYET)**:
   - **`cauHinh` (Đề bài)**: Chứa đoạn văn bản gốc (`thanhPhanDoanVan`) và cấu hình các ô điền (`danhSachCho` gồm `id`, `vanBanTruoc`, `vanBanSau`, `danhSachLuaChon` nếu là dropdown).
   - **`chiTietBaiLam` (HS nộp)**: Bản đồ ánh xạ ID chỗ trống và từ HS đã điền: `{"dapAnTheoCho": {"idChoTrong_1": "chữ học sinh gõ", "idChoTrong_2": "..."}}`. (Lưu ý: BE có hỗ trợ alias `traLoiTheoCho`).

4. **Dạng Tự Luận / Lý Thuyết (TU_LUAN / LY_THUYET)**:
   - Thường sử dụng thuộc tính `noiDungText` (chữ thuần/HTML) hoặc `fileDinhKem` (link ảnh/pdf) thay vì JSON phức tạp.

---

## 6. Chấm Điểm & Đánh Giá Bài Làm (`DanhGiaBaiLamController`)

API cốt lõi để giáo viên chấm điểm, cho nhận xét và cộng điểm kinh nghiệm (XP) cho học sinh.

- **Endpoints chính:** 
  - `POST /api/danh-gia-bai-lam`: Chấm bài.
  - `PUT /api/danh-gia-bai-lam/{id}`: Sửa điểm/nhận xét.
  - `GET /api/danh-gia-bai-lam/giao-vien/{giaoVienId}`: Xem lịch sử chấm bài.
- **Service Flow (`DanhGiaBaiLamService.create`):**
  1. Kiểm tra bài nộp (`baiNopId`) và giáo viên (`giaoVienId`) có tồn tại không.
  2. Lưu bản ghi `DanhGiaBaiLam` (chứa điểm, nhận xét, xếp loại).
  3. Gọi hàm `syncBaiNopAndStudentXp()`: 
     - Cập nhật trạng thái `BaiNop` thành `DA_CHAM` hoặc `YC_LAM_LAI` dựa vào hành động của giáo viên.
     - **Tính toán XP (Điểm kinh nghiệm)**: `XP Mới = Điểm Số * 10`.
     - Cập nhật XP thu được vào `BaiNop` và cộng dồn vào `TongXP` của `HoSoHocSinh`.
- **Cấu trúc DTO:**
  - **Request (`DanhGiaBaiLamRequest`)**: 
    - `baiNopId`: ID bài nộp.
    - `giaoVienId`: ID giáo viên chấm.
    - `diemSo`: Điểm số do giáo viên chốt (dạng số thập phân).
    - `xepLoai`: Enum xếp loại (VD: GIOI, KHA, TRUNG_BINH, YEU...).
    - `nhanXet`: Text nhận xét.
    - `hanhDong`: Enum (Ví dụ: `CHAP_NHAN`, `YC_LAM_LAI`).
  - **Response (`DanhGiaBaiLamResponse`)**: Trả về chi tiết bản đánh giá: `danhGiaId`, `baiNopId`, `giaoVienId`, `tenGiaoVien`, `diemSo`, `xepLoai`, `nhanXet`, `hanhDong`, `thoiDiemCham`.

### Phân Biệt Luồng Chấm Điểm (Tự Động vs Thủ Công)

Khi thiết kế giao diện chấm bài (Grading View), cần phân biệt rõ 2 luồng:
1. **Luồng tự động chấm (Dạng Game/Trắc nghiệm/Điền khuyết/Nối cặp):**
   - Khi học sinh nộp bài, hệ thống đã tự động tính ra `diemTuDong` (nằm trong `BaiNopResponse`).
   - Giao diện giáo viên: Chỉ cần review (xem lại) bằng Giao diện Mặc định (hiển thị câu hỏi + đáp án HS chọn + đáp án đúng). Mức điểm tự động sẽ được điền sẵn vào ô `diemSo` để giáo viên tham khảo. Giáo viên có thể bấm "Chấp nhận" ngay lập tức, hệ thống sẽ lưu `DanhGiaBaiLam` bằng chính mức `diemTuDong` đó.
2. **Luồng chấm thủ công (Dạng Tự luận/Lý thuyết/Upload file):**
   - Hệ thống không thể chấm tự động (không có JSON `chiTietBaiLam` để parse). Học sinh nộp qua `noiDungText` (soạn thảo) hoặc `fileDinhKem`.
   - Giao diện giáo viên: Bắt buộc giáo viên phải mở text/file lên đọc, sau đó tự tay nhập số vào ô `diemSo`, nhập `xepLoai` và `nhanXet` rồi mới nhấn "Chấp nhận".

---

## 7. Thống Kê Điểm Số (`ThongKeDiemController`)

API để giáo viên xem kết quả trung bình môn của học sinh.

- **Endpoints chính:** 
  - `GET /api/thong-ke-diem/hoc-sinh/{hocSinhId}/hoc-ky/{hocKyId}`: Lấy danh sách điểm trung bình các môn của 1 học sinh.
- **Service Flow:** `ThongKeDiemService` tổng hợp điểm từ các bài tập, bài thi trong kỳ của học sinh đó.
- **Cấu trúc DTO:**
  - **Response (`DiemTrungBinhMonResponse`)**: Bao gồm chi tiết: `monHocId`, `maMon`, `tenMon`, `diemTrungBinhBaiTap` (điểm từ bài GV giao), `diemTrungBinhTuHoc` (điểm tự luyện trên sách), và `diemTrungBinhChung` (điểm phẩy tổng hợp).

---

## 8. Theo Dõi Tiến Độ Học Sinh (`TienDoHocSinhController`)

API để giáo viên xem tiến độ học tập (phần trăm hoàn thành, số phút học) của học sinh trong các bài giảng.

- **Endpoints chính:** 
  - `GET /api/tien-do-hoc-sinh/tra-cuu?hocSinhId={hocSinhId}&baiHocId={baiHocId}`: Xem tiến độ của học sinh trong một bài học.
- **Service Flow:** `TienDoHocSinhService` truy xuất dữ liệu từ bảng `TienDoHocSinh` ghi nhận bởi hệ thống mỗi khi học sinh tương tác với bài học.
- **Cấu trúc DTO:**
  - **Response (`TienDoHocSinhResponse`)**: Bao gồm `% hoàn thành` (`phanTramHoanThanh`), `thời gian học` (`thoiGianHoc`), và cờ `daHoanThanh`.

---

## 9. Tổng kết & Đánh giá Cuối Năm (`KetQuaCuoiNamController`)

API đặc biệt quan trọng dành cho **Giáo viên chủ nhiệm** vào cuối mỗi năm học để xét duyệt hạnh kiểm, học lực và quyết định lên lớp.

- **Endpoints chính:**
  - `POST /api/ket-qua-cuoi-nam/thong-bao-mo-danh-gia`: Phát thông báo mở đợt đánh giá cho toàn bộ GV chủ nhiệm (thường do Admin/Tổ trưởng gọi, nhưng GV cũng có thể thấy thông báo này).
  - `POST /api/ket-qua-cuoi-nam/duyet-hang-loat`: Duyệt kết quả cuối năm cho cả lớp (xác nhận hạnh kiểm, học lực, quyết định lên lớp). **Lưu ý quan trọng cho UI/UX:** Tính năng (nút bấm) này **chỉ được phép hiển thị** khi thỏa mãn 2 điều kiện: (1) Giáo viên đó là **Giáo viên chủ nhiệm** của lớp đang xem, và (2) Biến cờ `danhGiaCuoiNamDangMo` (lấy từ API Cấu hình hệ thống) phải đang là `true`.
- **Service Flow:** `KetQuaCuoiNamService.duyetHangLoat` nhận một danh sách học sinh kèm kết quả xếp loại, lưu vào cơ sở dữ liệu để đánh dấu `daDuyet = true` và chốt sổ học bạ.
- **Cấu trúc DTO:**
  - **Request (`KetQuaCuoiNamDuyetRequest`)**: Danh sách ID học sinh và các lựa chọn xếp loại (Giỏi, Khá...), quyết định (`LEN_LOP`, `O_LAI_LOP`).
  - **Response (`KetQuaCuoiNamResponse`)**: Trả về chi tiết kết quả từng học sinh sau khi duyệt xong.

---

## 10. Ứng Dụng AI Hỗ Trợ Giáo Viên (`GoiYAiNhanXetController`, `GoiYAiBaiTapController`)

Hệ thống tích hợp AI để giúp giáo viên giảm tải công việc khi ra đề và chấm bài.

- **Endpoints chính:**
  - `POST /api/goi-y-ai-bai-tap`: Nhập khối lớp (`grade`), môn học (`subjectId`) và chủ đề (`topicHint`), AI sẽ tự động sinh ra danh sách các gợi ý để giáo viên có ý tưởng tạo bài tập mới.
  - `POST /api/goi-y-ai-nhan-xet/bai-nop/{baiNopId}`: Dựa vào bài làm thực tế của học sinh, AI sẽ tự động sinh ra các lời nhận xét phù hợp để giáo viên tham khảo trước khi lưu chấm điểm.
  - `POST /api/goi-y-ai-nhan-xet/{goiYId}/chon`: API để ghi nhận giáo viên đã chốt chọn gợi ý nào của AI.

---

## 11. Trao Khen Thưởng / Huy Hiệu (`KhenThuongHocSinhController`)

API cho phép giáo viên chủ động trao tặng huy hiệu hoặc phần thưởng cho học sinh để khích lệ thành tích học tập.

- **Endpoints chính:**
  - `POST /api/khen-thuong-hoc-sinh/tang-thu-cong`: Tặng huy hiệu thủ công cho học sinh (Giáo viên truyền thông tin học sinh và loại huy hiệu muốn tặng).
  - `GET /api/khen-thuong-hoc-sinh/hoc-sinh/{hocSinhId}`: Xem danh sách các huy hiệu mà học sinh đó đã nhận được.

---

## 12. Các API dùng chung (Common APIs)

Ngoài các luồng nghiệp vụ riêng biệt, Giáo viên cũng sử dụng chung các API hệ thống (xuất hiện trên Header, Sidebar, Footer hoặc các Dropdown Form):

### 12.1. Cấu hình Hệ thống (`CauHinhHeThongController`)
- **Endpoints chính:** `GET /api/cau-hinh-he-thong` (Gọi **ngay khi load ứng dụng**).
- **Cấu trúc DTO (`CauHinhHeThongResponse`)**:
  - Các thông tin UI: `tenTruong`, `logoUrl`, `diaChi`, `hotline`, `emailLienHe`.
  - Phục vụ Filter mặc định: `hocKyHienTaiId`, `soHocKyHienTai`, `tenNamHocHienTai`.
  - Phục vụ logic nghiệp vụ: `danhGiaCuoiNamDangMo` (Boolean - quyết định việc bật/tắt hiển thị luồng Duyệt đánh giá cuối năm), `namHocDanhGia`.

### 12.2. Thông báo (`ThongBaoController`)
- **Endpoints chính:** `GET /api/thongbao/nguoi-dung/{idNguoiDung}`.
- **Cấu trúc DTO (`ThongBaoResponse`)**:
  - `thongBaoId`, `tenNguoiGui`, `tieuDe`, `noiDung`, `fileDinhKem`.
  - `loaiThongBao` (Enum), `laGhim` (Boolean), `ngayDang`.

### 12.3. Hỗ trợ & Trợ giúp (`PhieuHoTroController`)
- **Endpoints chính:** `POST /api/phieu-ho-tro` (Tạo ticket yêu cầu hỗ trợ).
- **Cấu trúc DTO:**
  - **Request (`PhieuHoTroRequest`)**: Gửi lên `loaiYeuCau`, `moTa`.
  - **Response (`PhieuHoTroResponse`)**: Trả về `phieuId`, `trangThai` (CHO_XU_LY, DA_XU_LY...), `ghiChuXuLy` (từ Admin), `ngayTao`, `ngayXuLy`.

### 12.4. Xác thực và Tài khoản (`AuthenticationController` & `NguoiDungController`)
- **Endpoints chính:**
  - `POST /api/auth/login` và `POST /api/auth/logout`: Đăng nhập / Đăng xuất khỏi hệ thống.
  - `POST /api/auth/forgot-password`: Quên mật khẩu. (Nhập email vào `ForgotPasswordRequest`, hệ thống sẽ gửi OTP).
  - `POST /api/auth/verify-otp-reset`: Xác nhận OTP. Nếu đúng, mật khẩu mới sẽ được gửi về email.
  - `PUT /api/nguoi-dung/{id}`: Đổi mật khẩu trực tiếp hoặc cập nhật email/sđt bằng `NguoiDungRequest`.

### 12.5. Dữ liệu Danh mục (Dropdowns & Filters)
- **`HocKyController` & `NamHocController`**: 
  - Trả về `HocKyResponse` (`hocKyId`, `tenNamHoc`, `soHocKy`) và `NamHocResponse` (`namHocId`, `tenNamHoc`). Dùng để tạo Dropdown lọc dữ liệu.
- **`LopHocController` & `MonHocController`**: 
  - Dùng chung để lấy ID và Tên chuẩn (VD: `LopHocResponse`, `MonHocResponse`).

---

## Tóm tắt định hướng thiết kế UI/UX cho Giáo viên
1. **Dashboard / Lịch giảng dạy:** Gọi API `PhanCongGiangDay` để hiển thị danh sách lớp.
2. **Quản lý bài tập (Giao bài):** 
   - Có form phức hợp (Complex Form) gửi `TaoBaiTapRequest` với UI chọn thời gian, chọn học kỳ.
   - Khi thêm nội dung bài tập, cần UI bộ lọc phân tầng (Drill-down): Gọi `SachController` -> `ChuDeController` -> `BaiHocController` -> `DangBaiController` để lọc và hiển thị danh sách câu hỏi.
   - Với **từng câu hỏi (DangBai)** được chọn, cho phép Giáo viên cấu hình **Chế độ giao diện (cheDoGiaoDien)** riêng biệt (Ví dụ: Câu 1 chọn hiển thị GAME_A, Câu 2 chọn hiển thị GAME_B).
   - Có nút "Tạo bằng AI" gọi `GoiYAiBaiTapController` để sinh gợi ý đề bài.
3. **Màn hình chấm bài (Grading View):** 
   - Danh sách bài nộp hiển thị bên trái (Gọi API `BaiNop`).
   - Khung xem nội dung bài ở giữa: Hiển thị bài làm của học sinh. Đối với các bài Game tự động chấm, UI hiển thị dạng **Review Mặc Định** (câu hỏi, đáp án đúng/sai, `diemTuDong`).
   - Panel chấm điểm bên phải: Nhập `diemSo`, dropdown `hanhDong`. Đặc biệt, có nút **"Gợi ý nhận xét AI"** gọi `GoiYAiNhanXetController` để tự động điền phần `nhanXet`.
4. **Header / Layout chung:** 
   - Tích hợp gọi API `ThongBaoController` (chuông thông báo).
   - Giáo viên có thể có thao tác **Trao huy hiệu (Khen thưởng)** cho học sinh nổi bật trực tiếp từ Bảng điểm hoặc lúc chấm bài.
