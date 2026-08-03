# Design System Master File — Titkul LMS

> **LOGIC:** Khi build một page cụ thể, luôn kiểm tra `design-system/pages/[page-name].md` trước.
> Nếu file đó tồn tại, quy tắc trong đó **override** Master file này.
> Nếu không, tuân thủ nghiêm ngặt các quy tắc bên dưới.

---

**Project:** Titkul LMS
**Category:** LMS (Learning Management System) — Tiểu học, chương trình "Kết nối tri thức"
**Ngôn ngữ:** Tiếng Việt toàn bộ
**Stack:** React + Vite + Tailwind CSS
**Icon set:** Lucide React — **KHÔNG dùng emoji làm icon**
**Accessibility:** WCAG AA tối thiểu

---

## Hai hệ thống UI song song

Titkul có **hai ngôn ngữ thiết kế khác nhau** tuỳ theo đối tượng dùng. Luôn xác định
mình đang build cho ai trước khi áp token nào.

| | **Student UI** | **Teacher & Parent UI** |
|---|---|---|
| Đối tượng | Học sinh lớp 1-5 | Giáo viên, phụ huynh |
| Style | Flat Playful / Claymorphism-lite (lấy cảm hứng Duolingo) | Professional SaaS (dashboard công việc) |
| Design Dials | Variance 7/10, Motion 6/10, Density 3/10 | Variance 3/10, Motion 2/10, Density 6/10 |
| Font heading | Baloo 2 (400/500/600/700) | Be Vietnam Pro (500/600/700) |
| Font body | Nunito (400/600/700) | Be Vietnam Pro (400/500/600) |
| Mascot | Rùa **"Tit"** 🐢 — xuất hiện ở empty state, onboarding, khoảnh khắc khen thưởng | Không mascot |
| Animation | Vui, bật nảy (bounce/spring) nhưng có `prefers-reduced-motion` | Tối giản, chỉ transition chức năng (hover/focus/loading), không animation trang trí |
| Tone | Khuyến khích, không doạ, không chấm điểm khô khan ("Con đã cố gắng!" thay vì "Sai rồi") | Trung lập, chuyên nghiệp, rõ ràng, đúng số liệu |

---

## Color Palette

Hai màu thương hiệu **cố định, không đổi** trong mọi ngữ cảnh:

| Role | Hex | CSS Variable |
|------|-----|--------------|
| **Primary** | `#4B9EFF` | `--color-primary` |
| **Accent** | `#818CF8` | `--color-accent` |

### Student UI — bảng màu đầy đủ (bão hoà cao, tương phản vui vẻ)

| Role | Hex | CSS Variable | Ghi chú |
|------|-----|--------------|---------|
| Primary | `#4B9EFF` | `--student-primary` | CTA chính, nút "Bắt đầu" |
| Accent | `#818CF8` | `--student-accent` | Highlight, badge, streak |
| Success | `#58CC02` | `--student-success` | Đúng, hoàn thành (tông Duolingo) |
| Warning | `#FFC800` | `--student-warning` | Nhắc nhở nhẹ nhàng |
| Gentle Error | `#FF8A8A` | `--student-error` | Sai — dùng màu hồng-đỏ dịu, KHÔNG dùng đỏ gắt |
| Background | `#F0F7FF` | `--student-bg` | Nền chính, xanh rất nhạt |
| Surface | `#FFFFFF` | `--student-surface` | Card, panel |
| Foreground | `#1E293B` | `--student-fg` | Chữ chính — xám đậm, không dùng đen tuyền (dịu mắt trẻ em) |
| Border | `#DCEBFF` | `--student-border` | Viền card, divider |

### Teacher & Parent UI — bảng màu muted (chuyên nghiệp, ít bão hoà hơn)

