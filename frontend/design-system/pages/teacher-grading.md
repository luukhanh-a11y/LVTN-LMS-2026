# Teacher Grading — Page Override

> **PROJECT:** Titkul LMS
> **Page Type:** Chấm bài / Classroom management (Teacher UI)
> **Design Dials:** Variance 3/10, Motion 2/10, Density 7/10 (dày hơn Master mặc định vì cần xem nhiều bài cùng lúc)

> ⚠️ **QUAN TRỌNG:** Quy tắc trong file này **override** Master file (`design-system/MASTER.md`).
> Chỉ ghi lại phần khác biệt so với Master. Các quy tắc khác giữ nguyên theo Master.

---

## Bối cảnh

Giáo viên cần chấm nhiều bài nộp (essay, H5P) liên tiếp trong thời gian ngắn. Ưu tiên
tốc độ thao tác và giảm số click, không phải sự vui mắt.

## Layout Override

- **Layout:** hai cột — danh sách bài nộp bên trái (cố định, scroll riêng), chi tiết bài + form chấm điểm bên phải
- **Max width:** full-width trong content area (không giới hạn 1200px như landing page thông thường), tận dụng màn hình rộng của giáo viên
- **Density 7/10:** giảm padding row xuống `--space-xs` (4px) trong danh sách để hiển thị nhiều bài nộp hơn trong 1 màn hình

## Spacing Override

- Danh sách bài nộp: row height tối thiểu 48px (đủ target size cho click nhưng dày hơn card thông thường)
- Panel chấm điểm bên phải: padding `--space-lg` (24px), giữ thoáng hơn vì đây là nơi giáo viên đọc/viết nhận xét

## Typography Override

- Tên học sinh trong list: Be Vietnam Pro 500, 14px
- Nội dung bài làm học sinh (essay): Be Vietnam Pro 400, 16px, line-height 1.7 (cao hơn mức tối thiểu 1.6 vì đọc đoạn văn dài liên tục)
- Điểm số: Be Vietnam Pro 600, 20px, dùng tabular numbers (`font-variant-numeric: tabular-nums`) để cột điểm thẳng hàng

## Color Override

- Không override bảng màu — dùng `--pro-*` tokens
- Trạng thái bài nộp trong list dùng dot indicator nhỏ: chưa chấm = `--pro-muted`, đã chấm = `--pro-success`, cần chú ý (nộp trễ) = `--pro-warning`

## Component Override

### Submission list row (khác row chuẩn — dày đặc hơn, có dot trạng thái)

```css
.submission-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--pro-border);
  cursor: pointer;
  transition: background 150ms ease;
}
.submission-row:hover { background: var(--pro-bg); }
.submission-row.active { background: #EFF6FF; border-left: 3px solid var(--pro-primary); }
```

### Grading panel

```css
.grading-panel {
  background: var(--pro-surface);
  border: 1px solid var(--pro-border);
  border-radius: 12px;
  padding: 24px;
}
.grading-score-input {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  font-size: 20px;
  width: 80px;
  text-align: center;
}
```

## Page-Specific Components

- **Keyboard shortcut bar:** hiển thị phím tắt (vd. `→` bài tiếp theo, `Ctrl+S` lưu điểm) ở footer panel chấm bài — ưu tiên tốc độ cho giáo viên chấm nhiều bài
- **Bulk action bar:** khi chọn nhiều bài nộp cùng lúc, hiện thanh hành động (chấm hàng loạt, gửi nhận xét mẫu)

## Recommendations

- KHÔNG dùng animation khi chuyển giữa các bài nộp — chỉ fade nội dung panel phải trong 100-150ms để tránh giật mắt khi chấm liên tục
- Auto-save trạng thái nháp khi giáo viên gõ nhận xét, hiển thị chữ nhỏ "Đã lưu lúc HH:mm" thay vì toast notification (tránh làm phiền)
- Không dùng mascot Tit trong trang này
