# Audit Report — Titkul LMS Frontend (v3 — sau fix layout font + Button migration)

> **Ngày audit:** 2026-07-08 (lần 3)
> **Scope:** Đúng 10 file đã audit ở v1/v2, để so sánh xuyên suốt 3 lần.
> **Đối chiếu chuẩn:** `design-system/MASTER.md`
> **Không sửa code** trong quá trình audit này.

Đã áp dụng trước khi audit lần này (4 item qua `/fix-ui`, dựa trên phát hiện bug `font-sans` hardcode ở 3 layout wrapper khiến fix `body` font ở v2 chưa có tác dụng thật):
1. `DashboardLayout.tsx`: `font-sans` → `font-pro` (Be Vietnam Pro cho Teacher/Parent/Admin)
2. `StudentLayout.tsx` + `AuthLayout.tsx`: `font-sans` → `font-body` (Nunito)
3. Migrate `<Button>`: `Login.tsx` → `variant="student-primary"`; `teacher/Dashboard.tsx` (nút "Chấm ngay") → `variant="pro-primary"`
4. Tạo `PageTitle.tsx` (font-heading/Baloo 2), áp cho tiêu đề chính ở `Login.tsx` và `student/Dashboard.tsx`

---

## 1. Bảng Compliance — xuyên suốt 3 lần audit

| File | Role | v1 | v2 | v3 | Δ (v2→v3) | P0 | P1 | P2 |
|------|------|---:|---:|---:|---:|---:|---:|---:|
| `student/Assignments.tsx` | student | 4.0 | 5.0 | 5.0 | 0 | 2 | 1 | 1 |
| `student/Dashboard.tsx` | student | 5.5 | 6.5 | 7.0 | +0.5 | 1 | 1 | 0 |
| `admin/Dashboard.tsx` | admin | 5.0 | 6.0 | 7.0 | +1.0 | 1 | 1 | 0 |
| `teacher/Dashboard.tsx` | teacher | 5.5 | 6.5 | 7.5 | +1.0 | 1 | 1 | 0 |
| `teacher/Grading.tsx` | teacher | 6.0 | 7.0 | 7.5 | +0.5 | 1 | 1 | 1 |
| `Button.tsx` | shared | 6.0 | 7.5 | 7.5 | 0 | 0 | 2 | 0 |
| `Login.tsx` | shared | 6.0 | 7.0 | 8.0 | +1.0 | 0 | 2 | 1 |
| `parent/Dashboard.tsx` | parent | 6.5 | 7.5 | 8.0 | +0.5 | 0 | 1 | 0 |
| `parent/Assignments.tsx` | parent | 7.0 | 7.5 | 8.0 | +0.5 | 1 | 0 | 0 |
| `admin/Users.tsx` | admin | 6.5 | 7.5 | 8.5 | +1.0 | 0 | 0 | 0 |

**Compliance trung bình: 5.8 → 6.8 → 7.4/10** | **P0: 18 → 8 → 7** | **P1: 19 → 17 → 10** | **P2: 4 → 5 → 3**

Không còn file nào dưới 5.0/10 (trước đó `student/Assignments.tsx` từng ở 4.0/10).

---

## 2. Đánh giá tác động của round fix vừa rồi

- **P1 giảm mạnh nhất (17 → 10)**: vì lần này font thực sự cascade đúng (round 2 chỉ sửa `body` CSS nhưng 3 layout wrapper override bằng `font-sans` khiến không có tác dụng — đã xác nhận và sửa tận gốc lần này). Toàn bộ 9/10 file (trừ `student/Assignments.tsx` do không đổi gì thêm ngoài font, và `Button.tsx` không thuộc layout nào) đóng được issue "sai font-family theo vai trò".
- **`admin/Users.tsx` đạt 8.5/10** — file sạch nhất, kiến trúc viewModel + shared component tốt, giờ chỉ còn thiếu polish nhỏ, không phát hiện P0/P1 cụ thể nào còn sót.
- **`student/Assignments.tsx` giữ nguyên 5.0/10** — không nằm trong phạm vi 4 item vừa fix (không dùng Button, không phải layout), 2 vấn đề tập trung (icon ngoài + màu đỏ gắt) vẫn còn nguyên.
- **`Button.tsx` giữ nguyên 7.5/10** — không có thay đổi thêm ở component này trong round vừa rồi.