| Role | Hex | CSS Variable | Ghi chú |
|------|-----|--------------|---------|
| Primary | `#4B9EFF` | `--pro-primary` | Kế thừa từ Student, dùng có tiết chế (nút chính, link) |
| Accent | `#818CF8` | `--pro-accent` | Chỉ dùng cho trạng thái nhấn mạnh (badge trạng thái, chart) |
| Success | `#16A34A` | `--pro-success` | Đạt / hoàn thành |
| Warning | `#D97706` | `--pro-warning` | Cần chú ý |
| Destructive | `#DC2626` | `--pro-destructive` | Lỗi, xoá, từ chối |
| Background | `#F8FAFC` | `--pro-bg` | Nền dashboard |
| Surface | `#FFFFFF` | `--pro-surface` | Card, table, panel |
| Foreground | `#0F172A` | `--pro-fg` | Chữ chính |
| Muted | `#64748B` | `--pro-muted` | Chữ phụ, label |
| Border | `#E2E8F0` | `--pro-border` | Viền input, divider, table |

---

## Typography

### Student UI

- **Heading:** Baloo 2 — weight 400/500/600/700, chữ tròn, thân thiện
- **Body:** Nunito — weight 400/600/700, dễ đọc ở cỡ nhỏ
- **Google Fonts import:**

```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap');
```

- Cỡ chữ tối thiểu cho học sinh: 16px body, 24px+ cho heading chính, ưu tiên chữ to hơn UI người lớn.

### Teacher & Parent UI

- **Heading & Body:** Be Vietnam Pro — weight 400/500/600/700 (không cần font phụ, một font family xuyên suốt để giữ cảm giác dashboard gọn gàng)
- **Google Fonts import:**

```css
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
```

### Import gộp (dùng trong `index.html` hoặc `index.css` của toàn app)

```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Nunito:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
```

---

## Vietnamese Typography

Tiếng Việt có dấu thanh (sắc, huyền, hỏi, ngã, nặng) đặt phía trên/dưới ký tự — nếu
line-height quá chặt hoặc font không hỗ trợ tốt bộ Latin Extended, dấu sẽ bị cắt
("dấu bay") hoặc chồng lên dòng trên/dưới. Quy tắc bắt buộc:

- **Line-height tối thiểu 1.6** cho mọi đoạn văn bản (`body`, `p`, danh sách bài tập, mô tả).
- **Line-height tối thiểu 1.4** cho heading (heading thường có dấu sắc/huyền ở đầu dòng dễ bị cắt nếu quá sát viền trên).
- Cả 3 font đã chọn (Baloo 2, Nunito, Be Vietnam Pro) đều hỗ trợ đầy đủ bộ ký tự tiếng Việt — Be Vietnam Pro được thiết kế riêng cho tiếng Việt, ưu tiên dùng khi cần độ chính xác dấu cao nhất (bảng điểm, báo cáo).
- **Không dùng `letter-spacing` âm** — dễ làm dấu ký tự này đè lên ký tự kế tiếp.
- **Tránh viết hoa toàn bộ (UPPERCASE)** cho câu dài tiếng Việt — chữ hoa có dấu khó đọc hơn chữ thường; chỉ dùng uppercase cho nhãn ngắn 1-2 từ (badge, tag).
- Khi truncate text (`text-overflow: ellipsis`), kiểm tra không cắt giữa tổ hợp nguyên âm + dấu (vd. "ường" không nên bị cắt còn "ườ").
- Input/label test bắt buộc với chuỗi có đủ dấu: `"Nguyễn Thị Bích Ngọc — Lớp 3A2"`.

---

## Spacing Variables

### Student UI (Density 3/10 — thoáng, dễ chạm cho trẻ em)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `6px` / `0.375rem` | Khoảng cách icon-text |
| `--space-sm` | `12px` / `0.75rem` | Padding nút nhỏ |
| `--space-md` | `20px` / `1.25rem` | Padding card, form field |
| `--space-lg` | `32px` / `2rem` | Padding section |
| `--space-xl` | `48px` / `3rem` | Khoảng cách giữa các khối lớn |
| `--space-2xl` | `64px` / `4rem` | Hero, khoảng trắng trang chủ |

### Teacher & Parent UI (Density 6/10 — dày hơn, tối ưu thông tin)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Khoảng cách chặt trong table cell |
| `--space-sm` | `8px` / `0.5rem` | Icon gap, inline spacing |
| `--space-md` | `16px` / `1rem` | Padding chuẩn |
| `--space-lg` | `24px` / `1.5rem` | Padding section, card |
| `--space-xl` | `32px` / `2rem` | Khoảng cách block lớn |

