# Audit Report — Titkul LMS Frontend (v2 — sau 3 quick win)

> **Ngày audit:** 2026-07-08 (lần 2, cùng ngày với lần 1)
> **Scope:** Đúng 10 file đã audit ở `audit-report-2026-07-08.md`, để so sánh apples-to-apples.
> **Đối chiếu chuẩn:** `design-system/MASTER.md`
> **Không sửa code** trong quá trình audit này.
> **Baseline trước đó:** `design-system/audit-report-2026-07-08.md` — compliance TB 5.8/10, P0:18 P1:19 P2:4

Đã áp dụng trước khi audit lần này (3 quick win qua `/fix-ui`):
1. `tailwind.config.js`: `colors.primary.DEFAULT` `#4F46E5` → `#4B9EFF` + thêm token `student.*`/`pro.*`/`clay-*`
2. `src/index.css`: thêm Google Fonts Baloo 2/Nunito/Be Vietnam Pro, `body` dùng `var(--font-body)` (Nunito) + `line-height:1.6`, heading `line-height:1.4`
3. `src/components/ui/Button.tsx`: thêm variant `student-primary` và `pro-primary` (giữ nguyên 6 variant cũ)

---

## 1. Bảng Compliance (so sánh trước/sau)

| File | Role | Trước | Sau | Δ | P0 | P1 | P2 | Effort |
|------|------|------:|----:|--:|---:|---:|---:|:------:|
| `src/pages/student/Assignments.tsx` | student | 4.0 | 5.0 | +1.0 | 2 | 1 | 1 | Vừa |
| `src/pages/admin/Dashboard.tsx` | admin | 5.0 | 6.0 | +1.0 | 1 | 2 | 0 | Vừa |
| `src/pages/student/Dashboard.tsx` | student | 5.5 | 6.5 | +1.0 | 1 | 2 | 1 | Vừa |
| `src/pages/auth/Login.tsx` | shared | 6.0 | 7.0 | +1.0 | 1 | 1 | 2 | Nhỏ |
| `src/pages/teacher/Dashboard.tsx` | teacher | 5.5 | 6.5 | +1.0 | 1 | 2 | 0 | Nhỏ |
| `src/pages/teacher/Grading.tsx` | teacher | 6.0 | 7.0 | +1.0 | 1 | 2 | 1 | Nhỏ |
| `src/components/ui/Button.tsx` | shared | 6.0 | 7.5 | +1.5 | 0 | 2 | 0 | Nhỏ |
| `src/pages/admin/Users.tsx` | admin | 6.5 | 7.5 | +1.0 | 0 | 2 | 0 | Nhỏ |
| `src/pages/parent/Dashboard.tsx` | parent | 6.5 | 7.5 | +1.0 | 0 | 2 | 0 | Nhỏ |
| `src/pages/parent/Assignments.tsx` | parent | 7.0 | 7.5 | +0.5 | 1 | 1 | 0 | Nhỏ |

**Compliance trung bình: 5.8/10 → 6.8/10 (+1.0)** | **P0: 18 → 8 (−56%)** | **P1: 19 → 17** | **P2: 4 → 5**

---

## 2. Vì sao cải thiện không đều

