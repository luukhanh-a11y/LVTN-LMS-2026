---
description: Chốt MASTER design system cho Titkul LMS (chạy 1 lần duy nhất, sinh design-system/MASTER.md và các page override)
---

# Bootstrap Design System — Titkul LMS

Đây là task **one-shot** để thiết lập chuẩn thiết kế cho toàn project. Chỉ chạy 1 lần.

## Constraints CỐ ĐỊNH (không được đổi)

**Student UI (grade 1-5, chương trình "Kết nối tri thức"):**
- Style: Flat Playful / Claymorphism-lite (Duolingo-inspired)
- Palette primary: `#4B9EFF` (xanh)
- Palette accent: `#818CF8` (tím)
- Font heading: **Baloo 2** (weight 400/500/600/700)
- Font body: **Nunito** (weight 400/600/700)
- Mascot: rùa 🐢 tên **"Tit"**
- Tone: khuyến khích, không doạ, không dùng con số điểm khô khan

**Teacher & Parent UI:**
- Style: Professional SaaS (dashboard chuẩn công việc)
- Font: **Be Vietnam Pro** (400/500/600/700)
- Palette: kế thừa `#4B9EFF` làm primary, muted hơn phía student
- Không mascot, không animation vô nghĩa

**Global:**
- Ngôn ngữ: Tiếng Việt toàn bộ
- Stack: React + Vite + Tailwind CSS
- Icon: **Lucide React** (KHÔNG dùng emoji làm icon)
- Accessibility: WCAG AA tối thiểu

## Workflow

### Step 1: Sinh MASTER.md từ skill

Chạy script (dùng `python` nếu `python3` không có trên Windows):

```bash
python .claude/skills/ui-ux-pro-max/scripts/search.py "elementary school LMS Vietnamese kids playful learning" --design-system -p "Titkul LMS" --persist --output-dir design-system --variance 6 --motion 5 --density 4 --format markdown
```

### Step 2: Review & align

1. Mở `design-system/MASTER.md` skill vừa tạo
2. Đối chiếu với constraints bên trên
3. Sửa các mismatch — GIỮ NGUYÊN palette `#4B9EFF` + `#818CF8`, font Baloo 2 + Nunito + Be Vietnam Pro như đã chốt
4. Thêm section **"Vietnamese Typography"** vào MASTER.md (line-height 1.6+ cho tiếng Việt có dấu, tránh font ép dấu bay)

### Step 3: Sinh 3 page override

Chạy cho từng page chính:

```bash
python .claude/skills/ui-ux-pro-max/scripts/search.py "student learning dashboard playful" --design-system --page "student-dashboard" -p "Titkul" --persist --output-dir design-system

python .claude/skills/ui-ux-pro-max/scripts/search.py "teacher grading interface classroom management" --design-system --page "teacher-grading" -p "Titkul" --persist --output-dir design-system --variance 3 --motion 2 --density 7

python .claude/skills/ui-ux-pro-max/scripts/search.py "parent report child progress education" --design-system --page "parent-report" -p "Titkul" --persist --output-dir design-system --variance 3 --motion 2 --density 5
```

### Step 4: Bổ sung file cấu hình Tailwind & CSS variables

Sinh `design-system/tailwind-tokens.md` chứa:
- Đoạn `tailwind.config.js` extend colors, fontFamily
- Đoạn CSS variables cho `:root` (light) và `[data-theme="dark"]`
- Import Google Fonts snippet

### Step 5: Sinh README

Sinh `design-system/README.md` giải thích:
- Cấu trúc folder
- Cách reference MASTER.md khi code
- Cách chạy audit (nhắc đến slash command `/audit-page`, `/audit-project`)

## Output cuối cùng

Cấu trúc mong đợi:
```
design-system/
├── MASTER.md                      ← Hiến pháp UI của Titkul
├── README.md                      ← Hướng dẫn dùng
├── tailwind-tokens.md             ← Config Tailwind + CSS vars
└── pages/
    ├── student-dashboard.md
    ├── teacher-grading.md
    └── parent-report.md
```

## Rule quan trọng

- **KHÔNG** đổi palette/font đã chốt kể cả skill gợi ý khác
- **KHÔNG** thêm dependency mới (chỉ Lucide React nếu chưa có)
- Sau mỗi step, dừng lại show summary rồi mới sang step tiếp theo
- Toàn bộ text trong file `.md` viết bằng tiếng Việt
