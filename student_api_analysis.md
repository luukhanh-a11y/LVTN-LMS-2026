# Phân tích API dành cho Học Sinh trong hệ thống BE

Dưới đây là danh sách các API quan trọng mà **Học sinh (Student)** sẽ sử dụng khi tương tác với nền tảng học tập, từ việc học kiến thức mới (Không gian Tự học) đến làm bài tập do giáo viên giao.

---

## 1. Quản lý Hồ sơ & Thông tin Cá nhân (`HoSoHocSinhController`)
API lấy thông tin cá nhân và đặc biệt là dữ liệu Gamification (trò chơi hóa) của học sinh.

- **Endpoints chính:** 
  - `GET /api/hoso-hocsinh/my-profile`: Lấy thông tin cá nhân của chính học sinh đang đăng nhập.
  - `GET /api/hoso-hocsinh/ma/{maHocSinh}`: Tra cứu hồ sơ học sinh bằng Mã Học Sinh.
- **Cấu trúc DTO (`HoSoHocSinhResponse`)**:
  - Thông tin định danh: `hocSinhId`, `hoTen`, `maHocSinh`.
  - Liên kết trường lớp: `lopHocId`, `tenLop`, `tenTruong`.
  - **Dữ liệu Gamification**: `tongXP` (Tổng điểm kinh nghiệm), `capDo` (Level hiện tại). UI có thể dùng 2 trường này để vẽ thanh tiến trình (Progress Bar) thăng cấp.

---

## 2. Truy cập Không gian Tự Học (Thư viện Sách & Bài học)
Học sinh có thể tự vào xem Sách giáo khoa, xem các bài học và tự làm bài tập rèn luyện (không cần giáo viên giao).

1. **Lấy sách giáo khoa (`SachController`)**:
   - `GET /api/sach/sach-giao-khoa/hoc-sinh/{hocSinhId}/hoc-ky/{hocKyId}`
   - **Response (`SachResponse`)**: Trả về `sachId`, `tenSach`, `anhBiaUrl`, `maMon`, `tenMonHoc`, `khoiLop`, `loaiSach`.
2. **Lấy chủ đề & bài học (`ChuDeController`, `BaiHocController`)**:
   - `GET /api/chude/sach/{sachId}` -> Trả về mảng `ChuDeResponse` (`chuDeId`, `tenChuDe`, `thuTu`).
   - `GET /api/bai-hoc/chu-de/{chuDeId}` -> Trả về mảng `BaiHocResponse` (`baiHocId`, `tenBaiHoc`, `thuTu`).
3. **Lấy nội dung trò chơi/câu hỏi (`DangBaiController`)**:
   - `GET /api/he-thong/dang-bai/bai-hoc/{baiHocId}/hoc-sinh`
   - **Response (`DangBaiStudentResponse`)**: Trả về `dangBaiId`, `tenDangBai`, `loaiNoiDung`, `duLieuGame` (Cấu trúc JSON trò chơi chưa có đáp án), `xpThuong`. 
   - *Lưu ý bảo mật:* DTO này đã được backend lược bỏ hoàn toàn các trường chứa đáp án đúng để chống gian lận.
4. **Cập nhật tiến độ học tập (`TienDoHocSinhController`)**:
   - `POST /api/tien-do-hoc-sinh/update-progress?hocSinhId={..}&baiHocId={..}`
   - Ghi nhận `daHoanThanh` bài học và trả về `TienDoHocSinhResponse` (`phanTramHoanThanh`, `thoiGianHoc`).
5. **Nộp bài Tự Học (`LichSuTuHocController`)**:
   - `POST /api/lich-su-tu-hoc/nop-bai`
   - **Request (`LichSuTuHocRequest`)**: Gửi lên `hocSinhId`, `dangBaiId`, `chiTietBaiLam` (Chuỗi JSON người dùng chọn).
   - **Response (`LichSuTuHocResponse`)**: Trả về điểm `diemTuDong`, `xpNhanDuoc`, và `soLanLam`.

---

## 3. Xem & Làm Bài Tập Do Giáo Viên Giao (`BaiTapController`, `BaiNopController`)
Luồng tính năng quan trọng nhất để học sinh làm bài tập về nhà.

