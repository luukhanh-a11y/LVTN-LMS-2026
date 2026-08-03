---
description: Sinh page/component MỚI đúng chuẩn design-system/MASTER.md (khác /audit-page ở chỗ này tạo mới)
---

# Design Page — Titkul LMS

Sinh 1 page hoặc component mới đúng chuẩn design system.

Argument: **$ARGUMENTS**

Format argument: `<role> <page-name> [note ngắn]`

Ví dụ:
- `student StudentDashboard`
- `teacher GradingBoard cho phép sort theo lớp và ngày nộp`
- `parent MonthlyReport có biểu đồ cột điểm 4 môn chính`
- `shared LoadingSpinner có mascot rùa nếu role student`

Nếu argument không match format → hỏi lại cho rõ, đừng đoán.

## Workflow

### Step 1: Parse & confirm

Parse ra:
- `role`: student | teacher | parent | shared
- `pageName`: PascalCase, không có đuôi `.tsx`
- `note`: mô tả thêm (optional)

Show:
```
Sẽ tạo:
- Path: src/pages/[role]/[pageName].tsx (hoặc src/components/... nếu shared)
- Role tokens: [theo MASTER.md]
- Note: [note]
Confirm? (yes / edit / cancel)
```

### Step 2: Load chuẩn

Đọc theo thứ tự:
1. `design-system/MASTER.md`
2. `design-system/pages/[role]-*.md` phù hợp (nếu có)
3. `design-system/tailwind-tokens.md` để lấy đúng token name

### Step 3: Skill query bổ sung

Chạy để lấy component pattern phù hợp:

```bash
python .claude/skills/ui-ux-pro-max/scripts/search.py "[pageName mô tả bằng tiếng Anh]" --stack react --max-results 3
```

Note các pattern skill gợi ý, chọn 1-2 áp dụng.

### Step 4: Draft outline TRƯỚC KHI code

Đưa user xem outline dạng bullet:

```
## Outline: [pageName]

Layout:
- Header: ...
- Main content: ...
- Sidebar (nếu có): ...
- Footer (nếu có): ...

Components dùng:
- <ExistingButton /> (từ src/components/ui/Button.tsx)
- <NewCard /> (SẼ TẠO MỚI)
- ...

States:
- loading: ...
- error: ...
- empty: ...
- success (data có): ...

Vietnamese copy sẽ dùng:
- Heading: "..."
- CTA: "..."
- Empty state text: "..."

Confirm outline này? (yes / edit-outline / cancel)
```

**Chờ user confirm trước khi viết code.**

### Step 5: Sinh code

Sau khi confirm outline:

1. Tạo file `.tsx` với TypeScript đầy đủ
2. Comment tiếng Việt cho các section chính (đầu file, đầu mỗi section quan trọng)
3. Tuân thủ:
   - TSX + Tailwind, không CSS-in-JS
   - Import icon từ `lucide-react`
   - Font class theo MASTER.md (`font-baloo` / `font-nunito` / `font-be-vietnam-pro`)
   - Color qua Tailwind token (`bg-primary`, `text-accent`), không hardcode `#4B9EFF`
   - Responsive-first: mobile → tablet → desktop
   - A11y: `aria-label`, `role`, focus visible, semantic HTML
   - `prefers-reduced-motion` cho mọi animation
   - Không dùng emoji làm icon (mascot rùa là illustration SVG, không phải emoji 🐢 trong text)
4. Nếu cần shared component chưa có (VD: `<PlayfulCard />`) → **tạo trước** trong `src/components/ui/` với comment "// TODO: review và move vào design-system"
5. Text UI 100% tiếng Việt (không leftover placeholder "Lorem ipsum")

### Step 6: Post-generation

Sau khi tạo file:

1. Show diff/preview 30 dòng đầu + phần quan trọng nhất
2. List file mới tạo:
   ```
   ✅ Đã tạo:
   - src/pages/student/StudentDashboard.tsx (185 dòng)
   - src/components/ui/PlayfulCard.tsx (42 dòng) — MỚI, cần review
   ```
3. Note các TODO còn lại (nếu có):
   ```
   ⚠️ TODO còn để lại:
   - Fetch data từ API — đang mock ở function fetchDashboardData()
   - Icon môn "TN&XH" — hiện dùng BookOpen tạm, cần asset riêng
   ```
4. Đề xuất:
   ```
   Next step gợi ý:
   - Chạy /audit-page src/pages/student/StudentDashboard.tsx để double-check
   - Test render: npm run dev → route /student/dashboard
   ```

## Rule cứng

- **Outline trước, code sau.** Không skip Step 4 dù user gõ "làm nhanh".
- **Không thêm dependency mới** trừ khi ask và user approve rõ ràng.
- **File < 300 dòng.** Nếu vượt → tách component con.
- Nếu shared component tương tự đã có trong `src/components/` → dùng lại, đừng tạo bản trùng lặp.
- Copy tiếng Việt phải tự nhiên với học sinh tiểu học (nếu role = student): tránh từ Hán Việt phức tạp, dùng câu ngắn.

## Anti-pattern

- ❌ Copy design từ template Duolingo/Khan Academy y hệt — sáng tạo trong khuôn khổ design system
- ❌ Dùng emoji trực tiếp trong JSX (VD: `<span>🐢</span>`) — dùng component `<TitMascot />` hoặc SVG
- ❌ Import icon lẻ tẻ từ nhiều library — chỉ `lucide-react`
- ❌ Text placeholder tiếng Anh còn sót
