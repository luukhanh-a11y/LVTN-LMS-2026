# Vấn đề: Bài tập giao cho học sinh không hiển thị dạng game như mong muốn

## 1. Tóm tắt vấn đề

Giáo viên giao bài tập lấy từ **Vở bài tập Tiếng Việt 1 - Tập một, bài "E e, Ê ê"** (sách bài tập, `sach_id=92`). Khi học sinh vào làm bài tại trang bài tập được giao (`AssignmentQuizPlayer.tsx`), giao diện:

- Không hiển thị các lựa chọn đáp án dạng "trắc nghiệm để chọn" — chỉ hiện 1 ô nhập chữ tự do.
- Có 1 câu tự luận ("Câu 3: Ghép các chữ cái...") **không hiển thị bất kỳ ô nhập nào cả**.
- Vì câu 3 không có cách nào để "trả lời", validate "phải hoàn thành hết mọi câu" luôn chặn nút Nộp bài → không test được.

Yêu cầu của người dùng: đã có sẵn các component game (né bóng, ếch qua sông, đào vàng...) — muốn các bài tập dạng này hiển thị bằng đúng những game đó, thay vì form thô hiện tại.

## 2. Dữ liệu thật để tái hiện lỗi

```
sach_id = 92   → "Vở bài tập Tiếng Việt 1 - Tập một" (SACH_BAI_TAP, khối 1, môn TV, HK1)
chu_de_id = 398 → "Học vần - Âm và chữ cái"
bai_hoc_id = 1204 → "E e, Ê ê"
```

6 dạng bài (`dang_bai`) thuộc bài học này:

| dang_bai_id | Câu | loai (trong `du_lieu_game`) | Vấn đề |
|---|---|---|---|
| 2556 | 1a: chọn sự vật có chữ "e" | `DIEN_KHUYET` | `dapAnDung` là **mảng 2 giá trị** (`["ve","me"]`) nhưng ô nhập chỉ nhận 1 giá trị |
| 2557 | 1b: chọn sự vật có chữ "ê" | `DIEN_KHUYET` | Tương tự — đáp án là 2 tên file ảnh |
| 2558 | 2a: chọn e hoặc ê | `DIEN_KHUYET` | Có `danhSachLuaChon: ["e","ê"]` nhưng UI không hiển thị, học sinh phải tự gõ |
| 2559 | 2b: chọn e hoặc ê | `DIEN_KHUYET` | Tương tự 2558 |
| 2560 | 2c: chọn e hoặc ê | `DIEN_KHUYET` | Tương tự 2558 |
| 2561 | 3: Ghép chữ cái tạo tiếng | `TU_LUAN` | **Không có UI nào hiển thị cho loại này trong bộ câu hỏi gộp** → chặn nộp bài |

Bản thân dữ liệu `du_lieu_game` của câu 2556/2557 có sẵn ghi chú của người import:

```
"_ghiChu": "Loai goc tu API la \"checkbox\" (chon NHIEU dap an dung cung luc). He thong hien tai chi ho tro DIEN_KHUYET kieu \"1 cho trong, chap nhan nhieu gia tri nhung hoc sinh chi can dua 1 gia tri dung 1 lan\". Can dev bo sung loai CHON_NHIEU that su neu muon cham diem dung ngu nghia goc."
```
→ Đây là hạn chế đã biết từ trước, không phải lỗi mới.

**Đã xác nhận backend chấm điểm đúng**: `GameService.chamDiem()` (điểm 3 - Dạng Điền khuyết) chỉ yêu cầu học sinh gõ **1 giá trị trùng với 1 trong các đáp án chấp nhận** — không cần chọn đủ cả mảng. Vấn đề hoàn toàn nằm ở **frontend hiển thị**, không cần sửa backend.

## 3. Nguyên nhân gốc rễ

`AssignmentQuizPlayer.tsx` (trang học sinh làm **bài tập được giao**, gắn với `bai_tap`/`bai_nop`) tự viết lại phần hiển thị câu hỏi bằng tay, chỉ hỗ trợ 3 nhánh:

```jsx
{detail.loai === 'TRAC_NGHIEM' && ( ... radio buttons ... )}
{detail.loai === 'NOI_CAP' && ( ... select nối cặp ... )}
{detail.loai === 'DIEN_KHUYET' && ( ... <input> tự do, KHÔNG đọc danhSachLuaChon ... )}
```

Và với bộ câu hỏi gộp nhiều dạng bài (`NHIEU_CAU`), với mỗi câu con nó lại chỉ có 3 nhánh y hệt (TRẮC NGHIỆM / NỐI CẶP / ĐIỀN KHUYẾT) — **không có nhánh nào cho `TU_LUAN`**.

