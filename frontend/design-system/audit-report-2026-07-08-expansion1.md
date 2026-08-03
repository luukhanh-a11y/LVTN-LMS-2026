# Audit Report — Titkul LMS Frontend (Mở rộng, đợt 1)

> **Ngày audit:** 2026-07-08
> **Scope:** 15 file MỚI (chưa từng audit) trong `src/pages/`, chọn theo ưu tiên: flow học tập cốt lõi (AdventureMap, LessonPlayer, AssignmentH5PPlayer), Profile 3 role, quản lý lớp/thông báo/thành tích.
> **Đối chiếu chuẩn:** `design-system/MASTER.md`
> **Không sửa code** trong quá trình audit này.
>
> Đây là scope hoàn toàn khác với 10 file đã audit ở các report trước (`audit-report-2026-07-08.md` → `-v4.md`). Không so sánh trực tiếp về Δ vì chưa từng có baseline cho các file này.

---

## 1. Bảng Compliance (sort yếu nhất lên đầu)

| File | Role | Compliance | P0 | P1 | P2 | Effort |
|------|------|-----------:|---:|---:|---:|:------:|
| `student/LessonPlayer.tsx` | student | 3.0/10 | 3 | 1 | 1 | Lớn |
| `student/AdventureMap.tsx` | student | 3.5/10 | 3 | 2 | 1 | Lớn |
| `student/Notifications.tsx` | student | 5.0/10 | 2 | 0 | 0 | Vừa |
| `student/Rewards.tsx` | student | 5.0/10 | 2 | 1 | 0 | Vừa |
| `student/AssignmentH5PPlayer.tsx` | student | 5.0/10 | 2 | 1 | 0 | Vừa |
| `parent/Grades.tsx` | parent | 5.5/10 | 2 | 0 | 0 | Vừa |
| `student/Profile.tsx` | student | 6.0/10 | 1 | 1 | 0 | Nhỏ |
| `teacher/Profile.tsx` | teacher | 6.5/10 | 1 | 0 | 0 | Nhỏ |
| `parent/Profile.tsx` | parent | 6.5/10 | 1 | 0 | 0 | Nhỏ |
| `teacher/Materials.tsx` | teacher | 6.5/10 | 1 | 0 | 0 | Nhỏ |
| `teacher/Assignments.tsx` | teacher | 6.5/10 | 1 | 0 | 0 | Nhỏ |
| `teacher/ClassDetails.tsx` | teacher | 6.5/10 | 1 | 1 | 0 | Nhỏ |
| `teacher/Announcements.tsx` | teacher | 6.5/10 | 1 | 0 | 0 | Nhỏ |
| `parent/Children.tsx` | parent | 7.0/10 | 1 | 0 | 0 | Nhỏ |
| `admin/ClassDetails.tsx` | admin | 7.5/10 | 1 | 0 | 0 | Nhỏ |

**Compliance trung bình: 5.8/10** | **P0: 23** | **P1: 7** | **P2: 2**

**Nhận xét quan trọng:** 5.8/10 trùng khớp với baseline ban đầu của 10 file cũ (trước khi fix) — đúng như dự đoán, vì 40 file còn lại trong `src/pages/` chưa hề được đụng tới trong 4 vòng fix trước. Điểm sáng: các file đã dùng alias `text-primary`/`bg-primary`/`focus:border-primary` (`admin/ClassDetails`, `parent/Children`, `teacher/Materials`, `teacher/Assignments`, `teacher/Announcements`, `teacher/ClassDetails`) tự động đạt compliance cao hơn (6.5-7.5) so với file hardcode trực tiếp hex/Tailwind-default (`AdventureMap`, `LessonPlayer` chỉ 3.0-3.5) — xác nhận thêm lần nữa giá trị của việc đổi token `primary` ở vòng 1.

---

## 2. Top issue phổ biến

