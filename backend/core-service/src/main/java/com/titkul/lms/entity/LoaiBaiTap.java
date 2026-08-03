package com.titkul.lms.entity;

public enum LoaiBaiTap {
    TU_LUAN,
    H5P,
    TU_DO,
    CA_NHAN,  // Dữ liệu legacy từ DB - tương đương với bài tập cá nhân
    TRAC_NGHIEM // Bài tập bộ sách (dang_bai kiểu JSON_TEXT) - trắc nghiệm/nối cặp/điền khuyết, chấm server-side
}
