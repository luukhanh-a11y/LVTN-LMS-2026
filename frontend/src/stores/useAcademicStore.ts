import { create } from 'zustand';

interface AcademicState {
  currentNamHoc: string;
  currentNamHocId: number | null;
  currentNgayBatDau: string | null;
  selectedNamHoc: string;
  selectedNamHocId: number | null;
  currentHocKyId: number | null;
  isReadOnly: boolean;
  setNamHoc: (namHoc: string, namHocId: number, ngayBatDau: string) => void;
  setCurrentNamHoc: (namHoc: string, namHocId: number, ngayBatDau: string) => void;
  setCurrentHocKy: (hocKyId: number) => void;
}

// Không persist ra localStorage — giá trị "năm học/học kỳ hiện tại" luôn phải lấy
// mới từ CauHinhHeThong mỗi phiên (xem AcademicYearSelector), tránh hiển thị lỗi
// theo dữ liệu cache cũ của trình duyệt (đã gặp bug này khi giá trị mặc định đổi).
export const useAcademicStore = create<AcademicState>()((set, get) => ({
  currentNamHoc: '',
  currentNamHocId: null,
  currentNgayBatDau: null,
  selectedNamHoc: '',
  selectedNamHocId: null,
  currentHocKyId: null,
  isReadOnly: false,
  setNamHoc: (namHoc, namHocId, ngayBatDau) => {
    const { currentNgayBatDau } = get();
    // Năm học có ngày bắt đầu TRƯỚC năm hiện tại của hệ thống mới bị khoá (chỉ xem).
    // Năm hiện tại hoặc năm tương lai (đang chuẩn bị) vẫn được sửa bình thường.
    const isReadOnly = !!currentNgayBatDau && new Date(ngayBatDau) < new Date(currentNgayBatDau);
    set({ selectedNamHoc: namHoc, selectedNamHocId: namHocId, isReadOnly });
  },
  setCurrentNamHoc: (namHoc, namHocId, ngayBatDau) => {
    set({
      currentNamHoc: namHoc,
      currentNamHocId: namHocId,
      currentNgayBatDau: ngayBatDau,
      selectedNamHoc: namHoc,
      selectedNamHocId: namHocId,
      isReadOnly: false
    });
  },
  setCurrentHocKy: (hocKyId) => set({ currentHocKyId: hocKyId })
}));
