# Audit Report — Titkul LMS Frontend (src/components/)

> **Ngày audit:** 2026-07-08
> **Scope:** `src/components/ui/*` + `src/components/h5p/*` (9 file). `Button.tsx` đã audit/fix trước đó (9.0/10, giữ nguyên).
> **Đối chiếu chuẩn:** `design-system/MASTER.md`
> **Không sửa code** trong quá trình audit này.

---

## 1. Bảng Compliance (sort yếu nhất lên đầu)

| File | Compliance | P0 | P1 | P2 | Effort |
|------|-----------:|---:|---:|---:|:------:|
| `ui/Input.tsx` | **3.0/10** | 3 | 0 | 0 | Vừa |
| `ui/Badge.tsx` | 6.5/10 | 1 | 0 | 0 | Nhỏ |
| `ui/Card.tsx` | 7.0/10 | 0 | 1 | 0 | Nhỏ |
| `h5p/H5PEditor.tsx` | 7.0/10 | 1 | 0 | 0 | Nhỏ |
| `h5p/H5PPlayer.tsx` | 7.0/10 | 1 | 0 | 0 | Nhỏ |
| `ui/Modal.tsx` | 7.5/10 | 0 | 0 | 1 | — |
| `ui/Table.tsx` | 8.0/10 | 0 | 0 | 0 | — |
| `ui/PageTitle.tsx` | 9.0/10 | 0 | 0 | 0 | — |
| `ui/Button.tsx` | 9.0/10 (đã fix trước đó) | 0 | 0 | 0 | — |

**Compliance trung bình: 7.1/10** | **P0: 6** | **P1: 1** | **P2: 1**

---

## 2. Phát hiện quan trọng nhất: `ui/Input.tsx`

Đây là **component bị bỏ sót nghiêm trọng nhất trong toàn bộ quá trình audit** — được import và dùng ở gần như mọi form trên mọi trang (`admin/Users`, `admin/Classes`, `teacher/Assignments`, `parent/Children`, `student/Profile`...), nhưng **chưa từng được đụng tới** trong bất kỳ vòng fix nào trước đây vì các trang dùng nó chỉ set màu qua `label`/`className` bên ngoài, còn style lõi nằm cứng trong component:

- Toàn bộ theme màu dùng **tím/violet không liên quan gì đến brand** (`#8b5cf6`, `#a78bfa`, `rgba(167,139,250,...)`, `purple-200/300/400`) — hoàn toàn khác `#4B9EFF`/`#818CF8` đã chốt.
- Label màu dùng thẳng **`text-[#4f46e5]`** — đây chính là **giá trị `primary` cũ** trong `tailwind.config.js` trước khi tôi đổi thành `#4B9EFF` ở vòng fix đầu tiên. Input.tsx hardcode trực tiếp con số cũ thay vì dùng token, nên không hề được hưởng lợi từ việc sửa config.
- Prop `theme?: 'light' | 'dark'` không hề map với hệ thống Student/Pro của MASTER.md — đây là một khái niệm theme khác (có vẻ dự định cho light/dark mode) chưa từng được dùng nhất quán.
- Border-radius `rounded-[24px]` (bo tròn rất lớn, kiểu clay) áp dụng cho MỌI input kể cả trong context Admin/Teacher/Parot (Pro UI) — không phù hợp với "Professional SaaS" đã chốt cho 3 role đó.

**Tác động:** vì component này dùng ở tất cả 4 role, sửa nó sẽ là quick win lớn nhất còn lại của toàn bộ dự án — ảnh hưởng tới hàng chục form cùng lúc.

---

## 3. Top issue

| # | Issue | File | Priority |
|---|-------|------|:--------:|
| 1 | Toàn bộ palette không liên quan brand (`violet`/`purple` hex rời rạc) + label hardcode giá trị `primary` cũ | `Input.tsx` | P0 |
| 2 | Không phân biệt Student/Pro (chỉ có light/dark, không map hệ thống 2 role) | `Input.tsx` | P0 |
| 3 | Border-radius clay (`24px`) áp dụng sai cho context Pro UI | `Input.tsx` | P0 |
| 4 | `Badge` variant `success`/`warning`/`danger` dùng Tailwind default (`green-100`, `amber-100`, `red-100`) thay vì `pro-success`/`pro-warning`/`pro-destructive` | `Badge.tsx` | P0 |
| 5 | `H5PEditor.tsx`/`H5PPlayer.tsx` dùng `indigo-600` cho spinner/nút — `H5PPlayer` được dùng cả ở Student (`AssignmentH5PPlayer`) lẫn Teacher (`MaterialDetail`, `EditorMock`), cần quyết định token nào | `H5PEditor.tsx`, `H5PPlayer.tsx` | P0 |
| 6 | `Card.tsx` chỉ có 1 style (Pro/flat), chưa có biến thể "clay" cho Student UI theo spec MASTER.md | `Card.tsx` | P1 |
| 7 | `Modal.tsx` tương tự — chỉ có style Pro, chưa có biến thể Student | `Modal.tsx` | P2 |

---

## 4. Lưu ý riêng: component dùng chéo Student/Pro

`H5PPlayer.tsx` là component **duy nhất trong `src/components/` được dùng bởi cả Student lẫn Teacher**:
- Student: `AssignmentH5PPlayer.tsx` (làm bài)
- Teacher: `MaterialDetail.tsx`, `EditorMock.tsx` (xem trước học liệu)

Khác với `Button.tsx` (đã giải quyết bằng cách thêm variant riêng `student-primary`/`pro-primary`), `H5PPlayer` không nhận prop variant nào — cần quyết định: thêm prop `variant` tương tự Button, hay giữ neutral (không thiên về brand màu nào, chỉ dùng slate trung tính cho spinner)?

---

## Overview

- Tổng file audit: 9 (bao gồm `Button.tsx` đã fix trước, `PageTitle.tsx` đã sạch)
- Compliance trung bình: **7.1/10**
- Blocker (P0) toàn scope: **6** (tập trung 3/6 ở riêng `Input.tsx`)
- Ước lượng effort fix P0+P1: ~2-3 giờ (riêng `Input.tsx` cần thiết kế lại kỹ hơn vì ảnh hưởng toàn app)

## Đề xuất next step

1. **Ưu tiên cao nhất: sửa `Input.tsx`** — quick win lớn nhất còn lại, ảnh hưởng mọi form trong app
2. Quyết định cách xử lý `H5PPlayer.tsx` (component dùng chéo Student/Pro) trước khi sửa màu
3. Fix `Badge.tsx` sang token `pro-*` (và cân nhắc thêm biến thể `student-*` nếu Badge được dùng ở Student UI trong tương lai)
4. `Card.tsx`/`Modal.tsx` — có thể để nguyên (P1/P2, không cấp thiết) trừ khi có kế hoạch dùng chúng cho Student UI