| # | Issue | Files bị dính | Priority |
|---|-------|--------------:|:--------:|
| 1 | Icon ngoài Lucide (`<img src="icons8.com/...">`), nhiều icon không có `alt` | `student/LessonPlayer.tsx`, `student/AssignmentH5PPlayer.tsx`, `student/Rewards.tsx` | P0 |
| 2 | Emoji dùng làm icon thật (không phải chỉ trang trí trong text) — tab label (🏅💌) và badge thành tích (🏆🎓) | `student/Rewards.tsx`, `parent/Grades.tsx` | P0 |
| 3 | Palette hardcode Tailwind mặc định (`indigo/blue/amber/green/orange`) thay vì token `student-*`/`pro-*` | 13/15 file (hầu hết, mức độ khác nhau) | P0/P1 |
| 4 | Mascot không nhất quán — `student/AdventureMap.tsx` dùng icon `Bot` với chú thích "Mascot Gemma2", khác hẳn mascot chính thức "Tit" (rùa) đã chốt trong MASTER.md | `student/AdventureMap.tsx` | P0 |
| 5 | Style hoàn toàn khác biệt so với "Flat Playful/Claymorphism-lite" đã chốt — nền tối kiểu không gian/adventure map, không bo tròn clay, không mascot Tit. **Cần xác nhận với đội thiết kế đây có phải là một sub-experience chủ đích khác biệt (bản đồ phiêu lưu) hay là trang làm trước khi có design system** | `student/AdventureMap.tsx` | Cần xác nhận |
| 6 | Component `LessonPlayer.tsx` có vẻ là bản mock/demo cũ (comment "sẽ nhúng iframe H5P từ Backend"), trong khi `AssignmentH5PPlayer.tsx` là bản thật đã tích hợp API + xAPI — **cần xác nhận `LessonPlayer.tsx` còn được dùng thật hay là code chết** | `student/LessonPlayer.tsx` | Cần xác nhận |

---

## 3. Quick wins

- **Dọn nốt icon ngoài + emoji-as-icon ở 4 file** (`LessonPlayer`, `AssignmentH5PPlayer`, `Rewards`, `Grades`) — cùng pattern đã fix ở `student/Assignments.tsx` trước đó (thay `<img icons8.com>` bằng Lucide tương ứng: `Clock`, `CheckCircle2`, `Puzzle`, `Star`, `Gem`/`Diamond`, `Trophy`, `GraduationCap`).
- **Xác nhận `LessonPlayer.tsx` còn dùng hay không** trước khi đầu tư công sức sửa — nếu là code chết, xoá route thay vì fix UI sẽ tiết kiệm effort hơn nhiều.
- Không còn "quick win kiến trúc" nào (đã dùng hết ở 4 vòng trước) — phần hardcode màu còn lại phải sửa từng file, nhưng 6/15 file đã có sẵn nền tảng tốt (dùng alias `primary`) nên effort thấp.

---

## 4. File cần refactor toàn diện (compliance < 5)

- **`student/LessonPlayer.tsx` — 3.0/10**: nhiều icon ngoài, palette hardcode, và nghi vấn là code chết (xem mục 2, issue #6). Đề xuất xác nhận trước khi quyết định sửa hay xoá.
- **`student/AdventureMap.tsx` — 3.5/10**: mascot sai tên, theme hoàn toàn khác biệt so với MASTER.md, palette hardcode nặng. Đề xuất xác nhận với đội thiết kế về chủ đích trước khi refactor (xem mục 2, issue #5) — không nên tự ý viết lại nếu đây là chủ đích.

---

## Overview

- Tổng file audit: 15 (scope mới, chưa từng audit)
- Compliance trung bình: **5.8/10**
- Blocker (P0) toàn scope: **23**
- Ước lượng effort fix P0+P1 (30 issue): ~1.5-2 ngày người — riêng 2 file cần xác nhận trước (LessonPlayer, AdventureMap) có thể không cần fix nếu là code chết/chủ đích khác

## Đề xuất next step

1. **Xác nhận 2 câu hỏi mở** trước khi làm gì thêm: `LessonPlayer.tsx` có còn dùng không? `AdventureMap.tsx` dark theme có phải chủ đích khác biệt không?
2. Nếu cả 2 đều "có dùng thật" → chạy `/fix-ui` cho scope P0 của report này, ưu tiên dọn icon ngoài + emoji-as-icon trước (ảnh hưởng UX rõ nhất)
3. Còn 24 file nữa trong `src/pages/` chưa audit (modal, ticket, editor, excel import...) — có thể audit đợt 2 sau khi xử lý xong đợt này