1. **Lấy danh sách Bài tập (`BaiTapController`)**:
   - `GET /api/bai-tap/lop-hoc/{lopHocId}`
   - **Response (`BaiTapResponse`)**: Cung cấp `baiTapId`, `tieuDe`, `moTa`, `loaiBaiTap`, `thoiDiemBatDau`, `deadline`, `trangThai`, và `soLanNopLaiToiDa`.
2. **Lấy nội dung Bài tập (`DangBaiController`)**:
   - `GET /api/he-thong/dang-bai/bai-tap/{baiTapId}/hoc-sinh`
   - **Response (`DangBaiStudentResponse`)**: Tương tự luồng tự học, lấy ra mảng các trò chơi/câu hỏi không chứa đáp án.
3. **Nộp bài (`BaiNopController`)**:
   - `POST /api/bai-nop` 
   - **Request (`BaiNopRequest`)**: Gửi lên `baiTapId`, `hocSinhId`. Kèm theo:
     - `chiTietBaiLam`: Chuỗi JSON quá trình làm bài (áp dụng cho dạng Trắc nghiệm, Game).
     - Hoặc `noiDungText`, `fileDinhKem`: (áp dụng cho dạng Tự luận).
   - **Response (`BaiNopResponse`)**: Backend sẽ tự động chấm điểm nếu là game, trả về `diemTuDong`, `xpNhanDuoc`, `laNopTre`, `trangThai` (DA_NOP, DA_CHAM...).

> **Lưu ý đối với dạng bài Tự Luận (`loaiBaiTap` = `TU_LUAN`)**: Học sinh sẽ không chơi game hay tải giao diện JSON ở bước 2. Thay vào đó, học sinh đọc yêu cầu trực tiếp từ trường `moTa` (mô tả bài tập) của `BaiTapResponse`, sau đó nộp thẳng qua bước 3 (gửi `noiDungText` hoặc ảnh chụp bài làm vào `fileDinhKem`).

---

## 4. Góc Thành Tích (`KhenThuongHocSinhController`)
- `GET /api/khen-thuong-hoc-sinh/hoc-sinh/{hocSinhId}`
- **Response (`KhenThuongHocSinhResponse`)**: Xem danh sách các huy hiệu/danh hiệu được giáo viên tặng. Trả về `tenHuyHieu`, `moTaHuyHieu`, `hinhAnh`, `tenGiaoVienTang`, `ngayTang`, `tinNhanKhenThuong`.

---

## 5. Các API Dùng Chung (Common APIs)
Tương tự Giáo viên và Phụ huynh, Học sinh cũng sử dụng một số API cấu hình chung:

1. **Cấu hình Hệ thống (`CauHinhHeThongController`)**: 
   - `GET /api/cau-hinh-he-thong`
   - **Response (`CauHinhHeThongResponse`)**: Lấy `hotline`, `emailLienHe`, và `hocKyHienTaiId` để thiết lập giao diện (Ví dụ bộ lọc thời gian).
2. **Thông báo (`ThongBaoController`)**: 
   - `GET /api/thongbao/nguoi-dung/{idNguoiDung}`
   - **Response (`ThongBaoResponse`)**: Nhận danh sách thông báo mới (như `tieuDe`, `noiDung`, `loaiThongBao`).
3. **Tra cứu Lớp học hiện tại (`LopHocController`)**:
   - `GET /api/lophoc/hoc-sinh/{maHocSinh}`
   - **Response (`LopHocResponse`)**: Trả về chi tiết `tenLop`, `khoiLop`, `siSoHienTai`.
4. **Tài khoản (`AuthenticationController`, `NguoiDungController`)**: 
   - `POST /api/auth/login` / `logout`.
   - `POST /api/auth/forgot-password` và `verify-otp-reset` (Luồng OTP quên mật khẩu).
   - `PUT /api/nguoi-dung/{id}`: Đổi mật khẩu/cập nhật Profile qua `NguoiDungRequest`.

---

## Tóm tắt định hướng thiết kế UI/UX cho Học Sinh

