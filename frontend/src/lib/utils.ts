export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Vài dòng dữ liệu nhập tay bị dán nhầm dạng markdown link "[url](url)" thay vì
// URL trần — khiến trình duyệt không nhận ra là URL tuyệt đối (ảnh/audio "chưa
// load được"). Bóc lại URL thật nếu phát hiện đúng khuôn dạng này.
export function cleanMediaUrl(url?: string | null): string {
  if (!url) return '';
  const match = url.match(/^\[(https?:\/\/[^\]]+)\]\(https?:\/\/[^)]+\)$/);
  return match ? match[1] : url;
}

// Chỉ phát audio SGK thu sẵn khi dạng bài thực sự có (amThanh) — không dùng giọng máy
// (TTS) đọc thay nữa, vì nghe khác hẳn giọng thật. Nút "Nghe đọc" chỉ nên hiện ở nơi
// gọi hàm này khi có audio thật (kiểm tra bằng hasRealAudio trước khi render nút).
export function hasRealAudio(amThanh?: string | null): boolean {
  return !!cleanMediaUrl(amThanh);
}

export function playRealAudio(amThanh?: string | null) {
  const url = cleanMediaUrl(amThanh);
  if (!url) return;
  new Audio(url).play().catch(() => {});
}
