# Titkul Commands — Slash Commands cho Claude Code

Bộ 5 slash command tùy chỉnh giúp bạn quản lý UI/UX của Titkul LMS theo chuẩn design system, tận dụng skill `ui-ux-pro-max`.

## Cài đặt

### Cách 1: Project-scope (chỉ dùng trong repo frontend Titkul) — **khuyến nghị**

Trong folder `E:\LuanVanSTU2026\DuAn\frontend`:

```cmd
mkdir .claude\commands
```

Copy tất cả 5 file `.md` (bootstrap-design-system.md, audit-page.md, fix-ui.md, audit-project.md, design-page.md) vào `.claude\commands\`.

Khi bạn `claude` trong folder này, các command sẽ tự xuất hiện.

### Cách 2: Global (dùng cho mọi project)

```cmd
mkdir "%USERPROFILE%\.claude\commands"
```

Copy các file vào `%USERPROFILE%\.claude\commands\`.

**Lưu ý:** các command này reference đường dẫn `.claude/skills/ui-ux-pro-max/scripts/search.py` — tức là project phải có skill này cài (project-scope hoặc global cùng cách).

---

## Danh sách 5 command

| Command | Khi nào dùng | Argument |
|---------|--------------|----------|
| `/bootstrap-design-system` | Lần đầu setup, sinh MASTER.md + page overrides | không |
| `/audit-page` | Kiểm tra 1 file cụ thể, chỉ report không sửa | path file |
| `/fix-ui` | Áp dụng fix từ audit gần nhất, section-by-section | (trống) hoặc `P0` hoặc `P0-P1` |
| `/audit-project` | Quét cả project, sinh report tổng hợp | (trống) hoặc `pages` hoặc path |
| `/design-page` | Sinh page/component mới từ scratch theo chuẩn | `<role> <PageName> [note]` |

---

## Luồng làm việc gợi ý

### Luồng A — Setup ban đầu (1 lần)

```
1. /bootstrap-design-system
   → sinh design-system/MASTER.md + pages/*.md + tailwind-tokens.md

2. Review MASTER.md, sửa nếu thấy chưa đúng ý

3. Copy đoạn tailwind config từ tailwind-tokens.md vào tailwind.config.js thật
```

### Luồng B — Kiểm tra & cải thiện code có sẵn (case của bạn)

```
1. /audit-project pages
   → quét tổng, xem file nào yếu nhất, top issue nào phổ biến

2. Xem report design-system/audit-report-YYYY-MM-DD.md

3. Chọn 1 file yếu nhất, VD src/pages/StudentHome.tsx:
   /audit-page src/pages/StudentHome.tsx
   → xem chi tiết P0/P1/P2

4. /fix-ui P0-P1
   → fix từng cái, confirm từng cái

5. Lặp lại (3) và (4) cho các file tiếp theo

6. Sau 1 tuần, chạy lại /audit-project để đo tiến độ
```

### Luồng C — Sinh page mới

```
1. /design-page student QuizPage cho phép làm bài trắc nghiệm 10 câu
   → xem outline, confirm

2. Claude sinh file src/pages/student/QuizPage.tsx

3. /audit-page src/pages/student/QuizPage.tsx
   → verify vừa sinh xong đã đúng chuẩn chưa

4. Fix ngay nếu có issue (thường ít vì vừa sinh)
```

---

## Troubleshoot

### `python3` không tìm thấy trên Windows

Các command đã dùng `python` thay vì `python3`. Nếu vẫn lỗi:

```cmd
where python
```

Nếu ra path → OK. Nếu không → cài Python từ python.org, tick "Add to PATH".

### Slash command không xuất hiện trong Claude Code

Trong session `claude`, gõ `/` sẽ hiện popup autocomplete. Nếu không thấy:
```
/help commands
```

Hoặc restart Claude Code (Ctrl+C rồi chạy lại `claude`).

### Skill `ui-ux-pro-max` không được gọi

Kiểm tra skill đang bật:
```
/skills
```

Nếu không có `ui-ux-pro-max` on → chạy lại `uipro init --ai claude` trong folder repo.

### Design-system folder rỗng sau khi chạy `/bootstrap-design-system`

Nhiều khả năng lệnh `python .claude/skills/...` fail âm thầm. Chạy tay ngoài CMD để xem error:
```cmd
python .claude\skills\ui-ux-pro-max\scripts\search.py "test" --design-system -p "Titkul" --persist --output-dir design-system
```

---

## Tùy biến

Các file `.md` này là plain markdown — bạn có thể sửa để thay đổi behavior. Ví dụ:

- Đổi constraints palette trong `bootstrap-design-system.md`
- Thêm checklist item mới vào `audit-page.md`
- Thay đổi anti-pattern trong `fix-ui.md`

Sau khi sửa, không cần restart — Claude Code đọc lại file mỗi lần bạn gõ slash command.

---

**Ngày tạo:** 2026-07-08  
**Skill dùng:** ui-ux-pro-max v (theo bản `uipro init`)  
**Áp dụng cho:** Titkul LMS thesis project
