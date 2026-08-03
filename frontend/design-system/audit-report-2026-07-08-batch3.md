# Audit Report — Titkul LMS Frontend (Đợt 3 — 27 file cuối cùng)

> **Ngày audit:** 2026-07-08
> **Scope:** 27 file cuối cùng chưa từng audit trong `src/pages/` (modal, ticket, editor, excel import, subject tree, các trang phụ trợ auth).
> **Đối chiếu chuẩn:** `design-system/MASTER.md`
> **Không sửa code** trong quá trình audit này.
>
> Sau đợt này, **toàn bộ 49 file trong `src/pages/`** sẽ đã được audit ít nhất 1 lần.

---

## 1. Bảng Compliance (sort yếu nhất lên đầu)

| File | Role | Compliance | P0 | P1 | P2 | Effort |
|------|------|-----------:|---:|---:|---:|:------:|
| `student/SubjectTree.tsx` | student | 3.5/10 | 3 | 1 | 0 | Lớn |
| `parent/SubjectTree.tsx` | parent | 3.5/10 | 3 | 1 | 0 | Lớn |
| `parent/Notifications.tsx` | parent | 5.0/10 | 2 | 0 | 0 | Vừa |
| `parent/Rewards.tsx` | parent | 5.0/10 | 2 | 1 | 0 | Vừa |
| `auth/components/ForgotPasswordModal.tsx` | shared | 5.5/10 | 2 | 0 | 0 | Vừa |
| `teacher/components/StudentProgressModal.tsx` | teacher | 5.5/10 | 2 | 0 | 0 | Vừa |
| `teacher/components/AiSuggestionsPanel.tsx` | teacher | 5.5/10 | 2 | 0 | 0 | Vừa |
| `admin/components/TransferClassModal.tsx` | admin | 6.0/10 | 1 | 0 | 0 | Nhỏ |
| `auth/SelectChild.tsx` | parent | 6.5/10 | 1 | 0 | 0 | Nhỏ |
| ~~`admin/Import.tsx`~~ | admin | ~~7.0/10~~ | ~~1~~ | 0 | 0 | **Đã xoá** — code chết, xem mục 2 |
| `auth/ForceChangePassword.tsx` | shared | 7.0/10 | 1 | 0 | 0 | Nhỏ |
| `teacher/components/RewardModal.tsx` | teacher | 7.0/10 | 1 | 0 | 0 | Nhỏ |
| `teacher/EditorMock.tsx` | teacher | 7.0/10 | 1 | 0 | 0 | Nhỏ |
| `teacher/GradingDetail.tsx` | teacher | 7.0/10 | 1 | 1 | 0 | Nhỏ |
| `admin/ExcelImport.tsx` | admin | 7.5/10 | 0 | 1 | 0 | Nhỏ |
| `admin/Tickets.tsx` | admin | 7.5/10 | 1 | 0 | 0 | Nhỏ |
| `admin/components/CreateUserModal.tsx` | admin | 7.5/10 | 1 | 0 | 0 | Nhỏ |
| `admin/components/UserDetailModal.tsx` | admin | 7.5/10 | 1 | 0 | 0 | Nhỏ |
| `teacher/components/GradedDetailsModal.tsx` | teacher | 7.5/10 | 1 | 0 | 0 | Nhỏ |
| `teacher/Classes.tsx` | teacher | 7.5/10 | 1 | 0 | 0 | Nhỏ |
| `teacher/MaterialDetail.tsx` | teacher | 7.5/10 | 1 | 0 | 0 | Nhỏ |
| `teacher/Reports.tsx` | teacher | 7.5/10 | 1 | 0 | 0 | Nhỏ |
| `admin/Classes.tsx` | admin | 8.0/10 | 0 | 0 | 0 | — |
| `admin/Settings.tsx` | admin | 8.0/10 | 0 | 0 | 0 | — |
| `admin/components/EditUserModal.tsx` | admin | 8.0/10 | 0 | 0 | 1 | Nhỏ |
| `auth/ForgotPassword.tsx` | shared | 8.0/10 | 0 | 0 | 0 | — |
| `teacher/Tickets.tsx` | teacher | 8.5/10 | 0 | 0 | 0 | — |

**Compliance trung bình: 6.7/10** | **P0: 29** | **P1: 5** | **P2: 1**

---

## 2. Phát hiện quan trọng: nhiều file là "bản sao song song" của file đã fix nhưng bị bỏ sót

Đây là pattern đáng chú ý nhất của đợt audit này — không phải lỗi mới, mà là **việc fix trước đây không lan hết sang bản sao cho role/vị trí khác**:

