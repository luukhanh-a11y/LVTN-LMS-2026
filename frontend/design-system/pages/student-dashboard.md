# Student Dashboard — Page Override

> **PROJECT:** Titkul LMS
> **Page Type:** Trang chủ học sinh (Student UI)

> ⚠️ **QUAN TRỌNG:** Quy tắc trong file này **override** Master file (`design-system/MASTER.md`).
> Chỉ ghi lại phần khác biệt so với Master. Các quy tắc khác giữ nguyên theo Master.

---

## Bối cảnh

Trang đầu tiên học sinh lớp 1-5 nhìn thấy sau khi đăng nhập. Mục tiêu: học sinh biết
ngay hôm nay cần làm gì, cảm thấy được khích lệ, không bị áp lực bởi số liệu.

## Layout Override

- **Max width:** 960px, căn giữa — học sinh dùng cả máy tính bảng lẫn máy tính để bàn ở lớp
- **Section order:**
  1. Chào hỏi cá nhân hoá kèm mascot Tit (vd. "Chào Minh Anh! Tit rất vui được gặp con hôm nay 🐢")
  2. Streak / chuỗi ngày học — thanh pill bo tròn, nổi bật nhưng không đè nặng
  3. Danh sách bài tập hôm nay (card lớn, tối đa 3-4 card/hàng trên desktop, 1 card/hàng trên mobile)
  4. Huy hiệu / thành tích gần đây (carousel ngang, kéo vuốt được)
  5. Lối tắt đến "Bài tập của tôi", "Hồ sơ", "Trợ giúp"

## Spacing Override

- Không override — dùng thang spacing Student trong Master (Density 3/10)
- Khoảng cách giữa các card bài tập tối thiểu `--space-md` (20px) để tránh bấm nhầm trên tablet

## Typography Override

- Lời chào cá nhân hoá: Baloo 2, 600, 28-32px
- Tên bài tập trong card: Nunito 700, 18px
- Mô tả phụ (hạn nộp, môn học): Nunito 400, 14px, màu `--student-fg` với opacity 70%

## Color Override

- Không override bảng màu — dùng nguyên `--student-*` tokens trong Master
- Trạng thái bài tập dùng semantic màu Student: chưa làm = `--student-primary` nhạt, đã nộp = `--student-success`, quá hạn = `--student-warning` (KHÔNG dùng đỏ để tránh tạo áp lực)

## Component Override

### Card bài tập (khác card chuẩn trong Master ở chỗ có thanh trạng thái màu ở cạnh trái)

```css
.assignment-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 24px;
  padding: 20px;
  box-shadow: var(--shadow-clay-md);
  border-left: 6px solid var(--student-primary);
}
.assignment-card.submitted { border-left-color: var(--student-success); }
.assignment-card.due-soon { border-left-color: var(--student-warning); }
```

### Streak pill

```css
.streak-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--student-primary), var(--student-accent));
  color: white;
  border-radius: 999px;
  padding: 8px 20px;
  font-family: 'Baloo 2', sans-serif;
  font-weight: 600;
}
```

## Page-Specific Components

- **Mascot Tit banner:** illustration SVG của Tit + speech bubble, đổi câu thoại theo thời điểm trong ngày (sáng/chiều/tối) và theo streak hiện tại
- **Empty state:** khi chưa có bài tập nào — hiển thị Tit đang đọc sách với câu "Hôm nay con chưa có bài tập, cùng ôn lại bài cũ nhé!"

## Recommendations

- Hiệu ứng: card bài tập nảy nhẹ (`scale 1.02`) khi hover/tap, confetti nhỏ khi hoàn thành bài cuối cùng trong ngày
- Không dùng number count-up cho điểm số — ưu tiên hiển thị trạng thái ("Hoàn thành", "Đang làm") hơn con số thô
- CTA chính ("Làm bài ngay") luôn nằm trong card, không đặt CTA rời trong nav
