# Parent Report — Page Override

> **PROJECT:** Titkul LMS
> **Page Type:** Báo cáo tiến độ con (Parent UI)
> **Design Dials:** Variance 3/10, Motion 2/10, Density 5/10 (trung bình — nhiều thông tin nhưng phụ huynh không phải chuyên gia dữ liệu như giáo viên)

> ⚠️ **QUAN TRỌNG:** Quy tắc trong file này **override** Master file (`design-system/MASTER.md`).
> Chỉ ghi lại phần khác biệt so với Master. Các quy tắc khác giữ nguyên theo Master.

---

## Bối cảnh

Phụ huynh xem tiến độ học tập của con, thường trên điện thoại, không thường xuyên
dùng dashboard phức tạp. Ưu tiên rõ ràng, dễ hiểu hơn là dày đặc dữ liệu.

## Layout Override

- **Max width:** 720px, căn giữa — tối ưu đọc trên mobile trước (phần lớn phụ huynh xem trên điện thoại)
- **Section order:**
  1. Chọn con (nếu có nhiều con) — dropdown/tab đơn giản ở đầu trang
  2. Tổng quan tuần này: số bài đã nộp, tỷ lệ hoàn thành, streak hiện tại (3 số liệu lớn, dễ quét)
  3. Danh sách bài tập gần đây kèm trạng thái và điểm/nhận xét giáo viên
  4. Biểu đồ tiến độ theo thời gian (đơn giản, line/bar chart, không quá 1 chart/màn hình)
  5. Lối tắt liên hệ giáo viên

## Spacing Override

- Content density thấp hơn Master mặc định của Teacher UI — padding card `--space-lg` (24px) thay vì `--space-md`, ưu tiên độ thoáng để dễ đọc trên điện thoại

## Typography Override

- Không override — dùng Be Vietnam Pro theo Master
- Số liệu tổng quan (vd. "92% hoàn thành"): Be Vietnam Pro 700, 28px — làm số liệu dễ quét nhất trên trang
- Nhận xét giáo viên hiển thị dạng quote, line-height 1.7 để đọc thoải mái

## Color Override

- Không override bảng màu — dùng `--pro-*` tokens
- Biểu đồ tiến độ dùng `--pro-primary` cho đường/cột chính, `--pro-accent` chỉ dùng cho điểm nhấn (vd. mốc cao nhất)

## Component Override

### Stat tile (số liệu tổng quan)

```css
.stat-tile {
  background: var(--pro-surface);
  border: 1px solid var(--pro-border);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}
.stat-tile .value {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-weight: 700;
  font-size: 28px;
  color: var(--pro-primary);
}
.stat-tile .label {
  font-size: 13px;
  color: var(--pro-muted);
}
```

### Teacher comment quote

```css
.teacher-comment {
  border-left: 3px solid var(--pro-accent);
  padding: 12px 16px;
  background: var(--pro-bg);
  border-radius: 0 8px 8px 0;
  font-style: normal;
  line-height: 1.7;
}
```

## Page-Specific Components

- **Child selector tab:** khi phụ huynh có nhiều con trong hệ thống, dùng tab ngang đơn giản (không dropdown ẩn) để chuyển nhanh giữa các con
- **Progress trend chart:** ưu tiên dùng thư viện chart nhẹ đã có sẵn trong stack, không thêm dependency mới; nhãn trục phải là tiếng Việt đầy đủ dấu, test với tên môn học dài (vd. "Tiếng Việt", "Đạo đức")

## Recommendations

- Không dùng progressive reveal / scroll-triggered storytelling — phụ huynh cần thấy toàn bộ thông tin quan trọng ngay khi mở trang, không cuộn qua nhiều "chapter"
- Hover/transition tối giản (150-200ms), không dùng hiệu ứng "climax CTA" hay hiệu ứng mang tính chuyển đổi/bán hàng
- Không dùng mascot Tit trong trang này
