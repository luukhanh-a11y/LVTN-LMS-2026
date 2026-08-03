# Audit Report — Titkul LMS Frontend

> **Ngày audit:** 2026-07-08
> **Scope:** Giới hạn 10 file cốt lõi (dashboard + login + assignment flow của 4 role + 1 shared component), được chọn từ tổng 59 file trong `src/pages/` và `src/components/` sau khi user xác nhận giới hạn phạm vi.
> **Đối chiếu chuẩn:** `design-system/MASTER.md` + `design-system/pages/*.md`
> **Không sửa code** trong quá trình audit này — chỉ report.

---

## 1. Bảng Compliance (sort yếu nhất lên đầu)

| File | Role | Compliance | P0 | P1 | P2 | Effort |
|------|------|-----------:|---:|---:|---:|:------:|
| `src/pages/student/Assignments.tsx` | student | 4.0/10 | 3 | 2 | 1 | Vừa |
| `src/pages/admin/Dashboard.tsx` | admin | 5.0/10 | 2 | 2 | 0 | Vừa |
| `src/pages/student/Dashboard.tsx` | student | 5.5/10 | 2 | 2 | 1 | Vừa |
| `src/pages/teacher/Dashboard.tsx` | teacher | 5.5/10 | 2 | 2 | 0 | Nhỏ |
| `src/pages/auth/Login.tsx` | shared | 6.0/10 | 2 | 2 | 1 | Vừa |
| `src/pages/teacher/Grading.tsx` | teacher | 6.0/10 | 2 | 2 | 1 | Vừa |
| `src/components/ui/Button.tsx` | shared | 6.0/10 | 2 | 1 | 0 | Vừa |
| `src/pages/admin/Users.tsx` | admin | 6.5/10 | 1 | 2 | 0 | Nhỏ |
| `src/pages/parent/Dashboard.tsx` | parent | 6.5/10 | 1 | 2 | 0 | Nhỏ |
| `src/pages/parent/Assignments.tsx` | parent | 7.0/10 | 1 | 2 | 0 | Nhỏ |

**Compliance trung bình: 5.8/10** | **Tổng P0: 18** | **Tổng P1: 19** | **Tổng P2: 4**

---

## 2. Top issue phổ biến (sort theo số file bị dính)

| # | Issue | Files bị dính | Priority |
|---|-------|--------------:|:--------:|
| 1 | Font chưa migrate — `src/index.css` set global `font-family: 'Outfit'`, không file nào trong 10 file dùng Baloo 2 / Nunito (student) hoặc Be Vietnam Pro (teacher/parent) theo MASTER.md | 10/10 | P0 |
| 2 | Không set `line-height ≥ 1.6` cho text tiếng Việt ở tầng global (`body` trong `index.css` không có `line-height`) | 10/10 | P1 |
| 3 | Palette hardcode Tailwind mặc định (`indigo-600`, `blue-600`, `amber-500`, `violet-800`...) thay vì token `--student-*` / `--pro-*` (`#4B9EFF` / `#818CF8`) đã chốt trong MASTER.md | 8/10 | P0 |
| 4 | `tailwind.config.js` vẫn định nghĩa `colors.primary.DEFAULT = '#4F46E5'` (Indigo cũ) — mọi chỗ dùng class `text-primary`/`bg-primary`/`border-primary` đang ra sai màu so với brand primary `#4B9EFF` | 5/10 | P0 |
| 5 | Component dùng chung (`Button`, và gián tiếp `Card`/`Badge` được import ở hầu hết file) chưa tách 2 hệ thống Student / Teacher-Parent như MASTER.md yêu cầu — chỉ có 1 bộ variant, không có biến thể dùng `--shadow-clay-*` | 10/10 (gián tiếp qua shared component) | P0 |
| 6 | Icon ngoài Lucide — `student/Assignments.tsx` dùng `<img src="https://img.icons8.com/...">` cho icon "Nhiệm vụ" và icon H5P, vi phạm rule "chỉ Lucide React, không icon lẻ" + phụ thuộc mạng ngoài | 1/10 | P0 |
| 7 | Label/`<select>` không liên kết `htmlFor`/`id`/`aria-label` với input tương ứng (`Login.tsx` dòng 110-124, `teacher/Grading.tsx` dòng 100-123) | 2/10 | P1 |

