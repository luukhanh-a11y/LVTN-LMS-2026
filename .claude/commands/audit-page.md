---
description: Audit 1 file/page hiện có theo chuẩn design-system/MASTER.md (không sửa code, chỉ report)
---

# Audit Page — Titkul LMS

Audit file: **$ARGUMENTS**

Chỉ report. **KHÔNG sửa code.** User sẽ chạy `/fix-ui` sau nếu muốn apply.

## Workflow

### Step 1: Đọc chuẩn

Đọc THEO THỨ TỰ:
1. `design-system/MASTER.md` — nắm design tokens tổng thể
2. Nếu file thuộc role student → đọc `design-system/pages/student-dashboard.md` (làm tham chiếu style student)
3. Nếu file thuộc role teacher → đọc `design-system/pages/teacher-grading.md`
4. Nếu file thuộc role parent → đọc `design-system/pages/parent-report.md`

Nếu chưa có `design-system/MASTER.md`, dừng và bảo user chạy `/bootstrap-design-system` trước.

### Step 2: Đọc file target

Đọc file `$ARGUMENTS` cùng các file liên quan trực tiếp (component con nó import).

### Step 3: Tra cứu bổ sung (nếu cần)

Chỉ gọi skill khi có nghi vấn cụ thể. Ví dụ:
```bash
python .claude/skills/ui-ux-pro-max/scripts/search.py "kids dashboard streak gamification" --domain ux
```

### Step 4: Report theo format cố định

Xuất báo cáo trực tiếp trong chat (không tạo file), theo cấu trúc:

```markdown
# Audit Report: $ARGUMENTS
**Ngày:** [YYYY-MM-DD]  
**Role:** [student/teacher/parent]  
**Compliance:** [X/10]  

## ✅ Đạt chuẩn
- [Bullet ngắn, cụ thể — VD: "Palette dùng đúng #4B9EFF cho primary button"]
- ...

## ⚠️ Cần cải thiện

### [P0] Blocker (must fix)
- **Vấn đề:** [mô tả]
  - **Vị trí:** line X, function/component Y
  - **Chuẩn:** MASTER.md section Z quy định ...
  - **Ảnh hưởng:** [accessibility / UX / consistency / performance]

### [P1] Nên fix
- ...

### [P2] Nice to have
- ...

## 🎯 Đề xuất refactor cụ thể

Mỗi item có code snippet before/after (KHÔNG viết ra file, chỉ show trong chat):

**Item 1: [tên ngắn]**
```tsx
// Before
[code hiện tại]

// After
[code đề xuất]
```
*Lý do:* [1 câu]

## 📋 Checklist WCAG/UX (từ skill)

- [ ] Contrast text 4.5:1 minimum
- [ ] Focus state visible cho keyboard nav
- [ ] `cursor-pointer` trên mọi clickable
- [ ] Hover transition 150-300ms
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive 375/768/1024/1440
- [ ] Không dùng emoji làm icon (đã có SVG chưa?)
- [ ] Text tiếng Việt không bị ép dấu
- [ ] Loading states / error states / empty states có đủ

## 📊 Tóm tắt

- Tổng issue: [X] (P0: Y | P1: Z | P2: W)
- Ước lượng effort fix: [nhỏ / vừa / lớn]
- Recommendation: [chạy `/fix-ui` với priority P0-P1 / cần refactor lớn hơn / OK không cần đụng]
```

## Rule quan trọng

- **KHÔNG sửa file target**
- Nếu file không tồn tại hoặc `$ARGUMENTS` trống, báo error và list các file `.tsx/.jsx` gần đây trong `src/`
- Nếu compliance ≥ 9/10, nói thẳng "file này đã tốt, không cần fix" thay vì tìm issue để có report cho có
- Toàn bộ report tiếng Việt (trừ code)