1. **Không gian Trò chơi (Game UI):** 
   - Đây là màn hình cốt lõi nhất của Học sinh. Nó phải đọc mảng `DangBaiStudentResponse` để render (vẽ) ra các trò chơi (Trắc nghiệm, Nối cặp, Điền khuyết).
   - **Tương tác**: Khi học sinh click chọn đáp án, UI sẽ gom data thành chuỗi JSON chuẩn (Ví dụ `{ "dapAnDungId": "ABC" }`) và gọi `POST /api/bai-nop` (nếu là bài GV giao) hoặc `POST /api/lich-su-tu-hoc/nop-bai` (nếu là bài tự luyện).
2. **Dashboard / Gamification:** 
   - Giao diện Dashboard (Trang chủ) nên làm nổi bật Avatar, thanh Tiến trình thăng cấp (Level Bar) và tổng XP.
   - Thiết kế một khu vực "Góc thành tích" hoặc "Tủ kính" để hiển thị các huy hiệu lấp lánh (Badges).
3. **Danh sách Nhiệm vụ (To-do List):** 
   - Hiển thị danh sách các bài tập sắp tới hạn ở vị trí dễ nhìn thấy nhất để nhắc nhở học sinh (Gọi `BaiTapController`).

---

## Phụ lục: Cấu trúc JSON của Dạng Bài (`duLieuGame`)

Dữ liệu trò chơi trả về trong trường `duLieuGame` của `DangBaiStudentResponse` có cấu trúc rất linh hoạt dựa vào trường `loai`. Tất cả các dạng bài đều kế thừa các trường cơ bản sau (`NoiDungCoBan`):
- **Trường chung**: `loai` (loại game: LY_THUYET, TRAC_NGHIEM, NOI_CAP, DIEN_KHUYET), `giaoDien` (theme của game), `cauHoi` (câu lệnh yêu cầu), `noiDung` (văn bản mô tả), `hinhAnh`, `amThanh`, `video`.

### 1. Dạng Lý Thuyết
Khi `loai = "LY_THUYET"`, JSON sẽ không chứa các mảng đáp án, mà chỉ sử dụng chính các **trường chung** ở trên để hiển thị màn hình lý thuyết (chỉ gồm nội dung chữ `noiDung`, `hinhAnh` hoặc `video`). Giao diện sẽ giống như một trang trình chiếu (Slide).

### 2. Dạng Trắc Nghiệm (`NoiDungTracNghiem`)
Khi `loai = "TRAC_NGHIEM"`, JSON sẽ chứa:
- `thanhPhanCauHoi`: Mảng các `GameItemDTO` (chứa `id`, `noiDung`, `hinhAnh`, `amThanh`) đại diện cho nội dung câu hỏi ghép.
- `luaChon`: Mảng các `GameItemDTO` đại diện cho các đáp án A, B, C, D để học sinh click chọn.
- *(Bị ẩn ở Client)*: `dapAnDungId` (Backend dùng để chấm điểm).

### 3. Dạng Nối Cặp (`NoiDungNoiCap`)
Khi `loai = "NOI_CAP"`, JSON sẽ chứa:
- `cotTrai`: Mảng `GameItemDTO` nằm bên trái màn hình.
- `cotPhai`: Mảng `GameItemDTO` nằm bên phải màn hình.
- *(Bị ẩn ở Client)*: Mảng `capDung` chứa `{ "traiId": "...", "phaiId": "..." }` để chấm điểm đường nối.

### 4. Dạng Điền Khuyết (`NoiDungDienKhuyet`)
Khi `loai = "DIEN_KHUYET"`, JSON sẽ chứa:
- `thanhPhanDoanVan`: Mảng `GameItemDTO` chứa các thành phần tĩnh của đoạn văn.
- `danhSachCho`: Mảng các chỗ trống (`ChoTrong`), mỗi phần tử gồm:
  - `id`: Định danh chỗ trống.
  - `vanBanTruoc` / `vanBanSau`: Chữ hiển thị trước và sau ô input.
  - `danhSachLuaChon`: Mảng các từ gợi ý (Nếu là dạng trắc nghiệm điền từ).
- *(Bị ẩn ở Client)*: Mảng `dapAnDung` trong mỗi chỗ trống, và `dapAnTheoCho`.

**Ghi chú thành phần `GameItemDTO`:** Bất kỳ mảnh nội dung nào (đáp án, ô bên trái, ô bên phải...) đều là 1 object có chung cấu trúc: `{ id, noiDung, hinhAnh, amThanh, type, elements }`. UI cần viết Component dùng chung để render cái này.
