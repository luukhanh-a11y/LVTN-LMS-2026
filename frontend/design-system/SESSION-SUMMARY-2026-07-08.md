# Tóm tắt tiến độ — Titkul LMS Frontend Design System (2026-07-08)

> Viết để mang sang session/app khác khi cần tiếp tục công việc. Đây là trạng thái THỰC TẾ đã verify (tsc, vite build, Playwright browser thật), không phải suy đoán.

---

## 1. Bối cảnh dự án

- **Titkul LMS** — hệ thống quản lý học tập cho học sinh tiểu học (chương trình "Kết nối tri thức"), 4 role: Học sinh, Giáo viên, Phụ huynh, Admin.
- Stack: React + Vite + Tailwind CSS, backend Java Spring Boot (`core-service`, port 8080) + NestJS (`h5p-service`, port 3001) cho nội dung H5P.
- 2 hệ thống UI song song đã chốt trong `design-system/MASTER.md`:
  - **Student UI**: Flat Playful / Claymorphism-lite, palette `#4B9EFF` (primary) + `#818CF8` (accent), font **Baloo 2** (heading) + **Nunito** (body), mascot rùa **"Tit"**.
  - **Teacher/Parent/Admin UI**: Professional SaaS, cùng palette nhưng dùng muted hơn, font **Be Vietnam Pro**, không mascot, không animation trang trí.

---

## 2. Design system đã bootstrap (`/bootstrap-design-system`)

File tạo ra trong `design-system/`:
- `MASTER.md` — hiến pháp UI, đầy đủ 2 hệ thống, component spec, Vietnamese Typography section
- `tailwind-tokens.md` — cấu hình Tailwind + CSS variables target
- `README.md` — hướng dẫn dùng + audit commands
- `pages/student-dashboard.md`, `pages/teacher-grading.md`, `pages/parent-report.md` — page overrides

## 3. Đã sửa 3 quick win kiến trúc gốc (ĐÃ XONG, không phải đang chờ)

1. **`tailwind.config.js`**: `colors.primary.DEFAULT` `#4F46E5` → `#4B9EFF`, `hover` → `#3A82DF`. Thêm namespace `student.*` (primary/accent/success/warning/error/bg/surface/fg/border) và `pro.*` (primary/accent/success/warning/destructive/bg/surface/fg/muted/border). Thêm `borderRadius.clay-sm/md/lg` và `boxShadow.clay-sm/md/lg`.
2. **`src/index.css`**: Thêm Google Fonts Baloo 2 + Nunito + Be Vietnam Pro. `body` dùng `var(--font-body)` (Nunito) + `line-height:1.6`. Heading `line-height:1.4`.
3. **`src/components/ui/Button.tsx`**: Thêm 2 variant mới `student-primary` (clay shadow, bo tròn lớn, font-heading) và `pro-primary` (phẳng, font-pro) — **GIỮ NGUYÊN 6 variant cũ** (`primary/secondary/outline/danger/ghost/kids`) làm mặc định, KHÔNG xoá/ép buộc migrate (tránh vỡ ~20 file khác đang dùng). *(Lưu ý: không phải "Option B TypeScript-enforced không default" — đó là thông tin sai từ một session khác.)*

Sau đó phát hiện thêm và sửa: **3 layout wrapper** (`DashboardLayout.tsx`, `StudentLayout.tsx`, `AuthLayout.tsx`) đều hardcode `font-sans` (Outfit) đè lên `body`, khiến fix #2 ở trên chưa có tác dụng thị giác thật — đã đổi thành `font-pro`/`font-body` tương ứng.

## 4. Lịch sử audit + fix UI (toàn bộ `src/pages/` + `src/components/`)

| Đợt | Scope | Report file | Compliance đầu → cuối |
|---|---|---|---|
| Batch 1 | 9 pages cốt lõi (Login, 4 Dashboard, Grading, Assignments x2, Users) + `Button.tsx` | `audit-report-2026-07-08.md` → `-v4.md` (4 vòng fix) | 5.8 → **8.25/10** |
| Batch 2 (mở rộng) | 15 pages (AdventureMap, LessonPlayer, AssignmentH5PPlayer, Profile x3, Notifications, Rewards, Materials, Assignments, ClassDetails, Announcements, Children, ClassDetails admin) | `audit-report-2026-07-08-expansion1.md` → `-v2.md` | 5.8 → **8.4/10** |
| Batch 3 | 27 pages còn lại (modal, ticket, editor, excel import, subject tree...) — 1 file xoá (`admin/Import.tsx`, code chết) | `audit-report-2026-07-08-batch3.md` → `-v2.md` | 6.7 → **8.5/10** |
| Components | `src/components/ui/*` + `src/components/h5p/*` (9 file) | `audit-report-2026-07-08-components.md` | 7.1/10 → đã fix 4/6 P0 |

