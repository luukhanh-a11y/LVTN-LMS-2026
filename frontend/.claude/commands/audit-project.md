---
description: Audit toàn bộ src/pages/ và src/components/, sinh report tổng hợp và top issue
---

# Audit Project — Titkul LMS

Quét toàn bộ frontend, sinh report tổng hợp lưu ra file.

Argument (optional): **$ARGUMENTS**
- Nếu trống: audit cả `src/pages/` và `src/components/`
- Nếu là `pages`: chỉ audit `src/pages/`
- Nếu là `components`: chỉ audit `src/components/`
- Nếu là path cụ thể (VD: `src/features/student`): chỉ audit path đó

## Workflow

### Step 1: Precheck

1. Xác nhận `design-system/MASTER.md` tồn tại. Nếu không → dừng và bảo user chạy `/bootstrap-design-system`.
2. Đọc MASTER.md 1 lần (cache trong context, không đọc lại cho mỗi file).
3. List các file `.tsx/.jsx` trong scope. Nếu > 30 file → hỏi user có muốn giới hạn không (ưu tiên top 10 file quan trọng nhất).

Hiển thị cho user:
```
Chuẩn bị audit [X] file trong scope [scope]:
[list 10 file đầu, ... nếu còn]

Ước lượng thời gian: [X phút]
Confirm? (yes / list / limit N)
```

### Step 2: Audit từng file (lightweight)

Với mỗi file, làm audit **nhanh** (không sâu như `/audit-page`):

1. Đọc file
2. Chấm điểm 0-10 dựa trên 8 tiêu chí:
   - Palette & color tokens
   - Typography (font + size + line-height)
   - Spacing (dùng token hay hard-code)
   - Semantic HTML & a11y (aria, role, alt)
   - Responsive (breakpoint dùng nhất quán)
   - Interactive states (hover/focus/active/disabled)
   - Loading/Error/Empty states
   - Icon (Lucide vs emoji vs asset lẻ)
3. Đếm số blocker (P0), warning (P1), suggestion (P2)

Không show detail cho từng file trong lúc chạy — chỉ progress:
```
[3/12] src/pages/StudentHome.tsx ... 6.5/10 (P0:2 P1:5 P2:8)
[4/12] src/pages/Login.tsx ... 8.5/10 (P0:0 P1:2 P2:3)
```

### Step 3: Tổng hợp & phát hiện pattern

1. **Bảng compliance** (sort compliance ↑, file yếu nhất lên đầu):
   | File | Role | Compliance | P0 | P1 | P2 | Effort |
   |------|------|-----------:|---:|---:|---:|:------:|
   | ... | student | 5.0/10 | 4 | 8 | 12 | Lớn |

2. **Top 10 issue phổ biến** (sort theo số file bị dính):
   | # | Issue | Files bị dính | Priority |
   |---|-------|--------------:|:--------:|
   | 1 | Thiếu focus state trên button | 18/25 | P0 |
   | 2 | Hardcode color hex thay vì Tailwind token | 15/25 | P1 |
   | ... |

3. **Quick wins** — fix 1 chỗ giải quyết nhiều file:
   - **Tạo shared `<Button variant="playful" />`**: fix issue #1, #3, #7 cho 18 file
   - **Extract `useVietnameseText` hook**: fix issue #4 cho 12 file
   - ...

4. **Bad file cần refactor toàn diện** (compliance < 5):
   - `src/pages/OldHome.tsx` — 3.0/10, đề xuất viết lại từ đầu theo MASTER.md

### Step 4: Lưu report

Ghi ra `design-system/audit-report-YYYY-MM-DD.md` với toàn bộ nội dung trên + timestamp + scope.

Show cho user:
```
✅ Audit xong.
📄 Report: design-system/audit-report-YYYY-MM-DD.md

Overview:
- Tổng file audit: [X]
- Compliance trung bình: [Y/10]
- Blocker (P0) toàn project: [Z]
- Ước lượng effort fix P0 + P1: [ngày người]

Đề xuất next step:
1. Xem 3 quick wins trong report — làm trước cho lời nhất
2. Chạy /audit-page với các file compliance thấp nhất để xem detail
3. Chạy /fix-ui P0 cho từng file quan trọng nhất
```

## Rule quan trọng

- **Không sửa file nào** trong quá trình audit.
- **Không đọc file `.test.tsx`, `.stories.tsx`** hoặc file trong `node_modules`, `dist`, `build`.
- Nếu file > 500 dòng → note "file lớn, có thể cần refactor split" trong report thay vì audit sâu.
- Ưu tiên precision hơn recall: chỉ liệt kê issue chắc chắn, không đoán mò.
- Report tiếng Việt.

## Anti-pattern

- ❌ Chạy 25 script python liên tiếp cho 25 file — chỉ chạy skill khi cần tra pattern lạ
- ❌ Report kiểu "có thể cần cải thiện" — phải cụ thể vị trí + chuẩn tham chiếu
- ❌ Ước lượng effort mà không dựa trên số line ước lượng đổi