---

## Shadow Depths

### Student UI — clay-style (nhiều lớp, mềm, tạo cảm giác "nặn đất sét")

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-clay-sm` | `0 2px 0 rgba(75,158,255,0.15), 0 4px 8px rgba(75,158,255,0.10)` | Nút, badge nhỏ |
| `--shadow-clay-md` | `0 4px 0 rgba(75,158,255,0.15), 0 8px 16px rgba(75,158,255,0.12)` | Card bài học |
| `--shadow-clay-lg` | `0 6px 0 rgba(129,140,248,0.18), 0 12px 24px rgba(129,140,248,0.15)` | Modal, popup khen thưởng |

### Teacher & Parent UI — phẳng, tối giản

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(15,23,42,0.05)` | Hàng table hover |
| `--shadow-md` | `0 2px 6px rgba(15,23,42,0.08)` | Card, dropdown |
| `--shadow-lg` | `0 8px 20px rgba(15,23,42,0.10)` | Modal, sidebar overlay |

---

## Component Specs

### Buttons

```css
/* Student — Primary Button (bo tròn nhiều, clay-lift khi hover) */
.student-btn-primary {
  background: #4B9EFF;
  color: white;
  padding: 14px 28px;
  border-radius: 16px;
  font-family: 'Baloo 2', sans-serif;
  font-weight: 600;
  box-shadow: var(--shadow-clay-sm);
  transition: transform 200ms ease, box-shadow 200ms ease;
  cursor: pointer;
}
.student-btn-primary:hover {
  transform: translateY(-2px);
}
.student-btn-primary:active {
  transform: translateY(1px);
  box-shadow: none;
}

/* Teacher/Parent — Primary Button (gọn, phẳng) */
.pro-btn-primary {
  background: #4B9EFF;
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-weight: 500;
  transition: background 150ms ease;
  cursor: pointer;
}
.pro-btn-primary:hover {
  background: #3B8AEF;
}
```

### Cards

```css
/* Student — bo tròn lớn, nền trắng nổi trên nền xanh nhạt */
.student-card {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 24px;
  box-shadow: var(--shadow-clay-md);
  transition: transform 200ms ease;
  cursor: pointer;
}
.student-card:hover {
  transform: translateY(-3px);
}

/* Teacher/Parent — border mảnh, ít shadow */
.pro-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}
```

### Inputs

```css
/* Student */
.student-input {
  padding: 14px 18px;
  border: 2px solid #DCEBFF;
  border-radius: 14px;
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  transition: border-color 200ms ease;
}
.student-input:focus {
  border-color: #4B9EFF;
  outline: none;
  box-shadow: 0 0 0 4px #4B9EFF25;
}

/* Teacher/Parent */
.pro-input {
  padding: 10px 14px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  transition: border-color 150ms ease;
}
.pro-input:focus {
  border-color: #4B9EFF;
  outline: none;
  box-shadow: 0 0 0 3px #4B9EFF20;
}
```

### Modals

```css
/* Student — bo tròn lớn, mascot Tit có thể xuất hiện góc trên */
.student-modal-overlay {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(4px);
}
.student-modal {
  background: white;
  border-radius: 28px;
  padding: 32px;
  box-shadow: var(--shadow-clay-lg);
  max-width: 480px;
  width: 90%;
}

/* Teacher/Parent — gọn, không bo tròn quá mức */
.pro-modal-overlay {
  background: rgba(15, 23, 42, 0.5);
}
.pro-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-lg);
  max-width: 560px;
  width: 90%;
}
```

---

## Mascot — Rùa "Tit"

- Tit là linh vật duy nhất của Student UI, KHÔNG xuất hiện trong Teacher/Parent UI.
- Dùng Tit ở: màn hình chào mừng, empty state ("Chưa có bài tập nào, Tit đang chờ con nộp bài đầu tiên!"), khoảnh khắc hoàn thành bài học, streak nhắc nhở.
- Giọng điệu của Tit luôn khuyến khích: khen ngợi nỗ lực trước, không nhắc điểm số thấp một cách trực diện.
- Tit được vẽ dưới dạng illustration/SVG (không dùng emoji rùa 🐢 để thay thế mascot thật trong UI production — emoji chỉ dùng khi mô tả trong tài liệu).