**Toàn bộ 50 file trong `src/pages/` đã được audit ít nhất 1 lần. `student/Assignments.tsx` (từng yếu nhất, 4.0/10) đã fix xong.**

### Phát hiện quan trọng xuyên suốt các đợt fix
- Nhiều file là "bản sao song song" (student vs parent cùng tính năng) mà lần fix gốc bỏ sót — đã đồng bộ: `parent/Notifications.tsx`, `parent/Rewards.tsx`, `auth/components/ForgotPasswordModal.tsx`, `teacher/components/AiSuggestionsPanel.tsx`.
- `src/components/ui/Input.tsx` — component dùng nhiều nhất toàn app, có palette tím/violet không liên quan brand + hardcode giá trị `primary` cũ (`#4f46e5`) — đã fix màu, **border-radius 24px giữ nguyên** (cần thiết kế variant Student/Pro riêng, để lại cho đợt sau).
- `student/AdventureMap.tsx` — mascot sai tên ("Bot"/"Gemma2" thay vì "Tit"), theme tối/không gian khác hẳn Flat Playful đã chốt — đã đồng bộ lại đúng MASTER.md (đổi mascot + theme sáng).
- `H5PPlayer.tsx` dùng chéo Student (`AssignmentH5PPlayer`) và Teacher (`MaterialDetail`, `EditorMock`) — quyết định: màu trung tính `slate-500`, không thiên brand nào.

### Còn lại (chưa fix, mức độ thấp)
- `src/components/ui/Card.tsx` — chưa có biến thể "clay" cho Student UI (P1, hiện chưa có trang Student nào dùng Card nên chưa cấp thiết).
- `Input.tsx` border-radius — cần thiết kế variant Student/Pro riêng (P1, deferred).
- Vài P2 lặt vặt (VD: `admin/components/EditUserModal.tsx` override style hơi rối).

## 5. Việc ngoài phạm vi design-system audit (cùng session)

- **Dịch 11 thư viện H5P sang tiếng Việt** — file `language/vi.json` trong từng thư viện tại `backend/h5p-service/h5p/libraries/*/language/vi.json`: `MultiChoice`, `QuestionSet`, `TrueFalse`, `Blanks`, `DragText`, `DragQuestion`, `MarkTheWords`, `AdvancedText`, `Image`, `Video`, `H5PEditor.DragQuestion`. Backend (`h5p.service.ts`) đã request `'vi'` sẵn, chỉ cần dịch nội dung, không cần sửa code.
- **Sửa bug điều hướng `teacher/EditorMock.tsx`**: chế độ "Toàn màn hình" (fixed z-40) che mất sidebar khiến không bấm được nav; và `hasUnsavedChanges` bật sai ngay khi editor vừa tải (chưa có thay đổi thật) khiến hộp thoại xác nhận hiện ra không cần thiết. Đã sửa: nút đổi tên "Hủy"→"Quay lại" (ArrowLeft icon, luôn hiện được ở cả 2 chế độ), dirty-tracking chuyển sang dựa trên tương tác thật (click/input/keydown) trong khung soạn thảo, và điều hướng đổi từ `navigate('/teacher/materials')` cứng sang `navigate(-1)` (quay đúng trang trước theo browser history).
- Đã xác nhận qua git log: `admin/Import.tsx` là code chết (18 ngày không commit, không route) — đã xoá, `admin/ExcelImport.tsx` mới là trang thật.
- Tài khoản demo backend đã seed sẵn: `HS001` (học sinh), `GV001` (giáo viên), mật khẩu chung `Password123!` (xem `DataSeeder.java`).

## 6. Next step đề xuất (nếu tiếp tục)

1. Thiết kế variant Student/Pro riêng cho `Input.tsx` (border-radius khác nhau) — việc lớn nhất còn lại.
2. Thêm biến thể clay cho `Card.tsx`/`Modal.tsx` nếu bắt đầu dùng chúng ở Student UI.
3. Khởi động lại `h5p-service` để load bản dịch `vi.json` mới, kiểm tra giao diện soạn bài H5P tiếng Việt thực tế.
4. Test responsive 375px/1440px và keyboard nav toàn diện (mới verify từng phần qua Playwright, chưa test hệ thống).
