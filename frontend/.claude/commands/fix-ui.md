---
description: Apply fix theo audit report gần nhất, section-by-section, confirm từng cái
---

# Fix UI — Titkul LMS

Apply các fix từ audit report gần nhất trong conversation. **Section-by-section**, chờ user confirm mỗi mục.

Argument (optional): **$ARGUMENTS**
- Nếu trống: fix mọi item P0 + P1 từ audit gần nhất
- Nếu là `P0`: chỉ fix P0
- Nếu là `P0-P1`: fix P0 và P1
- Nếu là số (VD: `Item 3`): chỉ fix item đó

## Workflow

### Step 1: Xác định target

Tìm audit report gần nhất trong context. Nếu không thấy report nào → dừng và bảo user chạy `/audit-page <file>` trước.

Confirm với user:
```
Sẽ fix file: [tên file từ audit]
Scope: [P0 / P0-P1 / all / item cụ thể]
Số item sẽ fix: [X]
Danh sách item:
  1. [tên item] [P0]
  2. [tên item] [P1]
  ...
Đồng ý? (yes/no/edit)
```

Chờ user trả lời trước khi fix.

### Step 2: Fix từng item

Với mỗi item, làm theo trình tự:

1. **Show diff dự kiến:**
   ```
   ## Item [N]/[Total]: [Tên item]
   File: [path]
   Priority: [P0/P1/P2]
   
   Diff:
   - [dòng bị đổi]
   + [dòng mới]
   ```

2. **Áp dụng edit** vào file (dùng str_replace hoặc edit tool)

3. **Verify:** đọc lại đoạn vừa sửa, confirm cú pháp OK

4. **Dừng** và hỏi user:
   ```
   ✅ Item [N] done. 
   → next / redo / skip-rest / stop
   ```

5. Nếu user gõ:
   - `next` hoặc Enter → sang item tiếp theo
   - `redo` → revert và làm lại theo hướng khác
   - `skip-rest` → bỏ các item còn lại, đi thẳng Step 3
   - `stop` → dừng luôn, không đi Step 3

### Step 3: Summary cuối

Sau khi xong hết (hoặc user gõ `skip-rest`):

```markdown
## ✅ Fix Summary

**File:** [path]
**Đã fix:** [X]/[Total] item

### Đã áp dụng
- [item name] — [1 dòng mô tả thay đổi]
- ...

### Bỏ qua
- [item name] — [lý do]
- ...

### Cần verify manual
- [ ] Chạy `npm run dev` xem có console error không
- [ ] Test responsive 375px + 1440px
- [ ] Test keyboard nav (Tab / Enter / Esc)
- [ ] Nếu có thay đổi color/font, test dark mode nếu có

### Đề xuất next step
- [Chạy audit lại xem compliance cải thiện thế nào]
- [Hoặc: file kế tiếp cần audit]
```

## Nguyên tắc CỨNG

- **Đổi từng item một.** Không gộp nhiều item vào 1 lần edit dù chúng gần nhau.
- **Chỉ đụng UI/styling.** Không refactor business logic, không đổi tên biến ngoại trừ khi chính item yêu cầu.
- **Không thêm dependency mới** (trừ khi user explicit approve — báo trước và chờ yes).
- **Không tạo file mới** trừ khi item yêu cầu (VD: extract shared component).
- Nếu edit fail (str_replace không match) → không guess, hỏi user cách xử lý.
- Text UI viết bằng tiếng Việt.

## Anti-pattern (không được làm)

- ❌ Fix hết một lượt rồi mới show diff tổng
- ❌ "Cải tiến thêm" ngoài scope audit report
- ❌ Đổi library (VD: swap Heroicons → Lucide) mà không phải item trong report
- ❌ Reformat toàn file bằng Prettier trong lúc fix
