# Audit Report — Titkul LMS Frontend (Mở rộng đợt 1, v2 — sau fix 15 item P0)

> **Ngày audit:** 2026-07-08 (lần 2 của đợt mở rộng)
> **Scope:** Đúng 15 file đã audit ở `audit-report-2026-07-08-expansion1.md`.
> **Đối chiếu chuẩn:** `design-system/MASTER.md`
> **Không sửa code** trong quá trình audit này.

Đã áp dụng trước khi audit lần này (15 item P0 qua `/fix-ui`):
- `student/LessonPlayer.tsx`, `student/Rewards.tsx`, `student/AssignmentH5PPlayer.tsx` — dọn hết icon ngoài `icons8.com` → Lucide
- `student/AdventureMap.tsx` — đổi theme tối → sáng/clay, mascot "Bot/Gemma2" → **Tit** thật
- `parent/Grades.tsx` — 2 emoji badge (🏆🎓) → `Trophy`/`GraduationCap`
- 10 file còn lại — dọn hardcode `indigo`/`blue`/`orange`/`amber`/`green` → token `student-*`/`pro-*`

---

## 1. Bảng Compliance — trước/sau

| File | Role | Trước | Sau | Δ | P0 | P1 | P2 |
|------|------|------:|----:|--:|---:|---:|---:|
| `student/LessonPlayer.tsx` | student | 3.0 | 8.0 | +5.0 | 0 | 0 | 1 |
| `student/AdventureMap.tsx` | student | 3.5 | 7.5 | +4.0 | 0 | 2 | 1 |
| `student/Notifications.tsx` | student | 5.0 | 8.5 | +3.5 | 0 | 0 | 0 |
| `student/Rewards.tsx` | student | 5.0 | 8.0 | +3.0 | 0 | 1 | 0 |
| `student/AssignmentH5PPlayer.tsx` | student | 5.0 | 9.0 | +4.0 | 0 | 0 | 0 |
| `parent/Grades.tsx` | parent | 5.5 | 8.5 | +3.0 | 0 | 0 | 0 |
| `student/Profile.tsx` | student | 6.0 | 8.0 | +2.0 | 0 | 1 | 0 |
| `teacher/Profile.tsx` | teacher | 6.5 | 8.5 | +2.0 | 0 | 0 | 0 |
| `parent/Profile.tsx` | parent | 6.5 | 8.5 | +2.0 | 0 | 0 | 0 |
| `teacher/Materials.tsx` | teacher | 6.5 | 8.5 | +2.0 | 0 | 0 | 0 |
| `teacher/Assignments.tsx` | teacher | 6.5 | 8.5 | +2.0 | 0 | 0 | 0 |
| `teacher/ClassDetails.tsx` | teacher | 6.5 | 8.0 | +1.5 | 0 | 1 | 0 |
| `teacher/Announcements.tsx` | teacher | 6.5 | 8.5 | +2.0 | 0 | 0 | 0 |
| `parent/Children.tsx` | parent | 7.0 | 8.5 | +1.5 | 0 | 0 | 0 |
| `admin/ClassDetails.tsx` | admin | 7.5 | 9.0 | +1.5 | 0 | 0 | 0 |

**Compliance trung bình: 5.8 → 8.4/10 (+2.6)** | **P0: 23 → 0** | **P1: 7 → 5** | **P2: 2 → 2**

Toàn bộ 23 blocker (P0) trong scope này đã được xử lý hết.

---

## 2. Vấn đề còn lại (đều là P1/P2, không còn blocker)

| # | Issue | File | Priority |
|---|-------|------|:--------:|
| 1 | Chiều cao bản đồ cố định `h-[1200px]` không thực sự responsive trên mobile | `student/AdventureMap.tsx` | P1 |
| 2 | Node "locked" là `<div>` thường, không có `role`/`aria-disabled` để báo hiệu trạng thái khoá cho screen reader | `student/AdventureMap.tsx` | P1 |
| 3 | Badge "unlocked" vẫn dùng `green-100/700` thay vì `student-success` | `student/Rewards.tsx` | P1 |
| 4 | Heading chính chưa áp `font-heading` (Baloo 2) — dùng `PageTitle` như đã làm ở `Login`/`student/Dashboard` | `student/Profile.tsx` | P1 |
| 5 | Thanh chuyên cần (attendance) dùng `green-500/orange-500/red-500` trực tiếp thay vì `pro-success`/`pro-warning`/`pro-destructive` | `teacher/ClassDetails.tsx` | P1 |
| 6 | Heading `<h2>` trình phát bài giảng chưa áp `font-heading` | `student/LessonPlayer.tsx` | P2 |
| 7 | Component có thể cần xác nhận thêm về vai trò lâu dài (mock vs thật) dù đã xác nhận "vẫn còn dùng" | `student/AdventureMap.tsx` | P2 (ghi chú) |

Không còn issue nào lặp lại ở nhiều file — mọi thứ còn lại là polish nhỏ, độc lập từng file.

---

## Overview

- Tổng file audit: 15 (giống lần trước, đợt mở rộng 1)
- Compliance trung bình: **8.4/10** (từ 5.8 → 8.4)
- Blocker (P0) còn lại: **0**
- Ước lượng effort fix 5 P1 còn lại: ~1-1.5 giờ

## Đề xuất next step

1. Scope 15 file này đã đạt mức rất tốt (8.4/10, không còn P0) — có thể coi là hoàn thành
2. Còn 24 file trong `src/pages/` chưa từng audit (modal: `GradedDetailsModal`, `RewardModal`, `StudentProgressModal`, `EditUserModal`...; ticket: `admin/Tickets`, `teacher/Tickets`; editor: `EditorMock`; excel: `ExcelImport`...) — đề xuất audit đợt 2 nếu muốn phủ hết toàn bộ project
3. Nếu muốn hoàn thiện 100%: fix 5 P1 nhỏ còn lại ở mục 2 (~1-1.5 giờ)