---

## Style Guidelines

### Student — Flat Playful / Claymorphism-lite

**Keywords:** Bo tròn lớn (16-28px), màu sắc tươi sáng nhưng hài hoà, shadow nhiều lớp kiểu "đất sét", chuyển động nảy nhẹ (spring), mascot Tit, phản hồi tích cực tức thì.

**Best For:** Trang chủ học sinh, danh sách bài tập, làm bài H5P, trang thành tích/huy hiệu.

**Key Effects:** Bounce/spring khi hoàn thành, confetti nhẹ khi đạt streak, progress bar dạng pill bo tròn, hover nâng nhẹ (translateY).

### Teacher & Parent — Professional SaaS

**Keywords:** Bố cục dashboard chuẩn (sidebar + content), bảng dữ liệu rõ ràng, mật độ thông tin cao hơn, không trang trí thừa.

**Best For:** Danh sách lớp, chấm bài, báo cáo tiến độ con, quản lý tài khoản.

**Key Effects:** Transition chức năng only (hover row, loading skeleton, focus ring) — không animation trang trí, không parallax, không confetti.

---

## Motion

### Student — Standard, vui tươi (Motion 6/10)

```js
// Hoàn thành bài tập — nảy nhẹ + fade
gsap.timeline()
  .to('.result-card', { scale: 1.05, duration: 0.2, ease: 'back.out(2)' })
  .to('.result-card', { scale: 1, duration: 0.15, ease: 'power1.out' });
```

- ✅ Luôn tôn trọng `prefers-reduced-motion`: tắt bounce, giữ lại fade đơn giản.
- ❌ Không dùng animation chặn thao tác của học sinh quá 600ms.

### Teacher & Parent — Tối giản (Motion 2/10)

- Chỉ dùng transition 150-200ms cho hover/focus/loading state.
- Không dùng page-transition overlay, không parallax, không animation trang trí trong dashboard.

---

## Anti-Patterns (Do NOT Use)

- ❌ Dùng chung 1 bộ token màu/font cho cả Student và Teacher/Parent — hai hệ thống phải tách biệt rõ ràng.
- ❌ Emoji làm icon trong production UI (chỉ Lucide React SVG icons)
- ❌ Dùng màu đỏ gắt (`#DC2626`) để báo "sai" cho học sinh — dùng `--student-error` (#FF8A8A) dịu hơn
- ❌ Mascot Tit xuất hiện trong Teacher/Parent UI
- ❌ Animation trang trí vô nghĩa (confetti, parallax...) trong Teacher/Parent UI
- ❌ Line-height dưới 1.6 cho đoạn văn tiếng Việt
- ❌ Viết hoa toàn bộ câu dài tiếng Việt
- ❌ Thiếu `cursor:pointer` trên phần tử có thể click
- ❌ Trạng thái focus không hiển thị rõ (vi phạm a11y)
- ❌ Tương phản chữ dưới 4.5:1

---

## Pre-Delivery Checklist

Trước khi giao bất kỳ UI code nào, kiểm tra:

- [ ] Đã xác định đúng hệ thống (Student hay Teacher/Parent) và dùng đúng token màu/font
- [ ] Không dùng emoji làm icon (dùng Lucide React)
- [ ] `cursor-pointer` trên mọi phần tử có thể click
- [ ] Hover state có transition mượt (150-300ms)
- [ ] Light mode: tương phản chữ tối thiểu 4.5:1
- [ ] Focus state hiển thị rõ khi điều hướng bằng bàn phím
- [ ] `prefers-reduced-motion` được tôn trọng
- [ ] Line-height ≥ 1.6 cho mọi đoạn văn tiếng Việt, đã test với chuỗi có đủ dấu
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Không có nội dung bị che bởi navbar cố định
- [ ] Không có horizontal scroll trên mobile
- [ ] (Student UI) Mascot Tit dùng đúng ngữ cảnh, giọng điệu khuyến khích
- [ ] (Teacher/Parent UI) Không có animation trang trí thừa, không mascot
