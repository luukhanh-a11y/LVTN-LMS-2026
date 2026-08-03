# Tailwind Tokens — Titkul LMS

> Tài liệu này mô tả cấu hình Tailwind + CSS variables **mục tiêu** cho toàn bộ dự án,
> theo đúng `design-system/MASTER.md`. Khi migrate `tailwind.config.js` hiện tại
> (đang dùng Indigo `#4F46E5` + font Outfit) sang bộ token này, dùng `/fix-ui` để áp
> dụng từng phần, tránh sửa toàn bộ UI cùng lúc.

---

## 1. Google Fonts import

Thêm vào `index.html` (trong `<head>`) hoặc dòng đầu `src/index.css`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Nunito:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Hoặc qua `@import` trong CSS (chậm hơn `<link>` nhưng gọn nếu không sửa `index.html`):

```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Nunito:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
```

---

## 2. `tailwind.config.js` — extend

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Student UI
        heading: ['"Baloo 2"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
        // Teacher & Parent UI
        pro: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      colors: {
        // Hai màu thương hiệu cố định — dùng chung cho cả 2 hệ thống
        brand: {
          primary: '#4B9EFF',
          accent: '#818CF8',
        },
        // Student UI palette
        student: {
          primary: '#4B9EFF',
          accent: '#818CF8',
          success: '#58CC02',
          warning: '#FFC800',
          error: '#FF8A8A',
          bg: '#F0F7FF',
          surface: '#FFFFFF',
          fg: '#1E293B',
          border: '#DCEBFF',
        },
        // Teacher & Parent UI palette (muted)
        pro: {
          primary: '#4B9EFF',
          accent: '#818CF8',
          success: '#16A34A',
          warning: '#D97706',
          destructive: '#DC2626',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          fg: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
      borderRadius: {
        'clay-sm': '14px',
        'clay-md': '24px',
        'clay-lg': '28px',
      },
      boxShadow: {
        'clay-sm': '0 2px 0 rgba(75,158,255,0.15), 0 4px 8px rgba(75,158,255,0.10)',
        'clay-md': '0 4px 0 rgba(75,158,255,0.15), 0 8px 16px rgba(75,158,255,0.12)',
        'clay-lg': '0 6px 0 rgba(129,140,248,0.18), 0 12px 24px rgba(129,140,248,0.15)',
      },
    },
  },
  plugins: [],
}
```

**Lưu ý migrate:** file `tailwind.config.js` hiện tại định nghĩa `colors.primary` = Indigo
`#4F46E5` và `colors.secondary` = `#818CF8`. Token mới đặt tên namespace riêng
(`student.*`, `pro.*`, `brand.*`) để tránh xung đột — không ghi đè trực tiếp lên
`primary`/`secondary` cũ cho tới khi migrate xong toàn bộ component đang tham chiếu chúng.

---

## 3. CSS Variables — `:root` (light) và `[data-theme="dark"]`

Đặt trong `src/index.css`, sau phần `@import` font ở trên:

```css
:root {
  /* Brand — cố định */
  --color-brand-primary: #4B9EFF;
  --color-brand-accent: #818CF8;

  /* Student UI */
  --student-primary: #4B9EFF;
  --student-accent: #818CF8;
  --student-success: #58CC02;
  --student-warning: #FFC800;
  --student-error: #FF8A8A;
  --student-bg: #F0F7FF;
  --student-surface: #FFFFFF;
  --student-fg: #1E293B;
  --student-border: #DCEBFF;

  /* Teacher & Parent UI */
  --pro-primary: #4B9EFF;
  --pro-accent: #818CF8;
  --pro-success: #16A34A;
  --pro-warning: #D97706;
  --pro-destructive: #DC2626;
  --pro-bg: #F8FAFC;
  --pro-surface: #FFFFFF;
  --pro-fg: #0F172A;
  --pro-muted: #64748B;
  --pro-border: #E2E8F0;

  /* Spacing — Student (Density 3/10) */
  --space-student-xs: 6px;
  --space-student-sm: 12px;
  --space-student-md: 20px;
  --space-student-lg: 32px;
  --space-student-xl: 48px;

  /* Spacing — Teacher/Parent (Density 6/10) */
  --space-pro-xs: 4px;
  --space-pro-sm: 8px;
  --space-pro-md: 16px;
  --space-pro-lg: 24px;
  --space-pro-xl: 32px;

  /* Shadows — Student (clay) */
  --shadow-clay-sm: 0 2px 0 rgba(75,158,255,0.15), 0 4px 8px rgba(75,158,255,0.10);
  --shadow-clay-md: 0 4px 0 rgba(75,158,255,0.15), 0 8px 16px rgba(75,158,255,0.12);
  --shadow-clay-lg: 0 6px 0 rgba(129,140,248,0.18), 0 12px 24px rgba(129,140,248,0.15);

  /* Shadows — Teacher/Parent (flat) */
  --shadow-pro-sm: 0 1px 2px rgba(15,23,42,0.05);
  --shadow-pro-md: 0 2px 6px rgba(15,23,42,0.08);
  --shadow-pro-lg: 0 8px 20px rgba(15,23,42,0.10);

  /* Fonts */
  --font-heading: 'Baloo 2', sans-serif;
  --font-body: 'Nunito', sans-serif;
  --font-pro: 'Be Vietnam Pro', sans-serif;
}

[data-theme="dark"] {
  --student-bg: #0F1B2D;
  --student-surface: #16233A;
  --student-fg: #E8F1FF;
  --student-border: #23324A;

  --pro-bg: #0B1220;
  --pro-surface: #131C2E;
  --pro-fg: #F1F5F9;
  --pro-muted: #94A3B8;
  --pro-border: #263349;

  /* Primary/accent giữ nguyên ở dark mode để giữ nhận diện thương hiệu nhất quán */
}
```

### Áp dụng `prefers-color-scheme` mặc định

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* copy toàn bộ block [data-theme="dark"] ở trên vào đây để tôn trọng theme hệ điều hành
       khi người dùng chưa chọn theme thủ công trong app */
  }
}
```

---

## 4. Vietnamese Typography — CSS bắt buộc

```css
body {
  line-height: 1.6;
}
h1, h2, h3, h4, h5, h6 {
  line-height: 1.4;
}
/* Không dùng letter-spacing âm cho text tiếng Việt */
.no-negative-tracking {
  letter-spacing: 0;
}
```