### Điều bất ngờ: hệ thống ĐÃ CÓ SẴN giải pháp đầy đủ hơn nhiều — chỉ là ở trang khác

Trang `LessonPlayer.tsx` (dùng cho học sinh tự học bài giảng, gắn với `tien_do_hoc_sinh`, KHÔNG phải bài tập được giao) đã build sẵn một cơ chế "chọn game theo loại câu hỏi" đầy đủ và đúng như người dùng mong muốn:

```jsx
const isHarvestGame     = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'THU_HOACH_NONG_SAN';
const isFrogGame        = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'ECH_QUA_SONG';
const isBalloonGame     = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'BAN_BONG_BAY';
const isMillionaireGame = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'TRIEU_PHU';
const isCatchingGame    = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'DUOI_BAT';
const isGoldMinerGame   = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'DAO_VANG';
const isMatchingGame    = loai === 'NOI_CAP'     && (cauHinh?.giaoDien === 'NOI_CAP_LINE' || !cauHinh?.giaoDien);
const isSortingGame     = loai === 'NOI_CAP'     && cauHinh?.giaoDien === 'PHAN_LOAI';
const isBeeGame         = loai === 'DIEN_KHUYET' && cauHinh?.giaoDien === 'ONG_TIM_MAT';
```

Kèm theo chuỗi fallback rất hợp lý:

```
H5PPlayer (nếu có nội dung H5P)
  → LyThuyetForm (nếu là lý thuyết)
  → TuLuanForm (nếu là TU_LUAN) ✅ ĐÃ CÓ SẴN, đúng thứ AssignmentQuizPlayer đang thiếu
  → 1 trong 9 game cụ thể (nếu loai + giaoDien khớp)
  → QuizForm (fallback CHUNG cho TRAC_NGHIEM/NOI_CAP/DIEN_KHUYET khi không khớp game riêng nào —
     đây là bản "form thường" nhưng làm ĐẦY ĐỦ hơn AssignmentQuizPlayer, có đọc danhSachCho/danhSachLuaChon)
  → Thông báo "Bài học chưa có nội dung tương tác" (fallback cuối)
```

Toàn bộ 9 game (`FrogGame`, `BalloonGame`, `MillionaireGame`, `HarvestGame`, `BeeGame`, `SortingGame`, `CatchingGame`, `GoldMinerGame`, `MatchingGame`) đều dùng chung 1 props interface đơn giản:

```ts
interface GameProps {
  cauHinh: any;          // cấu hình câu hỏi (câu hỏi, lựa chọn, hình ảnh...)
  result: any;            // kết quả sau khi chấm (null nếu chưa nộp)
  activeDapAnChuan: any;  // đáp án đúng, dùng để tô màu đúng/sai sau khi nộp
  onSubmit: (data) => void; // gọi khi học sinh chọn xong đáp án
}
```

`TuLuanForm` và `QuizForm` cũng theo pattern tương tự (`{cauHinh, result, onSubmit, submitting}`).

**Kết luận**: Không cần viết game mới. Cơ chế người dùng muốn **đã tồn tại và hoạt động** ở `LessonPlayer.tsx` — vấn đề là `AssignmentQuizPlayer.tsx` (trang bài tập được giao) chưa bao giờ dùng lại nó.

## 4. Điểm khác biệt cần lưu ý khi ghép 2 trang lại

Đây là phần **không thể copy-paste thẳng** mà cần thiết kế lại 1 chút:

| | `LessonPlayer.tsx` (tự học) | `AssignmentQuizPlayer.tsx` (bài tập được giao) |
|---|---|---|
| Đơn vị làm bài | Từng **dạng bài (câu hỏi) một**, chuyển câu tự động | Cả **bộ nhiều dạng bài gộp** (`NHIEU_CAU`) trong 1 `bai_tap`, nộp 1 lần cho tất cả |
| `onSubmit` hiện làm gì | Gọi chấm điểm/lưu tiến độ **ngay lập tức** cho câu đó | Ghi tạm vào state `dapAnNhieuCau[dangBaiId]`, chỉ thật sự gửi lên server khi bấm "Nộp bài" ở cuối |
| Bản ghi liên quan | `tien_do_hoc_sinh` | `bai_nop` (có giới hạn số lần nộp, deadline, chấm điểm...) |