---

## 3. Quick wins (fix 1 chỗ, giải quyết nhiều file)

- **Cập nhật `tailwind.config.js`**: đổi `colors.primary.DEFAULT` từ `#4F46E5` → `#4B9EFF`, thêm namespace `student.*` / `pro.*` theo `design-system/tailwind-tokens.md` đã có sẵn.
  → Tự động fix issue #4 cho 5 file (`teacher/Grading`, `parent/Dashboard`, `parent/Assignments`, `admin/Users`) mà không cần sửa từng file, vì các file này đã dùng alias `text-primary`/`focus:border-primary`.

- **Thêm Google Fonts + set biến font trong `src/index.css`**: import Baloo 2 + Nunito + Be Vietnam Pro (đã có sẵn snippet trong `design-system/tailwind-tokens.md`), set `body { font-family: var(--font-body); line-height: 1.6; }`.
  → Fix issue #1 và #2 cho toàn bộ 10/10 file cùng lúc, vì cả hai đều là thuộc tính kế thừa từ `body`.

- **Tách `src/components/ui/Button.tsx` (và audit thêm `Card.tsx`, `Badge.tsx` trong lần sau) thành 2 bộ variant rõ ràng**: `variant="student-primary"` (dùng `--shadow-clay-*`, bo tròn lớn) vs `variant="pro-primary"` (phẳng, bo tròn nhỏ) theo đúng cấu trúc component spec trong MASTER.md.
  → Fix issue #5 ở gốc — vì hầu hết page trong scope import `Button` từ file này, sửa 1 file lan toả ra toàn bộ giao diện.

---

## 4. File cần refactor toàn diện (compliance < 5)

- **`src/pages/student/Assignments.tsx` — 4.0/10**
  Tập trung nhiều vấn đề nhất: icon ngoài (`img.icons8.com`) thay vì Lucide, dùng đỏ gắt (`red-500`/`red-100`) cho trạng thái "quá hạn"/"làm lại" — vi phạm trực tiếp rule MASTER.md "KHÔNG dùng đỏ gắt cho học sinh, dùng `--student-error` (#FF8A8A) dịu hơn". Đề xuất viết lại phần icon + trạng thái màu theo đúng token `--student-*`, không cần viết lại toàn bộ logic (logic nộp bài/nháp đang ổn).

---

## 5. Ghi chú phạm vi

- Không audit `src/components/ui/Card.tsx`, `Badge.tsx`, `Table.tsx`, `Input.tsx`, `Modal.tsx` trong lần này dù được nhiều file trong scope import — các file này có đòn bẩy cao (leverage nhiều page), nên đưa vào ưu tiên audit tiếp theo.
- 49 file còn lại trong `src/pages/` (đặc biệt các trang H5P player, reward, ticket) chưa được audit — khuyến nghị chạy `/audit-project pages` không giới hạn, hoặc `/audit-page` riêng cho từng file quan trọng tiếp theo.

---

## Overview

- Tổng file audit: 10 (giới hạn từ 59 file trong scope gốc)
- Compliance trung bình: 5.8/10
- Blocker (P0) toàn scope: 18
- Ước lượng effort fix P0 + P1 (37 issue): khoảng 3-4 ngày người, nhưng phần lớn co lại còn ~1 ngày nếu làm 3 quick win ở mục 3 trước (fix gốc, không cần sửa từng file riêng lẻ)

## Đề xuất next step

1. Làm 3 quick win ở mục 3 trước — giải quyết phần lớn P0 lặp lại (font, palette token, kiến trúc component) chỉ với 2-3 file sửa.
2. Chạy `/audit-page` cho `src/pages/student/Assignments.tsx` để xem chi tiết sâu hơn trước khi refactor.
3. Sau khi 3 quick win xong, chạy lại `/audit-project` để đo lại compliance trung bình và mở rộng scope sang các file còn lại.