---

## 3. Top issue còn lại (sort theo số file bị dính)

| # | Issue | Files bị dính | Priority |
|---|-------|--------------:|:--------:|
| 1 | Palette vẫn hardcode Tailwind mặc định (`indigo-*`, `blue-*`, `amber-*`, `emerald-*`, `purple-*`) ở phần tử KHÔNG phải Button — chưa có "quick win 1-chỗ" nào còn lại, phải sửa từng file | 5/10 (`student/Dashboard`, `student/Assignments`, `teacher/Dashboard` phần còn lại, `teacher/Grading` select, `admin/Dashboard`) | P0 |
| 2 | Icon ngoài Lucide (`<img src="icons8.com/...">`) trong `student/Assignments.tsx` | 1/10 | P0 |
| 3 | a11y: `<label>`/`<select>` không liên kết `htmlFor`/`id`/`aria-label` (`Login.tsx`, `teacher/Grading.tsx`) | 2/10 | P1 |
| 4 | Mascot Tit vẫn thiếu ở `student/Dashboard.tsx` — trái với `design-system/pages/student-dashboard.md` | 1/10 | P1 |
| 5 | `Button.tsx`: variant `kids` dùng gradient tím không liên quan token `--student-accent`; variant cũ (`primary`/`danger`) vẫn hardcode hex cho shadow pressed thay vì derive từ token | 1/10 (gián tiếp, ảnh hưởng nhất quán toàn bộ) | P1 |
| 6 | Đỏ gắt cho trạng thái lỗi ở `student/Assignments.tsx` (`red-500`/`red-100`) | 1/10 | P1 |
| 7 | `teacher/Dashboard.tsx` dùng dữ liệu tĩnh, không có loading/error/empty state | 1/10 | P1 |

---

## 4. Quick wins còn lại

Không còn "quick win kiến trúc" nào nữa (token, font-family theo role, và Button variant split đã xong cả 3). Các bước tiếp theo là sửa tay từng file:

- **`student/Assignments.tsx`** — thay `<img src="icons8.com">` bằng icon Lucide tương ứng (VD: `ClipboardList` cho "Nhiệm vụ", giữ nguyên `FileText`/puzzle icon Lucide cho H5P), đổi `red-500`/`red-100` sang `student-error` (`#FF8A8A`). Đây vẫn là file ưu tiên cao nhất.
- **`teacher/Grading.tsx`** — đổi `text-indigo-700 bg-indigo-50` (class-select) sang `text-pro-primary bg-pro-bg` hoặc tương đương.
- **`student/Dashboard.tsx` / `admin/Dashboard.tsx` / `teacher/Dashboard.tsx` (phần còn lại)** — đổi hardcode `indigo-*`/`amber-*`/`emerald-*`/`purple-*` sang token `student-*`/`pro-*` tương ứng theo từng khối màu (mỗi màu 1 field riêng, nên làm từng file qua `/fix-ui`).

---

## 5. File cần refactor toàn diện (compliance < 5)

- Không còn file nào dưới 5.0/10.

---

## Overview

- Tổng file audit: 10 (giống v1/v2)
- Compliance trung bình: **7.4/10** (từ 5.8 → 6.8 → 7.4 qua 3 lần)
- Blocker (P0) còn lại: **7** (từ 18 → 8 → 7)
- Ước lượng effort fix P0+P1 còn lại (17 issue): ~1 ngày người, tập trung chủ yếu vào việc đổi màu hardcode từng file (không còn quick win kiến trúc)

## Đề xuất next step

1. Sửa `student/Assignments.tsx` trước — file duy nhất còn 2 P0 tập trung (icon ngoài + màu hardcode) và 1 P1 (đỏ gắt)
2. Sau đó dọn màu hardcode còn lại ở `student/Dashboard.tsx`, `teacher/Dashboard.tsx`, `admin/Dashboard.tsx`, `teacher/Grading.tsx` — không còn quick win chung, cần làm tuần tự từng file
3. Mở rộng audit sang 49 file còn lại trong `src/pages/` để đánh giá xem 3 layout vừa sửa có thực sự phủ đúng font cho toàn bộ ứng dụng