→ Khi ghép game vào `AssignmentQuizPlayer.tsx`, prop `onSubmit` của từng game/form **không được gọi API chấm điểm ngay** như bên `LessonPlayer` — mà phải đổi hành vi thành "ghi nhận đáp án của câu này vào state tổng, không tự nộp", y hệt cách `DIEN_KHUYET` hiện tại đang set `dapAnNhieuCau[ch.id]`.

## 5. Đề xuất hướng giải quyết

### Bước 1 (bắt buộc, để test được ngay) — Thêm `TuLuanForm` vào bộ câu hỏi gộp
Trong nhánh `NHIEU_CAU` của `AssignmentQuizPlayer.tsx`, thêm 1 nhánh `ch.kieu === 'TU_LUAN'` dùng lại `TuLuanForm` (hoặc đơn giản 1 `<textarea>`), với `onSubmit` ghi vào `dapAnNhieuCau[ch.id]` thay vì gọi chấm điểm ngay. Việc này gỡ chặn nộp bài ngay lập tức.

### Bước 2 — Tái sử dụng đúng cơ chế chọn game của `LessonPlayer.tsx`
Trích xuất logic "chọn component theo `(loai, cauHinh.giaoDien)`" từ `LessonPlayer.tsx` thành 1 hàm/hook dùng chung (ví dụ `resolveQuestionComponent(loai, cauHinh)`), rồi dùng ở **cả 2 trang** thay vì để `AssignmentQuizPlayer.tsx` tự viết lại 3 nhánh thô. Nhờ vậy mỗi câu con trong bộ đề gộp sẽ tự động hiển thị đúng game tương ứng (nếu `cauHinh.giaoDien` có set) hoặc `QuizForm` (bản đầy đủ, có hiển thị lựa chọn cho Điền khuyết) khi không khớp game riêng nào.

### Bước 3 — Xử lý phần dữ liệu cũ thiếu `giaoDien`
Dữ liệu Vở bài tập TV1 hiện **không có field `giaoDien`** trong `cauHinh` (xem bảng ở mục 2) → sẽ không khớp bất kỳ game riêng nào, tự động rơi vào `QuizForm` (đã đúng, đủ dùng, nhưng không phải "game" theo đúng nghĩa hình ảnh sinh động). Có 2 lựa chọn, cần bạn quyết định:

- **(a)** Chấp nhận: những câu chưa gán `giaoDien` cụ thể sẽ hiện dạng form chuẩn (`QuizForm`), chỉ những câu GV/admin có gán `giaoDien` (qua "Chế độ hiển thị" khi giao bài — đã có sẵn ở `CreateAssignment.tsx` với 3 lựa chọn MAC_DINH/GAME_A/GAME_B) mới hiện game.
- **(b)** Đặt `giaoDien` mặc định theo `loai` khi dữ liệu import không có sẵn (ví dụ DIEN_KHUYET → mặc định `ONG_TIM_MAT`), để mọi câu đều ra game — nhưng cần kiểm tra từng game có tự xử lý tốt được cấu trúc "nhiều đáp án đúng trong 1 chỗ trống" (câu 2556/2557) hay không, tránh vỡ giao diện.

### Bước 4 — Test lại đúng bài "E e, Ê ê"
Sau khi làm xong bước 1-2, dùng lại chính bài tập giáo viên đã giao (dang_bai_id 2556-2561) để xác nhận: hiển thị đủ 6 câu, nộp được, điểm tính đúng theo `GameService.chamDiem()`.

## 6. Việc cần làm (checklist ngắn)

- [ ] Thêm nhánh `TU_LUAN` (dùng `TuLuanForm`) vào `AssignmentQuizPlayer.tsx` — ưu tiên cao nhất, gỡ chặn test.
- [ ] Trích xuất logic chọn game/form từ `LessonPlayer.tsx` thành helper dùng chung.
- [ ] Áp dụng helper đó cho từng câu trong bộ `NHIEU_CAU` ở `AssignmentQuizPlayer.tsx`, đổi `onSubmit` của mỗi game thành "ghi vào state tổng" thay vì "nộp ngay".
- [ ] Quyết định hướng xử lý dữ liệu thiếu `giaoDien` (phương án (a) hay (b) ở mục 5, bước 3).
- [ ] Test lại với bài "E e, Ê ê" (dang_bai_id 2556-2561) và ít nhất 1 bài loại TRAC_NGHIEM/NOI_CAP khác để đảm bảo không phá vỡ luồng đang chạy tốt.

Không cần sửa gì ở backend (`GameService.chamDiem`, `BaiNopService`) cho toàn bộ hướng giải quyết này — chấm điểm đã đúng, chỉ là frontend chưa hiển thị đúng.