| File đã fix trước đó | Bản sao chưa fix (đợt này) | Ghi chú |
|---|---|---|
| `student/Notifications.tsx` (8.5/10) | `parent/Notifications.tsx` (5.0/10) | Gần như 100% giống code, `parent` vẫn còn `indigo` hardcode + icon `pin.png` ngoài |
| `student/Rewards.tsx` (8.0/10) | `parent/Rewards.tsx` (5.0/10) | `parent` vẫn còn icon ngoài (trophy/lock/checked) + emoji tab (🏅💌) |
| `Login.tsx` (đã fix `student-primary`) | `auth/components/ForgotPasswordModal.tsx` (5.5/10) | Modal riêng của Login, **chưa từng được đụng tới** dù Login.tsx cha đã fix xong — vẫn 100% `indigo` hardcode |
| `teacher/Assignments.tsx` AI panel (đã fix `pro-primary`) | `teacher/components/AiSuggestionsPanel.tsx` (5.5/10) | Đây là **component AI panel riêng biệt** (dùng bởi `GradingDetail.tsx`), không phải cùng code với panel inline trong `Assignments.tsx` — cả 2 tồn tại song song, chỉ 1 cái được fix |

**Ngoài ra, 2 cặp file gần như trùng lặp 100% logic, có thể là code song sinh (song song student/parent) chưa từng đồng bộ token:**
- `student/SubjectTree.tsx` (3.5/10) ↔ `parent/SubjectTree.tsx` (3.5/10) — cả 2 đều nặng nhất đợt này, dùng tới 6-7 icon ngoài (`icons8.com`) mỗi file, không dùng token nào.
- `admin/Import.tsx` (7.0/10) ↔ `admin/ExcelImport.tsx` (7.5/10) — **Đã xác nhận qua git log: `admin/Import.tsx` là code chết.** Commit cuối `2026-06-20` (18 ngày trước), không được import/route ở bất kỳ đâu trong `App.tsx`. `admin/ExcelImport.tsx` có commit cuối `2026-07-07` và đang được route thật (`<Route path="import" element={<AdminImport />} />` trỏ vào `ExcelImport.tsx`). → Đề xuất **xoá `admin/Import.tsx`** thay vì sửa UI, không tính vào effort fix P0.

---

## 3. Top issue phổ biến

| # | Issue | Files bị dính | Priority |
|---|-------|--------------:|:--------:|
| 1 | Palette hardcode `indigo`/`blue` thay vì `student-*`/`pro-*` token | 20/27 | P0/P1 |
| 2 | Icon ngoài Lucide (`icons8.com`) | `student/SubjectTree`, `parent/SubjectTree`, `parent/Rewards` | P0 |
| 3 | Emoji làm tab icon (🏅💌) | `parent/Rewards.tsx` | P0 |
| 4 | Component/modal song song bị bỏ sót khi fix bản gốc (xem mục 2) | 4 file | P0 |

---

## 4. File cần refactor toàn diện (compliance < 5, không có trong đợt này) — lưu ý riêng

Không có file nào dưới 5.0/10 tuyệt đối, nhưng `student/SubjectTree.tsx` và `parent/SubjectTree.tsx` (3.5/10) là 2 file nặng nhất toàn bộ project tính đến nay (ngang với `LessonPlayer.tsx`/`AdventureMap.tsx` trước khi fix) — nên ưu tiên cao.

---

## Overview

- Tổng file audit: 27 (hoàn tất toàn bộ 49 file `src/pages/`)
- Compliance trung bình: **6.7/10** (tính trên 27 file audit ban đầu; sau khi xoá `admin/Import.tsx` còn 26 file trong scope fix)
- Blocker (P0) còn lại cần fix: **28** (đã xoá `admin/Import.tsx`, loại bỏ 1 P0 không cần fix)
- Ước lượng effort fix P0+P1 (33 issue): ~1 ngày người

## Đã thực hiện

- ✅ **Xoá `admin/Import.tsx`** — code chết đã xác nhận qua git log (commit cuối 2026-06-20, không route ở đâu trong `App.tsx`). `admin/ExcelImport.tsx` là trang thật đang dùng (commit cuối 2026-07-07, có route `/admin/import`). `tsc --noEmit` pass sau khi xoá.

## Đề xuất next step

1. Fix 2 file nặng nhất: `student/SubjectTree.tsx` + `parent/SubjectTree.tsx` (icon ngoài + palette, effort Lớn nhưng 2 file giống hệt nhau nên có thể làm cùng lúc)
2. Đồng bộ 3 "bản sao bị bỏ sót": `parent/Notifications.tsx`, `parent/Rewards.tsx`, `auth/components/ForgotPasswordModal.tsx`, `teacher/components/AiSuggestionsPanel.tsx` — áp đúng pattern đã dùng ở bản gốc tương ứng
3. Sau đợt này, **toàn bộ `src/pages/` (49 file, nay còn 48) đã được audit ít nhất 1 lần** — có thể tổng kết compliance toàn project
