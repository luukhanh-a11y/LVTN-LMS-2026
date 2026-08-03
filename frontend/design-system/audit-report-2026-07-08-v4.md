# Audit Report — Titkul LMS Frontend (v4 — sau 9 item fix P0-P1)

> **Ngày audit:** 2026-07-08 (lần 4)
> **Scope:** Đúng 10 file đã audit ở v1/v2/v3, để so sánh xuyên suốt.
> **Đối chiếu chuẩn:** `design-system/MASTER.md`
> **Không sửa code** trong quá trình audit này.

Đã áp dụng trước khi audit lần này (9 item qua `/fix-ui`, scope P0-P1 của report v3):
1. `student/Assignments.tsx` — icon ngoài `icons8.com` → Lucide (`ClipboardList`, `Puzzle`); đỏ gắt → `student-error`/`rose-700`
2. `teacher/Grading.tsx` — hardcode `indigo-700/50` (select) → `pro-primary/pro-bg`; thêm `aria-label` cho 2 select
3. `student/Dashboard.tsx` — dọn hết `indigo`/`violet` hardcode → `student-primary`/`student-accent`; thêm mascot Tit thật
4. `admin/Dashboard.tsx` — 4 KPI card "cầu vồng" → map đúng token semantic `pro-*`; bar chart + warning list → `pro-*`
5. `teacher/Dashboard.tsx` — AI banner + icon Clock/BookOpen → `pro-*`
6. `Login.tsx` — `htmlFor`/`id` liên kết label-input
7. `Button.tsx` — variant `kids` → gradient `student-accent→student-primary`; shadow pressed của `primary`/`danger` dùng `theme(colors.primary.hover)`/`theme(colors.red.800)`

---

## 1. Bảng Compliance — xuyên suốt 4 lần audit

| File | Role | v1 | v2 | v3 | v4 | Δ (v3→v4) | P0 | P1 | P2 |
|------|------|---:|---:|---:|---:|---:|---:|---:|---:|
| `student/Assignments.tsx` | student | 4.0 | 5.0 | 5.0 | 7.0 | +2.0 | 1 | 0 | 0 |
| `teacher/Dashboard.tsx` | teacher | 5.5 | 6.5 | 7.5 | 8.0 | +0.5 | 0 | 1 | 0 |
| `parent/Assignments.tsx` | parent | 7.0 | 7.5 | 8.0 | 8.0 | 0 | 1 | 0 | 0 |
| `parent/Dashboard.tsx` | parent | 6.5 | 7.5 | 8.0 | 8.0 | 0 | 0 | 1 | 0 |
| `student/Dashboard.tsx` | student | 5.5 | 6.5 | 7.0 | 8.5 | +1.5 | 0 | 0 | 0 |
| `Login.tsx` | shared | 6.0 | 7.0 | 8.0 | 8.5 | +0.5 | 0 | 1 | 1 |
| `admin/Dashboard.tsx` | admin | 5.0 | 6.0 | 7.0 | 8.5 | +1.5 | 0 | 0 | 0 |
| `teacher/Grading.tsx` | teacher | 6.0 | 7.0 | 7.5 | 8.5 | +1.0 | 0 | 0 | 1 |
| `admin/Users.tsx` | admin | 6.5 | 7.5 | 8.5 | 8.5 | 0 | 0 | 0 | 0 |
| `Button.tsx` | shared | 6.0 | 7.5 | 7.5 | 9.0 | +1.5 | 0 | 0 | 0 |

**Compliance trung bình: 5.8 → 6.8 → 7.4 → 8.25/10** | **P0: 18 → 8 → 7 → 2** | **P1: 19 → 17 → 10 → 3** | **P2: 4 → 5 → 3 → 2**

Không còn file nào dưới 7.0/10.

---

## 2. Top issue còn lại (tất cả đã thu hẹp về 1 file, không còn issue liên file)

| # | Issue | File | Priority |
|---|-------|------|:--------:|
| 1 | Vẫn còn hardcode `blue-600/700`, `green-500/600` cho nút hành động (ngoài phạm vi 2 item đã fix ở file này) | `student/Assignments.tsx` | P0 |
| 2 | Spinner loading vẫn hardcode `text-indigo-600` (không dùng token `pro-primary`) | `parent/Assignments.tsx` | P0 |
| 3 | Dữ liệu tĩnh (hardcode), không có loading/error/empty state thật — cần thêm gọi API, ngoài phạm vi UI/styling của `/fix-ui` | `teacher/Dashboard.tsx` | P1 |
| 4 | Các phần tử phụ vẫn hardcode `indigo-*` (link "Quên mật mã?", checkbox, nút nghe hướng dẫn, icon focus-within) — chỉ nút submit chính đã migrate | `Login.tsx` | P1 |
| 5 | Vài chỗ còn hardcode `blue-50`/`amber-500` cho badge/tag (không phải phần tử chính) | `parent/Dashboard.tsx` | P1 |
| 6 | `TableRow` chưa có hover state rõ ràng | `teacher/Grading.tsx` | P2 |
| 7 | Icon `Sparkles` trên nút submit vẫn dùng `text-indigo-200`, hơi lệch tông so với nền nút giờ đã là `student-primary` xanh | `Login.tsx` | P2 |

---

## 3. Không còn quick win liên file

Khác với 3 lần trước, tất cả 7 issue còn lại giờ chỉ ảnh hưởng **đúng 1 file mỗi issue** — không còn pattern lặp lại nhiều file để có thể "fix 1 chỗ, lợi nhiều nơi". Các bước tiếp theo là dọn nốt từng chỗ nhỏ, việc nhỏ giọt hơn nhưng project đã ở trạng thái tốt.

---

## 4. File cần refactor toàn diện (compliance < 5)

- Không còn file nào dưới 5.0/10 (và thực tế không còn file nào dưới 7.0/10).

---

## Overview

- Tổng file audit: 10 (giống v1/v2/v3)
- Compliance trung bình: **8.25/10** (từ 5.8 → 6.8 → 7.4 → 8.25 qua 4 lần)
- Blocker (P0) còn lại: **2** (từ 18 → 8 → 7 → 2)
- Ước lượng effort fix P0+P1 còn lại (5 issue, không tính P2): ~2-3 giờ, đều là sửa nhỏ 1 file/issue

## Đề xuất next step

1. Scope 10 file này đã đạt mức tốt (8.25/10 trung bình, P0 chỉ còn 2) — có thể coi là "đủ tốt" để chuyển hướng
2. Mở rộng audit sang 49 file còn lại trong `src/pages/` (đặc biệt các trang H5P player, reward, ticket chưa từng được xem) để đánh giá xem 3 layout đã sửa (`DashboardLayout`/`StudentLayout`/`AuthLayout`) có phủ đúng font cho toàn bộ ứng dụng
3. Nếu muốn hoàn thiện 100% scope hiện tại: fix 5 issue P0+P1 còn lại (ước lượng 2-3 giờ), đều là việc nhỏ độc lập từng file
