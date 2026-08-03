# Design System — Titkul LMS

Đây là bộ chuẩn thiết kế (design system) dùng chung cho toàn bộ frontend Titkul LMS.
Mọi UI mới hoặc UI được sửa đều phải tuân theo tài liệu trong thư mục này.

## Cấu trúc folder

```
design-system/
├── MASTER.md               ← Hiến pháp UI của Titkul — bắt buộc đọc trước khi code bất kỳ UI nào
├── README.md                ← File này
├── tailwind-tokens.md        ← Cấu hình Tailwind + CSS variables tương ứng với MASTER.md
└── pages/
    ├── student-dashboard.md  ← Override riêng cho trang chủ học sinh
    ├── teacher-grading.md    ← Override riêng cho trang chấm bài giáo viên
    └── parent-report.md      ← Override riêng cho trang báo cáo phụ huynh
```

- **`MASTER.md`** định nghĩa 2 hệ thống UI song song: **Student UI** (Flat Playful /
  Claymorphism-lite, mascot Tit) và **Teacher & Parent UI** (Professional SaaS). Mọi
  page không có file override riêng phải tuân theo MASTER.md.
- **`pages/*.md`** chỉ ghi lại phần **khác biệt** so với MASTER.md cho một page cụ thể
  (layout, spacing, component đặc thù). Không lặp lại toàn bộ token — chỗ nào không
  nhắc tới nghĩa là dùng nguyên theo Master.

## Cách reference khi code

Trước khi viết hoặc sửa một page/component:

1. Xác định page đó thuộc **Student UI** hay **Teacher/Parent UI** — quyết định bộ
   token màu (`--student-*` hay `--pro-*`) và font (Baloo 2 + Nunito hay Be Vietnam Pro).
2. Kiểm tra `design-system/pages/[ten-page].md` có tồn tại không. Nếu có, áp dụng quy
   tắc trong đó trước, phần còn lại lấy từ `MASTER.md`.
3. Nếu không có file override, áp dụng toàn bộ `MASTER.md`.
4. Dùng token đã định nghĩa trong `tailwind-tokens.md` (CSS variables hoặc Tailwind
   class từ `theme.extend`) — không hard-code hex màu hoặc font-family trực tiếp
   trong component.
5. Icon luôn dùng **Lucide React**, không dùng emoji làm icon trong UI production.
6. Với mọi đoạn text tiếng Việt, đảm bảo `line-height` tuân theo phần **Vietnamese
   Typography** trong `MASTER.md` (tối thiểu 1.6 cho body, 1.4 cho heading).

## Lưu ý khi migrate code hiện tại

`tailwind.config.js` hiện tại của project đang dùng palette cũ (Indigo `#4F46E5`,
font Outfit) — chưa khớp với `MASTER.md`. Xem phần "Lưu ý migrate" trong
`tailwind-tokens.md` để biết cách áp dụng token mới mà không phá vỡ component đang
tham chiếu token cũ. Dùng `/fix-ui` để migrate từng section thay vì sửa toàn bộ cùng lúc.

## Cách chạy audit

- **`/audit-page`** — audit 1 file/page hiện có, đối chiếu với `MASTER.md` (và
  page override nếu có). Không tự sửa code, chỉ sinh report các điểm lệch chuẩn.
- **`/audit-project`** — audit toàn bộ `src/pages/` và `src/components/`, sinh report
  tổng hợp kèm danh sách top issue cần ưu tiên sửa.
- Sau khi có report từ 2 lệnh trên, dùng **`/fix-ui`** để áp dụng fix theo từng
  section, xác nhận từng thay đổi trước khi áp dụng tiếp.

## Khi cần sinh page/component mới

Dùng **`/design-page`** để sinh page hoặc component mới đúng chuẩn `MASTER.md` ngay
từ đầu (khác với `/audit-page` là audit code đã có, `/design-page` tạo mới).