- **Cải thiện tự động (không cần sửa file đó):** `teacher/Grading.tsx`, `parent/Dashboard.tsx`, `admin/Users.tsx` hưởng lợi trực tiếp từ việc đổi giá trị token `primary` (#4F46E5→#4B9EFF), vì các file này đã dùng alias `text-primary`/`focus:border-primary` sẵn từ trước — đúng như quick win dự đoán.
- **Không cải thiện phần palette:** `Login.tsx`, `student/Dashboard.tsx`, `student/Assignments.tsx`, `teacher/Dashboard.tsx`, `admin/Dashboard.tsx` hardcode thẳng `indigo-600`/`blue-600`/`amber-500`... (không qua alias `primary`) nên đổi token không có tác dụng — vẫn cần sửa từng file.
- **Font & line-height cải thiện toàn bộ 10/10 file** (issue global đã đóng), nhưng phát sinh 1 issue mới nhẹ hơn: xem mục 3, issue #1.
- **`Button.tsx` cải thiện nhiều nhất (+1.5)** vì vấn đề kiến trúc gốc (không tách Student/Pro) đã được giải quyết bằng 2 variant mới — nhưng **chưa file nào trong 10 file dùng variant mới này** (xem mục 3, issue #4).

---

## 3. Top issue còn lại (sort theo số file bị dính)

| # | Issue | Files bị dính | Priority |
|---|-------|--------------:|:--------:|
| 1 | Font-family sai vai trò: `body` global giờ là Nunito (đúng cho Student) nhưng Teacher/Parent/Admin đáng lẽ phải dùng Be Vietnam Pro theo MASTER.md — chưa có cơ chế set font theo role ở tầng layout | 6/10 (`teacher/Dashboard`, `teacher/Grading`, `parent/Dashboard`, `parent/Assignments`, `admin/Dashboard`, `admin/Users`) | P1 |
| 2 | Palette vẫn hardcode Tailwind mặc định (`indigo-600`, `blue-600`, `amber-500`, `violet-800`...) ở nơi KHÔNG dùng alias `primary`, không hưởng lợi từ quick win #1 | 5/10 (`Login`, `student/Dashboard`, `student/Assignments`, `teacher/Dashboard`, `admin/Dashboard`) | P0 |
| 3 | Variant `student-primary`/`pro-primary` mới trong `Button.tsx` **chưa được page nào sử dụng** — quick win #3 mới dừng ở mức "component sẵn sàng", chưa áp dụng thực tế | 10/10 (gián tiếp) | — (ghi nhận riêng, không tính điểm trừ) |
| 4 | Heading (`h1`) trong Student UI (`Login`, `student/Dashboard`) chưa áp `font-heading` (Baloo 2) — vẫn kế thừa font-body mặc định | 2/10 | P2 |
| 5 | Icon ngoài Lucide — `student/Assignments.tsx` vẫn dùng `<img src="icons8.com/...">` | 1/10 | P0 |
| 6 | Đỏ gắt cho trạng thái lỗi ở `student/Assignments.tsx` (`red-500`/`red-100`) — vẫn vi phạm tone "không doạ" cho học sinh | 1/10 | P1 |
| 7 | Label/`<select>` không liên kết `htmlFor`/`id`/`aria-label` (`Login.tsx`, `teacher/Grading.tsx`) | 2/10 | P1 |

---

## 4. Quick wins tiếp theo

- **Set `font-pro` (Be Vietnam Pro) ở tầng layout theo role** (VD: `DashboardLayout` cho Teacher/Parent/Admin) thay vì chỉ set 1 font-body toàn cục.
  → Fix issue #1 cho 6 file cùng lúc, không cần sửa từng page.

- **Migrate `<Button>` trong `Login.tsx` và `student/Dashboard.tsx` sang `variant="student-primary"`; `teacher/Dashboard.tsx` và `admin/Dashboard.tsx` sang `variant="pro-primary"`.**
  → Biến quick win #3 (đã làm ở component) thành cải thiện thực tế trên UI, đồng thời tự động fix một phần issue #2 (màu primary) cho các nút bấm ở 4 file này.

- **Tạo shared `<PageTitle>` áp `font-heading`** dùng cho mọi `<h1>` trong Student UI.
  → Fix issue #4 cho 2 file, tránh phải nhớ thêm class thủ công mỗi lần viết heading mới.

---

## 5. File cần refactor toàn diện (compliance < 5)

- Không còn file nào dưới 5.0/10 (file thấp nhất trước là `student/Assignments.tsx` giờ đạt 5.0/10). Vẫn khuyến nghị ưu tiên sửa file này trước (icon ngoài + màu đỏ gắt là 2 vấn đề tập trung, effort không lớn).

---

## Overview

- Tổng file audit: 10 (giống lần 1, để so sánh)
- Compliance trung bình: **6.8/10** (tăng từ 5.8/10)
- Blocker (P0) còn lại: **8** (giảm từ 18, −56%)
- Ước lượng effort fix P0+P1 còn lại (25 issue): ~1.5-2 ngày người, phần lớn co lại còn nửa ngày nếu làm 3 quick win tiếp theo ở mục 4 trước

## Đề xuất next step

1. Làm 3 quick win ở mục 4 (đặc biệt migrate Button variant — hiện thực hoá công sức đã bỏ ra ở lần fix trước)
2. Sửa riêng `student/Assignments.tsx` (icon ngoài + màu đỏ) — file duy nhất còn nhiều P0 tập trung
3. Sau đó mở rộng audit sang 49 file còn lại trong `src/pages/` để có bức tranh đầy đủ
