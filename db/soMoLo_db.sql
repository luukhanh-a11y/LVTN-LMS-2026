-- ============================================================
-- TITKUL LMS — MySQL 8.0+ Schema v4
-- 29 bảng | 3 triggers | 16 indexes
-- Thay đổi so với v2/v3:
--   + Xóa gamified_quiz, ket_qua_quiz (chỉ là giao diện FE)
--   + Xóa trigger trg_cong_xp_sau_quiz
--   + XP cộng qua bai_nop khi HS hoàn thành bài tập H5P
--   + Thay danh_muc_bai_hoc bằng 3 bảng mới:
--       sach          — metadata sách (bookEditors lưu JSON bán cấu trúc)
--       muc_luc_sach  — cây mục lục 2 cấp (Chủ đề → Bài), tự đệ quy
--       dang_bai      — nút lá phi cấu trúc (Khám phá/Hoạt động/Luyện tập)
--                       cau_hinh JSON cho dữ liệu bán cấu trúc linh hoạt
--   + hoc_lieu: bai_hoc_id → dang_bai_id (FK → dang_bai)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS LMS CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Lệnh quan trọng nhất để sửa lỗi #1046: Yêu cầu MySQL sử dụng database vừa tạo
USE LMS;

-- ── 1. NGƯỜI DÙNG ─────────────────────────────────────────
CREATE TABLE nguoi_dung (
    nguoi_dung_id       BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    ten_dang_nhap       VARCHAR(100)     NOT NULL,
    mat_khau_hash       VARCHAR(255)     NOT NULL,
    vai_tro             ENUM('ADMIN','GIAO_VIEN','HOC_SINH','PHU_HUYNH') NOT NULL,
    trang_thai          ENUM('ACTIVE','LOCKED','DISABLED') NOT NULL DEFAULT 'ACTIVE',
    email               VARCHAR(150)     NULL,
    so_dien_thoai       VARCHAR(15)      NULL,
    bat_buoc_doi_mk     TINYINT(1)       NOT NULL DEFAULT 0,
    lan_dang_nhap_cuoi  DATETIME         NULL,
    ngay_tao            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                         ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (nguoi_dung_id),
    UNIQUE KEY uk_ten_dang_nhap  (ten_dang_nhap),
    UNIQUE KEY uk_email          (email),
    UNIQUE KEY uk_so_dien_thoai  (so_dien_thoai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tài khoản xác thực dùng chung cho toàn bộ 4 vai trò';


-- ── 2. HỒ SƠ GIÁO VIÊN ────────────────────────────────────
CREATE TABLE ho_so_giao_vien (
    giao_vien_id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nguoi_dung_id   BIGINT UNSIGNED NOT NULL,
    ma_giao_vien    VARCHAR(30)     NOT NULL,
    ho_ten          VARCHAR(100)    NOT NULL,
    bo_mon          VARCHAR(100)    NULL,
    ngay_sinh       DATE            NULL,
    gioi_tinh       ENUM('NAM','NU','KHAC') NULL,
    PRIMARY KEY (giao_vien_id),
    UNIQUE KEY uk_nguoi_dung_gv (nguoi_dung_id),
    UNIQUE KEY uk_ma_giao_vien  (ma_giao_vien),
    CONSTRAINT fk_gv_nguoi_dung
        FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (nguoi_dung_id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Thông tin nhân sự giáo viên — 1-1 với nguoi_dung';
-- ── 2.1 NĂM HỌC ───────────────────────────────────────────
CREATE TABLE nam_hoc (
    nam_hoc_id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    ten_nam_hoc     VARCHAR(20)  NOT NULL COMMENT '"2024-2025", "2025-2026"',
    ngay_bat_dau    DATE         NULL,
    ngay_ket_thuc   DATE         NULL,
    PRIMARY KEY (nam_hoc_id),
    UNIQUE KEY uk_ten_nam (ten_nam_hoc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Danh mục Năm Học';

-- ── 2.2 HỌC KỲ ────────────────────────────────────────────
CREATE TABLE hoc_ky (
    hoc_ky_id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nam_hoc_id      INT UNSIGNED NOT NULL,
    so_hoc_ky       TINYINT UNSIGNED NOT NULL COMMENT '1, 2, 3 (Hè)',
    PRIMARY KEY (hoc_ky_id),
    UNIQUE KEY uk_nam_ky (nam_hoc_id, so_hoc_ky),
    CONSTRAINT fk_hk_nam FOREIGN KEY (nam_hoc_id) REFERENCES nam_hoc (nam_hoc_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Danh mục Học Kỳ, phụ thuộc Năm Học';


-- ── 3. LỚP HỌC ────────────────────────────────────────────
CREATE TABLE lop_hoc (
    lop_hoc_id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    ten_lop                 VARCHAR(20)      NOT NULL,
    khoi_lop                TINYINT UNSIGNED NOT NULL,
    nam_hoc_id              INT UNSIGNED     NOT NULL,
    giao_vien_chu_nhiem_id  BIGINT UNSIGNED  NULL,
    si_so_toi_da            TINYINT UNSIGNED NOT NULL DEFAULT 40,
    trang_thai              ENUM('ACTIVE','DONG_BANG') NOT NULL DEFAULT 'ACTIVE',
    PRIMARY KEY (lop_hoc_id),
    UNIQUE KEY uk_ten_khoi_nam (ten_lop, khoi_lop, nam_hoc_id),
    CONSTRAINT chk_khoi_lop CHECK (khoi_lop BETWEEN 1 AND 5),
    CONSTRAINT fk_lop_nam
        FOREIGN KEY (nam_hoc_id) REFERENCES nam_hoc (nam_hoc_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_lop_gvcn
        FOREIGN KEY (giao_vien_chu_nhiem_id) REFERENCES ho_so_giao_vien (giao_vien_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Đơn vị tổ chức học sinh theo khối và năm học';


-- ── 4. HỒ SƠ HỌC SINH ────────────────────────────────────
CREATE TABLE ho_so_hoc_sinh (
    hoc_sinh_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nguoi_dung_id   BIGINT UNSIGNED NOT NULL,
    ma_hoc_sinh     VARCHAR(30)     NOT NULL,
    ho_ten          VARCHAR(100)    NOT NULL,
    ngay_sinh       DATE            NULL,
    gioi_tinh       ENUM('NAM','NU','KHAC') NULL,
    lop_hoc_id      BIGINT UNSIGNED NULL,
    tong_xp         INT UNSIGNED    NOT NULL DEFAULT 0
                    COMMENT 'Tổng XP tích lũy — cộng qua trigger khi hoàn thành bài tập H5P',
    PRIMARY KEY (hoc_sinh_id),
    UNIQUE KEY uk_nguoi_dung_hs (nguoi_dung_id),
    UNIQUE KEY uk_ma_hoc_sinh   (ma_hoc_sinh),
    CONSTRAINT fk_hs_nguoi_dung
        FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (nguoi_dung_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_hs_lop
        FOREIGN KEY (lop_hoc_id) REFERENCES lop_hoc (lop_hoc_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Hồ sơ học sinh — ma_hoc_sinh có thể chỉnh sửa nếu cần số hóa';


-- ── 5. HỒ SƠ PHỤ HUYNH ───────────────────────────────────
CREATE TABLE ho_so_phu_huynh (
    phu_huynh_id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nguoi_dung_id           BIGINT UNSIGNED NOT NULL,
    ho_ten                  VARCHAR(100)    NOT NULL,
    email_nhan_thong_bao    VARCHAR(150)    NULL,
    PRIMARY KEY (phu_huynh_id),
    UNIQUE KEY uk_nguoi_dung_ph (nguoi_dung_id),
    CONSTRAINT fk_ph_nguoi_dung
        FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (nguoi_dung_id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Hồ sơ phụ huynh — 1-1 với nguoi_dung';


-- ── 6. LIÊN KẾT PHỤ HUYNH — HỌC SINH (N-N) ──────────────
CREATE TABLE phu_huynh_hoc_sinh (
    lien_ket_id     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    phu_huynh_id    BIGINT UNSIGNED NOT NULL,
    hoc_sinh_id     BIGINT UNSIGNED NOT NULL,
    quan_he         VARCHAR(30)     NULL
                    COMMENT 'Cha / Mẹ / Người giám hộ',
    ngay_lien_ket   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id),
    CONSTRAINT fk_ph_hs_phu_huynh FOREIGN KEY (phu_huynh_id)
        REFERENCES ho_so_phu_huynh (phu_huynh_id) ON DELETE CASCADE,
    CONSTRAINT fk_ph_hs_hoc_sinh FOREIGN KEY (hoc_sinh_id)
        REFERENCES ho_so_hoc_sinh (hoc_sinh_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='N-N: 1 phụ huynh nhiều con, 1 HS có thể nhiều người giám hộ';


-- ── DANH MỤC MÔN HỌC ─────────────────────────────────────
CREATE TABLE mon_hoc (
    mon_hoc_id      TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ten_mon         VARCHAR(100)     NOT NULL,
    ma_mon          VARCHAR(20)      NULL,
    mo_ta           TEXT             NULL,
    trang_thai      ENUM('ACTIVE','AN') NOT NULL DEFAULT 'ACTIVE',
    PRIMARY KEY (mon_hoc_id),
    UNIQUE KEY uk_ten_mon (ten_mon)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Danh mục môn học độc lập khối lớp (Toán, Tiếng Việt...)';


-- ── 1. BẢNG MỚI CỰC KỲ QUAN TRỌNG: PHÂN CÔNG GIẢNG DẠY ────────
-- Bảng này quyết định quyền hạn: GV được xem môn gì, giao bài cho lớp nào, xem điểm ai.
CREATE TABLE phan_cong_giang_day (
    phan_cong_id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    giao_vien_id    BIGINT UNSIGNED NOT NULL,
    lop_hoc_id      BIGINT UNSIGNED NOT NULL,
    mon_hoc_id      TINYINT UNSIGNED NOT NULL COMMENT 'FK → mon_hoc',
    hoc_ky_id       INT UNSIGNED     NOT NULL COMMENT 'Học kỳ phân công (thay cho nam_hoc + hoc_ky)',
    ngay_phan_cong  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (phan_cong_id),
    UNIQUE KEY uk_gv_lop_mon (giao_vien_id, lop_hoc_id, mon_hoc_id, hoc_ky_id),
    CONSTRAINT fk_pcgd_gv FOREIGN KEY (giao_vien_id) REFERENCES ho_so_giao_vien (giao_vien_id) ON DELETE CASCADE,
    CONSTRAINT fk_pcgd_lop FOREIGN KEY (lop_hoc_id) REFERENCES lop_hoc (lop_hoc_id) ON DELETE CASCADE,
    CONSTRAINT fk_pcgd_mon FOREIGN KEY (mon_hoc_id) REFERENCES mon_hoc (mon_hoc_id) ON DELETE RESTRICT,
    CONSTRAINT fk_pcgd_hk FOREIGN KEY (hoc_ky_id) REFERENCES hoc_ky (hoc_ky_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bảng cấp quyền: GV nào dạy lớp nào, môn gì trong học kỳ, năm học nào';


-- ── 7. CẤU HÌNH HỆ THỐNG (singleton) ────────────────────
CREATE TABLE cau_hinh_he_thong (
    cau_hinh_id         TINYINT UNSIGNED NOT NULL DEFAULT 1,
    ten_truong          VARCHAR(200)     NOT NULL,
    logo_url            VARCHAR(500)     NULL,
    dia_chi             TEXT             NULL,
    hotline             VARCHAR(20)      NULL,
    email_lien_he       VARCHAR(150)     NULL,
    hoc_ky_hien_tai_id  INT UNSIGNED     NOT NULL COMMENT 'Trỏ đến hoc_ky đang diễn ra',
    PRIMARY KEY (cau_hinh_id),
    CONSTRAINT chk_singleton CHECK (cau_hinh_id = 1),
    CONSTRAINT fk_cau_hinh_hk FOREIGN KEY (hoc_ky_hien_tai_id) REFERENCES hoc_ky (hoc_ky_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cấu hình toàn cục — singleton (ID luôn = 1)';


-- ── 8. LÔ NHẬP LIỆU EXCEL ────────────────────────────────
CREATE TABLE lo_import (
    lo_id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nguoi_thuc_hien_id  BIGINT UNSIGNED NOT NULL,
    loai_import         ENUM('TAI_KHOAN','PHAN_LOP') NOT NULL,
    ten_file            VARCHAR(255)    NOT NULL,
    trang_thai          ENUM('DANG_XU_LY','THANH_CONG','CO_LOI')
                        NOT NULL DEFAULT 'DANG_XU_LY',
    so_thanh_cong       INT UNSIGNED    NULL,
    chi_tiet_loi        JSON            NULL,
    tom_tat_ket_qua     JSON            NULL,
    thoi_diem_import    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (lo_id),
    CONSTRAINT fk_import_admin
        FOREIGN KEY (nguoi_thuc_hien_id) REFERENCES nguoi_dung (nguoi_dung_id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Lịch sử import Excel — nguyên tắc All-or-Nothing';


-- ══════════════════════════════════════════════════════════
-- NHÓM SÁCH GIÁO KHOA — CẤU TRÚC BÁN CẤU TRÚC
-- Phân cấp: sach → muc_luc_sach (Chủ đề → Bài) → dang_bai (Khám phá / Hoạt động / Luyện tập)
-- Ánh xạ trực tiếp từ JSON API: bookId → bookIndexs → bookIndexChilds (cấp lá)
-- ══════════════════════════════════════════════════════════

-- ── 9. SÁCH [thay danh_muc_bai_hoc] ─────────────────────
-- Metadata đầu sách, ánh xạ 1-1 với bookId từ API ngoài
-- ban_bien_soan lưu bookEditors dạng JSON bán cấu trúc
CREATE TABLE sach (
    sach_id             INT UNSIGNED    NOT NULL AUTO_INCREMENT,

    -- Định danh gốc từ API ngoài (không FK vì cross-service)
    book_id_ngoai       INT UNSIGNED    NULL
                        COMMENT 'bookId từ API NXB — dùng để import/sync, không FK',

    -- Phân loại
    loai_sach           ENUM('SACH_GIAO_KHOA', 'SACH_BAI_TAP') NOT NULL DEFAULT 'SACH_GIAO_KHOA'
                        COMMENT 'GIAO_KHOA = HS tự học; BAI_TAP = Kho đề cho GV chọn giao bài',
    bo_sach             VARCHAR(150)    NOT NULL
                        COMMENT 'bookTypeName: "Kết nối tri thức với cuộc sống"',
    khoi_lop            TINYINT UNSIGNED NOT NULL
                        COMMENT 'classId: 1→Lớp 1 ... 12→Lớp 12',
    mon_hoc_id          TINYINT UNSIGNED NOT NULL
                        COMMENT 'FK → mon_hoc',
    hoc_ky              TINYINT UNSIGNED NULL
                        COMMENT '1, 2 hoặc NULL nếu cả năm học',

    -- Thông tin sách
    ten_sach            VARCHAR(300)    NOT NULL
                        COMMENT 'name: "Toán 1 - Tập một"',
    slug                VARCHAR(300)    NULL
                        COMMENT 'slug từ API: "toan-1-tap-mot"',
    mo_ta               TEXT            NULL
                        COMMENT 'description từ API',
    anh_bia_url         VARCHAR(500)    NULL
                        COMMENT 'imageUrl: đường dẫn ảnh bìa',
    tong_so_trang       SMALLINT UNSIGNED NULL
                        COMMENT 'totalPage: tổng số trang sách',
    nam_xuat_ban        YEAR            NULL
                        COMMENT 'manufactureYear',
    ban_quyen           VARCHAR(200)    NULL
                        COMMENT 'copyRight: "Nhà xuất bản..."',

    -- Danh sách tác giả/ban biên soạn lưu JSON bán cấu trúc
    -- Phản ánh trực tiếp mảng bookEditors từ API
    -- VD: [{"name":"Hà Huy Khoái","title":"Tổng Chủ biên","orderNo":0},...]
    ban_bien_soan       JSON            NULL
                        COMMENT 'bookEditors[]: [{name, title, orderNo}] — bán cấu trúc',

    trang_thai          ENUM('ACTIVE','AN') NOT NULL DEFAULT 'ACTIVE',
    ngay_tao            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (sach_id),
    UNIQUE KEY uk_book_id_ngoai (book_id_ngoai),
    CONSTRAINT chk_sach_khoi_lop CHECK (khoi_lop BETWEEN 1 AND 12),
    CONSTRAINT chk_sach_hoc_ky   CHECK (hoc_ky IS NULL OR hoc_ky BETWEEN 1 AND 3),
    CONSTRAINT fk_sach_mon FOREIGN KEY (mon_hoc_id) REFERENCES mon_hoc (mon_hoc_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Metadata sách giáo khoa — ánh xạ với bookId API, ban_bien_soan lưu JSON bán cấu trúc';


-- ── 10. CHỦ ĐỀ SÁCH (Cấp 2) ──────────────────────────────
-- Cấp 2: Chủ đề / Chương (bookIndexs, parentId=0 trong API)
CREATE TABLE chu_de (
    chu_de_id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    sach_id             INT UNSIGNED    NOT NULL
                        COMMENT 'FK → sach (cấp 1)',

    -- Định danh gốc từ API
    book_index_id_ngoai INT UNSIGNED    NULL
                        COMMENT 'bookIndexId từ API — dùng để import/sync',

    -- Nội dung chủ đề
    ten_chu_de          VARCHAR(300)    NOT NULL
                        COMMENT 'name: "Các số từ 0 đến 10"',
    tieu_de             VARCHAR(100)    NULL
                        COMMENT 'title: "Chủ đề 1"',
    slug                VARCHAR(300)    NULL
                        COMMENT 'slug: "cac-so-tu-0-den-10"',
    so_trang            SMALLINT UNSIGNED NULL
                        COMMENT 'pageNo: số trang bắt đầu trong sách',
    so_thu_tu           SMALLINT UNSIGNED NOT NULL DEFAULT 0
                        COMMENT 'orderNo: thứ tự hiển thị trong sách',

    ngay_tao            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (chu_de_id),
    CONSTRAINT fk_chu_de_sach
        FOREIGN KEY (sach_id) REFERENCES sach (sach_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Chủ đề / Chương (Cấp 2) của sách';


-- ── 10.1 BÀI HỌC (Cấp 3) ──────────────────────────────────
-- Cấp 3: Bài học cụ thể (bookIndexChilds có title "Bài X")
CREATE TABLE bai_hoc (
    bai_hoc_id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    chu_de_id           INT UNSIGNED    NOT NULL
                        COMMENT 'FK → chu_de (cấp 2)',

    -- Định danh gốc từ API
    book_index_id_ngoai INT UNSIGNED    NULL
                        COMMENT 'bookIndexId từ API — dùng để import/sync',

    -- Nội dung bài học
    ten_bai_hoc         VARCHAR(300)    NOT NULL
                        COMMENT 'name: "Các số 0, 1, 2, 3, 4, 5"',
    tieu_de             VARCHAR(100)    NULL
                        COMMENT 'title: "Bài 1"',
    slug                VARCHAR(300)    NULL
                        COMMENT 'slug: "cac-so-0-1-2-3-4-5"',
    so_trang            SMALLINT UNSIGNED NULL
                        COMMENT 'pageNo: số trang bắt đầu trong sách',
    so_thu_tu           SMALLINT UNSIGNED NOT NULL DEFAULT 0
                        COMMENT 'orderNo: thứ tự hiển thị trong chủ đề',

    ngay_tao            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (bai_hoc_id),
    CONSTRAINT fk_bai_hoc_chu_de
        FOREIGN KEY (chu_de_id) REFERENCES chu_de (chu_de_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bài học cụ thể (Cấp 3). Chứa các dạng bài tập/lý thuyết ở cấp lá';


-- ── 11. DẠNG BÀI (nút lá phi cấu trúc) ──────────────────
-- Lưu các dạng bài ở cấp lá sâu nhất (bookIndexChilds = null trong API)
-- Ví dụ: "Khám phá", "Hoạt động", "Luyện tập" bên trong 1 Bài cụ thể
-- Cột cau_hinh JSON = trung tâm của thiết kế BÁN CẤU TRÚC:
--   - Mỗi dạng bài có thể lưu cấu hình riêng không cố định schema
--   - VD Khám phá: {"loai":"doc_hinh", "huong_dan":"Quan sát tranh và nhận xét"}
--   - VD Hoạt động: {"loai":"nhom", "so_thanh_vien":4, "thoi_gian_phut":10}
--   - VD Luyện tập: {"loai":"viet", "so_bai":3, "muc_do":"co_ban"}
CREATE TABLE dang_bai (
    dang_bai_id         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    bai_hoc_id          INT UNSIGNED    NOT NULL
                        COMMENT 'FK → bai_hoc (cấp Bài học — cấp 3)',

    -- Định danh gốc từ API
    book_index_id_ngoai INT UNSIGNED    NULL
                        COMMENT 'bookIndexId từ API khi import',

    -- Thông tin dạng bài
    ten_dang_bai        VARCHAR(200)    NOT NULL
                        COMMENT 'name: "Khám phá", "Hoạt động", "Luyện tập"',
    slug                VARCHAR(200)    NULL
                        COMMENT 'slug: "kham-pha", "hoat-dong", "luyen-tap"',
    so_trang            SMALLINT UNSIGNED NULL
                        COMMENT 'pageNo: trang bắt đầu của dạng bài trong sách',
    so_thu_tu           SMALLINT UNSIGNED NOT NULL DEFAULT 0
                        COMMENT 'orderNo: thứ tự trong bài',

    -- Phân loại & Nguồn gốc (Gánh vác vai trò của hoc_lieu cũ)
    mon_hoc_id          TINYINT UNSIGNED NOT NULL COMMENT 'FK → mon_hoc',
    loai_noi_dung       ENUM('H5P','FILE','NATIVE','JSON_TEXT') NOT NULL DEFAULT 'JSON_TEXT'
                        COMMENT 'Cách React render. JSON_TEXT là mặc định cho sách gốc',
    nguon_goc           ENUM('HE_THONG','GIAO_VIEN_BO_SUNG') NOT NULL DEFAULT 'HE_THONG',
    giao_vien_id        BIGINT UNSIGNED NULL COMMENT 'NULL nếu của HE_THONG',
    h5p_noi_dung_id     CHAR(36)        NULL COMMENT 'UUID cross-service → LMS_H5P.h5p_noi_dung',
    xp_thuong           SMALLINT UNSIGNED NOT NULL DEFAULT 0,

    -- Dữ liệu BÁN CẤU TRÚC — linh hoạt theo từng loại dạng bài
    cau_hinh            JSON            NULL
                        COMMENT 'Lưu mọi dữ liệu tùy biến: file_url, text bài đọc, đáp án, props...',

    ngay_tao            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (dang_bai_id),
    CONSTRAINT fk_db_bai_hoc
        FOREIGN KEY (bai_hoc_id) REFERENCES bai_hoc (bai_hoc_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_db_mon FOREIGN KEY (mon_hoc_id) REFERENCES mon_hoc (mon_hoc_id) ON DELETE RESTRICT,
    CONSTRAINT fk_db_gv FOREIGN KEY (giao_vien_id) REFERENCES ho_so_giao_vien (giao_vien_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Dạng bài kiêm nội dung học (đa hình qua cau_hinh JSON). GV có thể thêm bài bổ sung.';


-- (Bảng hoc_lieu đã được sáp nhập hoàn toàn vào dang_bai)

-- ── 12. PHÂN PHỐI BÀI HỌC ───────────────────────────────
CREATE TABLE phan_phoi_dang_bai (
    phan_phoi_id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    dang_bai_id     INT UNSIGNED    NOT NULL,
    lop_hoc_id      BIGINT UNSIGNED NOT NULL,
    giao_vien_id    BIGINT UNSIGNED NOT NULL,
    ngay_chia_se    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (phan_phoi_id),
    UNIQUE KEY uk_db_lop (dang_bai_id, lop_hoc_id),
    CONSTRAINT fk_pp_dang_bai
        FOREIGN KEY (dang_bai_id) REFERENCES dang_bai (dang_bai_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pp_lop
        FOREIGN KEY (lop_hoc_id) REFERENCES lop_hoc (lop_hoc_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pp_giao_vien
        FOREIGN KEY (giao_vien_id) REFERENCES ho_so_giao_vien (giao_vien_id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='GV chia sẻ bài bổ sung cho lớp — cơ chế cấp quyền xem cho HS';


-- ── 14. BÀI TẬP ──────────────────────────────────────────
CREATE TABLE bai_tap (
    bai_tap_id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    giao_vien_id        BIGINT UNSIGNED NOT NULL,
    lop_hoc_id          BIGINT UNSIGNED NOT NULL,

    bai_hoc_id          INT UNSIGNED NULL
                        COMMENT 'Khác NULL nếu GV giao cả cụm Bài học (giao hết các dang_bai bên trong)',
    dang_bai_id         INT UNSIGNED NULL
                        COMMENT 'Khác NULL nếu GV giao từng Dạng bài lẻ',

    -- Bối cảnh học thuật — ghi tại thời điểm GV giao bài
    -- hoc_ky_id PHẢI lưu trực tiếp vì: 1 lớp học cả năm, GV giao bài ở HK1 ≠ HK2 dù cùng lop_hoc_id
    hoc_ky_id           INT UNSIGNED     NOT NULL
                        COMMENT 'Học kỳ GV giao bài (snapshot tại thời điểm tạo)',

    tieu_de             VARCHAR(300)    NOT NULL,
    mo_ta               TEXT            NULL,
    loai_bai_tap        ENUM('TU_LUAN','H5P','TU_DO') NOT NULL,
    thoi_diem_bat_dau   DATETIME        NULL
                        COMMENT 'NULL = đăng ngay. Có giá trị = lên lịch tự động',
    deadline            DATETIME        NOT NULL,
    cho_nop_lai           TINYINT(1)       NOT NULL DEFAULT 0
                          COMMENT 'Cho phép nộp lại sau khi GV yêu cầu làm lại (YC_LAM_LAI)',
    so_lan_nop_lai_toi_da TINYINT UNSIGNED NOT NULL DEFAULT 1
                          COMMENT 'Số lần được phép nộp lại tối đa — chỉ có hiệu lực khi cho_nop_lai = 1',
    trang_thai            ENUM('CHO_DANG','DANG_MO','DA_DONG')
                          NOT NULL DEFAULT 'CHO_DANG',
    ngay_tao              DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bai_tap_id),
    -- Nếu cho_nop_lai = 0 thì so_lan_nop_lai_toi_da phải = 0 (vô hiệu hóa)
    -- Nếu cho_nop_lai = 1 thì tối thiểu 1 lần, tối đa 10 lần
    CONSTRAINT chk_nop_lai CHECK (
        (cho_nop_lai = 0 AND so_lan_nop_lai_toi_da = 0)
        OR (cho_nop_lai = 1 AND so_lan_nop_lai_toi_da BETWEEN 1 AND 10)
    ),
    -- chk_pham_vi_giao đã chuyển sang TRIGGER (MySQL 8.0 #3823: cột FK SET NULL
    -- không được dùng trong CHECK constraint)
    CONSTRAINT fk_bt_hk FOREIGN KEY (hoc_ky_id) REFERENCES hoc_ky (hoc_ky_id) ON DELETE RESTRICT,
    CONSTRAINT fk_bt_giao_vien
        FOREIGN KEY (giao_vien_id) REFERENCES ho_so_giao_vien (giao_vien_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_bt_lop
        FOREIGN KEY (lop_hoc_id) REFERENCES lop_hoc (lop_hoc_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_bt_bai_hoc
        FOREIGN KEY (bai_hoc_id) REFERENCES bai_hoc (bai_hoc_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_bt_dang_bai
        FOREIGN KEY (dang_bai_id) REFERENCES dang_bai (dang_bai_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Lệnh giao việc của GV — hoc_ky lưu tại thời điểm tạo; nam_hoc lấy qua JOIN lop_hoc';

-- Trigger thay thế chk_pham_vi_giao: chỉ một trong hai (bai_hoc_id / dang_bai_id) được khác NULL
-- Lý do dùng trigger thay CHECK: MySQL 8.0 #3823 cấm CHECK trên cột FK có ON DELETE SET NULL
DELIMITER //
CREATE TRIGGER trg_bai_tap_pham_vi_insert
BEFORE INSERT ON bai_tap
FOR EACH ROW
BEGIN
    IF NEW.bai_hoc_id IS NOT NULL AND NEW.dang_bai_id IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'bai_tap: bai_hoc_id và dang_bai_id không được cùng khác NULL.';
    END IF;
END //

CREATE TRIGGER trg_bai_tap_pham_vi_update
BEFORE UPDATE ON bai_tap
FOR EACH ROW
BEGIN
    IF NEW.bai_hoc_id IS NOT NULL AND NEW.dang_bai_id IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'bai_tap: bai_hoc_id và dang_bai_id không được cùng khác NULL.';
    END IF;
END //
DELIMITER ;


-- ── 15. BÀI NỘP ─────────────────────────────────────────
CREATE TABLE bai_nop (
    bai_nop_id      BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    bai_tap_id      BIGINT UNSIGNED  NOT NULL,
    hoc_sinh_id     BIGINT UNSIGNED  NOT NULL,
    dang_bai_id     INT UNSIGNED     NULL
                    COMMENT 'Học sinh đang nộp cho Dạng bài nào (quan trọng khi giao theo cụm bài học)',

    -- Dành cho bài nộp thủ công (tự luận)
    noi_dung_text   TEXT             NULL,
    file_dinh_kem   VARCHAR(500)     NULL,

    -- Dành cho hệ thống tự chấm (H5P / Native Component)
    diem_tu_dong    DECIMAL(5,2)     NULL,
    xp_nhan_duoc    SMALLINT UNSIGNED NOT NULL DEFAULT 0,

    -- Lịch sử tương tác (lưu trạng thái người dùng: kéo thả, câu sai...)
    chi_tiet_bai_lam JSON            NULL
                    COMMENT 'Mảng đáp án HS đã chọn để review sau này',

    -- Metadata tiến trình
    so_lan_lam      TINYINT UNSIGNED NOT NULL DEFAULT 1,
    trang_thai      ENUM('CHUA_NOP','DA_NOP','NOP_TRE','YC_LAM_LAI','DA_CHAM')
                    NOT NULL DEFAULT 'CHUA_NOP',
    la_nop_tre      TINYINT(1)       NOT NULL DEFAULT 0,
    thoi_diem_nop   DATETIME         NULL,

    PRIMARY KEY (bai_nop_id),
    UNIQUE KEY uk_baitap_hs_dangbai_lan (bai_tap_id, hoc_sinh_id, dang_bai_id, so_lan_lam),
    CONSTRAINT fk_bn_bai_tap
        FOREIGN KEY (bai_tap_id) REFERENCES bai_tap (bai_tap_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_bn_hoc_sinh
        FOREIGN KEY (hoc_sinh_id) REFERENCES ho_so_hoc_sinh (hoc_sinh_id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bài nộp của HS — nam_hoc: JOIN bai_tap→lop_hoc; hoc_ky: JOIN bai_tap.hoc_ky';
-- Trigger cộng XP vào hồ sơ HS khi có bài nộp H5P/Quiz hoàn thành
DELIMITER //
CREATE TRIGGER trg_cong_xp_khi_nop_bai
AFTER INSERT ON bai_nop
FOR EACH ROW
BEGIN
    IF NEW.xp_nhan_duoc > 0 THEN
        UPDATE ho_so_hoc_sinh
        SET tong_xp = tong_xp + NEW.xp_nhan_duoc
        WHERE hoc_sinh_id = NEW.hoc_sinh_id;
    END IF;
END //
DELIMITER ;


-- ── 16. ĐÁNH GIÁ BÀI LÀM ────────────────────────────────
CREATE TABLE danh_gia_bai_lam (
    danh_gia_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    bai_nop_id      BIGINT UNSIGNED NOT NULL,
    giao_vien_id    BIGINT UNSIGNED NOT NULL,
    diem_so         DECIMAL(4,1)    NULL,
    xep_loai        ENUM('HOAN_THANH_TOT','HOAN_THANH','CHUA_HOAN_THANH') NULL,
    nhan_xet        TEXT            NULL,
    hanh_dong       ENUM('DUYET','YC_LAM_LAI') NOT NULL DEFAULT 'DUYET',
    thoi_diem_cham  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (danh_gia_id),
    UNIQUE KEY uk_bai_nop (bai_nop_id),
    CONSTRAINT chk_diem CHECK (diem_so IS NULL OR diem_so BETWEEN 0 AND 10),
    CONSTRAINT fk_dg_bai_nop
        FOREIGN KEY (bai_nop_id) REFERENCES bai_nop (bai_nop_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_dg_giao_vien
        FOREIGN KEY (giao_vien_id) REFERENCES ho_so_giao_vien (giao_vien_id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Điểm số + nhận xét GV (1-1 với bai_nop) — theo TT27/2020';

-- Trigger cập nhật trạng thái bai_nop khi GV lưu đánh giá
DELIMITER //
CREATE TRIGGER trg_cap_nhat_trang_thai_bai_nop
AFTER INSERT ON danh_gia_bai_lam
FOR EACH ROW
BEGIN
    IF NEW.hanh_dong = 'DUYET' THEN
        UPDATE bai_nop SET trang_thai = 'DA_CHAM'
        WHERE bai_nop_id = NEW.bai_nop_id;
    ELSEIF NEW.hanh_dong = 'YC_LAM_LAI' THEN
        UPDATE bai_nop SET trang_thai = 'YC_LAM_LAI'
        WHERE bai_nop_id = NEW.bai_nop_id;
    END IF;
END //
DELIMITER ;


-- ── 17. GỢI Ý AI NHẬN XÉT ────────────────────────────────
CREATE TABLE goi_y_ai_nhan_xet (
    goi_y_id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    bai_nop_id      BIGINT UNSIGNED NOT NULL,
    du_lieu_dau_vao JSON            NOT NULL
                    COMMENT 'Ngữ cảnh gửi vào AI: điểm, lịch sử 4 tuần, chuẩn sách',
    ket_qua_goi_y   JSON            NULL
                    COMMENT 'Mảng 2-3 câu gợi ý AI trả về',
    trang_thai      ENUM('NHAP','DA_CHON','BI_BO_QUA') NOT NULL DEFAULT 'NHAP',
    thoi_diem_goi   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (goi_y_id),
    CONSTRAINT fk_ai_nxet_bai_nop
        FOREIGN KEY (bai_nop_id) REFERENCES bai_nop (bai_nop_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Gợi ý nhận xét từ Anthropic API — AI gợi ý, GV quyết định';


-- ── 18. BÁO CÁO AI BUỔI SÁNG ─────────────────────────────
CREATE TABLE bao_cao_ai_buoi_sang (
    bao_cao_id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    giao_vien_id        BIGINT UNSIGNED NOT NULL,
    lop_hoc_id          BIGINT UNSIGNED NOT NULL,
    ngay_bao_cao        DATE            NOT NULL,
    noi_dung_tom_tat    TEXT            NOT NULL,
    du_lieu_phan_tich   JSON            NULL,
    thoi_diem_tao       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bao_cao_id),
    UNIQUE KEY uk_gv_lop_ngay (giao_vien_id, lop_hoc_id, ngay_bao_cao),
    CONSTRAINT fk_bcai_gv
        FOREIGN KEY (giao_vien_id) REFERENCES ho_so_giao_vien (giao_vien_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_bcai_lop
        FOREIGN KEY (lop_hoc_id) REFERENCES lop_hoc (lop_hoc_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cache tóm tắt AI buổi sáng — UNIQUE(GV,lớp,ngày) tránh gọi API lặp';


-- ── 19. HUY HIỆU ──────────────────────────────────────────
CREATE TABLE huy_hieu (
    huy_hieu_id     INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    ten_huy_hieu    VARCHAR(100)    NOT NULL,
    mo_ta           TEXT            NULL,
    icon_url        VARCHAR(500)    NULL,
    loai            ENUM('THU_CONG','TU_DONG') NOT NULL,
    dieu_kien       JSON            NULL
                    COMMENT 'Điều kiện mở khóa tự động (NULL nếu loai=THU_CONG)',
    PRIMARY KEY (huy_hieu_id),
    UNIQUE KEY uk_ten_huy_hieu (ten_huy_hieu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Danh mục huy hiệu — thủ công (GV gửi) hoặc tự động (rule-based)';


-- ── 20. KHEN THƯỞNG HỌC SINH ─────────────────────────────
CREATE TABLE khen_thuong_hoc_sinh (
    khen_thuong_id  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hoc_sinh_id     BIGINT UNSIGNED NOT NULL,
    huy_hieu_id     INT UNSIGNED    NOT NULL,
    giao_vien_id    BIGINT UNSIGNED NULL
                    COMMENT 'NULL nếu hệ thống tự động cấp',
    thu_khen        TEXT            NULL,
    nguon_cap       ENUM('THU_CONG','HE_THONG') NOT NULL DEFAULT 'THU_CONG',
    thoi_diem_trao  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    da_gui_email    TINYINT(1)      NOT NULL DEFAULT 0,
    PRIMARY KEY (khen_thuong_id),
    CONSTRAINT fk_kt_hoc_sinh
        FOREIGN KEY (hoc_sinh_id) REFERENCES ho_so_hoc_sinh (hoc_sinh_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_kt_huy_hieu
        FOREIGN KEY (huy_hieu_id) REFERENCES huy_hieu (huy_hieu_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_kt_giao_vien
        FOREIGN KEY (giao_vien_id) REFERENCES ho_so_giao_vien (giao_vien_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Lịch sử cấp huy hiệu cho học sinh';


-- ── 21. THÔNG BÁO ─────────────────────────────────────────
CREATE TABLE thong_bao (
    thong_bao_id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nguoi_gui_id    BIGINT UNSIGNED NOT NULL,
    lop_hoc_id      BIGINT UNSIGNED NULL
                    COMMENT 'NULL nếu là thông báo hệ thống toàn trường',
    tieu_de         VARCHAR(300)    NOT NULL,
    noi_dung        TEXT            NULL,
    file_dinh_kem   VARCHAR(500)    NULL,
    loai_thong_bao  ENUM('NOI_BO','KHEN_THUONG','HE_THONG')
                    NOT NULL DEFAULT 'NOI_BO',
    la_ghim         TINYINT(1)      NOT NULL DEFAULT 0,
    ngay_dang       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (thong_bao_id),
    CONSTRAINT fk_tb_nguoi_gui
        FOREIGN KEY (nguoi_gui_id) REFERENCES nguoi_dung (nguoi_dung_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_tb_lop
        FOREIGN KEY (lop_hoc_id) REFERENCES lop_hoc (lop_hoc_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Thông báo nội bộ lớp và thông báo hệ thống';


-- ── 22. TRẠNG THÁI ĐỌC THÔNG BÁO ────────────────────────
CREATE TABLE trang_thai_doc_thong_bao (
    trang_thai_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nguoi_dung_id   BIGINT UNSIGNED NOT NULL,
    thong_bao_id    BIGINT UNSIGNED NOT NULL,
    da_doc          TINYINT(1)      NOT NULL DEFAULT 0,
    thoi_diem_doc   DATETIME        NULL,
    UNIQUE KEY uk_trang_thai_doc_thong_bao (nguoi_dung_id, thong_bao_id),
    CONSTRAINT fk_ttd_nd
        FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (nguoi_dung_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ttd_tb
        FOREIGN KEY (thong_bao_id) REFERENCES thong_bao (thong_bao_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Trạng thái đọc độc lập cho từng người — HS xem không ảnh hưởng PH';


-- ── 23. TIẾN ĐỘ HỌC SINH ─────────────────────────────────
CREATE TABLE tien_do_hoc_sinh (
    tien_do_id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    hoc_sinh_id             BIGINT UNSIGNED  NOT NULL,
    dang_bai_id             INT UNSIGNED     NOT NULL,

    -- Bối cảnh học thuật — snapshot tại thời điểm bắt đầu học
    -- hoc_ky_id lưu trực tiếp vì HS có thể chuyển lớp giữa năm
    hoc_ky_id               INT UNSIGNED     NOT NULL
                            COMMENT 'Học kỳ (snapshot khi bắt đầu học)',

    phan_tram_hoan_thanh    TINYINT UNSIGNED NOT NULL DEFAULT 0,
    thoi_gian_hoc           INT UNSIGNED     NOT NULL DEFAULT 0
                            COMMENT 'Tổng giây đã học trong kỳ này',
    lan_xem_cuoi            DATETIME         NULL,
    da_hoan_thanh           TINYINT(1)       NOT NULL DEFAULT 0,
    PRIMARY KEY (tien_do_id),
    -- UNIQUE theo (HS, dạng bài, học kỳ) — không ghi đè kỳ cũ
    UNIQUE KEY uk_hs_dangbai_ky (hoc_sinh_id, dang_bai_id, hoc_ky_id),
    CONSTRAINT chk_phan_tram  CHECK (phan_tram_hoan_thanh BETWEEN 0 AND 100),
    CONSTRAINT fk_td_hk FOREIGN KEY (hoc_ky_id) REFERENCES hoc_ky (hoc_ky_id) ON DELETE RESTRICT,
    CONSTRAINT fk_td_hs
        FOREIGN KEY (hoc_sinh_id) REFERENCES ho_so_hoc_sinh (hoc_sinh_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_td_db
        FOREIGN KEY (dang_bai_id) REFERENCES dang_bai (dang_bai_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tiến độ dạng bài theo năm học + học kỳ — tránh ghi đè khi học lại; đầu vào AI';


-- ── 24. PHIÊN XÁC THỰC OTP ───────────────────────────────
CREATE TABLE phien_xac_thuc (
    phien_id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nguoi_dung_id   BIGINT UNSIGNED NOT NULL,
    loai_xac_thuc   ENUM('DOI_MAT_KHAU','QUEN_MAT_KHAU') NOT NULL,
    ma_otp          VARCHAR(10)     NULL,
    het_han         DATETIME        NOT NULL,
    da_su_dung      TINYINT(1)      NOT NULL DEFAULT 0,
    thoi_diem_tao   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (phien_id),
    CONSTRAINT fk_otp_nd
        FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (nguoi_dung_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Mã OTP đổi/quên mật khẩu — hiệu lực 1 phút, dùng 1 lần';


-- ── 25. PHIẾU HỖ TRỢ RESET MẬT KHẨU ────────────────────
CREATE TABLE phieu_ho_tro (
    phieu_id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    giao_vien_tao_id        BIGINT UNSIGNED NOT NULL,
    hoc_sinh_lien_quan_id   BIGINT UNSIGNED NOT NULL,
    loai_yeu_cau            VARCHAR(100)    NOT NULL DEFAULT 'RESET_MAT_KHAU',
    mo_ta                   TEXT            NULL,
    admin_xu_ly_id          BIGINT UNSIGNED NULL,
    trang_thai              ENUM('CHO_DUYET','DA_DUYET','TU_CHOI')
                            NOT NULL DEFAULT 'CHO_DUYET',
    ghi_chu_xu_ly           TEXT            NULL,
    ngay_tao                DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_xu_ly              DATETIME        NULL,
    PRIMARY KEY (phieu_id),
    CONSTRAINT fk_phieu_gv
        FOREIGN KEY (giao_vien_tao_id) REFERENCES ho_so_giao_vien (giao_vien_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_phieu_hs
        FOREIGN KEY (hoc_sinh_lien_quan_id) REFERENCES ho_so_hoc_sinh (hoc_sinh_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_phieu_admin
        FOREIGN KEY (admin_xu_ly_id) REFERENCES nguoi_dung (nguoi_dung_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Phiếu reset MK: GV tạo → Admin duyệt → trigger bật bat_buoc_doi_mk';

DELIMITER //
CREATE TRIGGER trg_duyet_phieu_reset_mk
BEFORE UPDATE ON phieu_ho_tro  -- Đổi sang BEFORE để dùng SET NEW.* trực tiếp
FOR EACH ROW
BEGIN
    IF OLD.trang_thai = 'CHO_DUYET' AND NEW.trang_thai = 'DA_DUYET' THEN
        -- Bật cờ bắt buộc đổi mật khẩu cho học sinh liên quan
        UPDATE nguoi_dung nd
        INNER JOIN ho_so_hoc_sinh hs ON nd.nguoi_dung_id = hs.nguoi_dung_id
        SET nd.bat_buoc_doi_mk = 1
        WHERE hs.hoc_sinh_id = NEW.hoc_sinh_lien_quan_id;

        -- Ghi thời điểm xử lý trực tiếp qua NEW (tránh lỗi self-UPDATE)
        SET NEW.ngay_xu_ly = NOW();
    END IF;
END //
DELIMITER ;


-- ── 26. LỊCH SỬ CHUYỂN LỚP ───────────────────────────────
CREATE TABLE lich_su_chuyen_lop (
    chuyen_lop_id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hoc_sinh_id         BIGINT UNSIGNED NOT NULL,
    lop_cu_id           BIGINT UNSIGNED NULL
                        COMMENT 'NULL nếu là lần gán lớp đầu tiên',
    lop_moi_id          BIGINT UNSIGNED NOT NULL,
    nam_hoc_cu          VARCHAR(10)     NULL,
    nam_hoc_moi         VARCHAR(10)     NOT NULL,
    ly_do               ENUM('LEN_LOP','O_LAI','CHUYEN_TRUONG',
                             'DOI_LOP','NHAP_HOC_MOI') NOT NULL,
    ghi_chu             TEXT            NULL,
    nguoi_thuc_hien_id  BIGINT UNSIGNED NOT NULL,
    thoi_diem_chuyen    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chuyen_lop_id),
    CONSTRAINT fk_cls_hs
        FOREIGN KEY (hoc_sinh_id) REFERENCES ho_so_hoc_sinh (hoc_sinh_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_cls_lop_cu
        FOREIGN KEY (lop_cu_id) REFERENCES lop_hoc (lop_hoc_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_cls_lop_moi
        FOREIGN KEY (lop_moi_id) REFERENCES lop_hoc (lop_hoc_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_cls_nguoi_th
        FOREIGN KEY (nguoi_thuc_hien_id) REFERENCES nguoi_dung (nguoi_dung_id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Lịch sử chuyển lớp: lên lớp, ở lại, chuyển trường, đổi lớp giữa năm';


-- ── 27. KẾT QUẢ CUỐI NĂM / XÉT LÊN LỚP ────────────────
CREATE TABLE ket_qua_cuoi_nam (
    ket_qua_id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hoc_sinh_id         BIGINT UNSIGNED NOT NULL,
    lop_hoc_id          BIGINT UNSIGNED NOT NULL,
    nam_hoc             VARCHAR(10)     NOT NULL,
    ket_qua_hoc_tap     ENUM('HOAN_THANH_TOT','HOAN_THANH','CHUA_HOAN_THANH') NOT NULL,
    ket_qua_ren_luyen   ENUM('TOT','DAT','CAN_CO_GANG') NOT NULL,
    quyet_dinh          ENUM('LEN_LOP','O_LAI','CHUYEN_CUP') NOT NULL,
    duoc_xet_dac_cach   TINYINT(1)      NOT NULL DEFAULT 0,
    ly_do_dac_cach      TEXT            NULL,
    giao_vien_xet_id    BIGINT UNSIGNED NOT NULL,
    ngay_xet            DATE            NOT NULL,
    ghi_chu             TEXT            NULL,
    PRIMARY KEY (ket_qua_id),
    UNIQUE KEY uk_hs_lop_nam (hoc_sinh_id, lop_hoc_id, nam_hoc),
    CONSTRAINT fk_kqcn_hs
        FOREIGN KEY (hoc_sinh_id) REFERENCES ho_so_hoc_sinh (hoc_sinh_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_kqcn_lop
        FOREIGN KEY (lop_hoc_id) REFERENCES lop_hoc (lop_hoc_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_kqcn_gv
        FOREIGN KEY (giao_vien_xet_id) REFERENCES ho_so_giao_vien (giao_vien_id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Xét kết quả cuối năm theo TT27/2020 — cơ sở pháp lý lên lớp/ở lại';


-- ── 28. PHIÊN ĐĂNG NHẬP / JWT REFRESH TOKEN ─────────────
-- Quản lý Refresh Token cho xác thực JWT
-- Tính năng: nhiều phiên đồng thời, revoke từng phiên, đăng xuất toàn bộ thiết bị
CREATE TABLE phien_dang_nhap (
    phien_id                BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    nguoi_dung_id           BIGINT UNSIGNED  NOT NULL,

    -- Token (KHÔNG BAO GIỜ lưu token gốc — chỉ lưu SHA-256 hash)
    refresh_token           VARCHAR(512)     NOT NULL
                            COMMENT 'SHA-256 hash của refresh token gốc',

    -- Thông tin thiết bị / client
    ten_thiet_bi            VARCHAR(200)     NULL
                            COMMENT 'User-Agent rút gọn: Chrome/Windows, iPhone App',
    dia_chi_ip              VARCHAR(45)      NULL
                            COMMENT 'IP đăng nhập lần đầu, hỗ trợ IPv4 và IPv6',

    -- Thời gian hiệu lực
    het_han                 DATETIME         NOT NULL
                            COMMENT 'Thời điểm token hết hạn (thường 30 ngày)',
    thoi_diem_tao           DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    thoi_diem_su_dung_cuoi  DATETIME         NULL
                            COMMENT 'Cập nhật mỗi lần refresh — phát hiện token cũ bị tái sử dụng',

    -- Trạng thái thu hồi
    da_thu_hoi              TINYINT(1)       NOT NULL DEFAULT 0
                            COMMENT '1 = bị revoke (đăng xuất hoặc phát hiện bất thường)',

    PRIMARY KEY (phien_id),
    UNIQUE KEY uk_refresh_token (refresh_token(64)),
    CONSTRAINT fk_phien_nd
        FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (nguoi_dung_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='JWT Refresh Token - 1 user nhiều phiên, có thể revoke từng phiên hoặc toàn bộ';

-- ── 33. INVALIDATED TOKEN ───────────────────────────────
CREATE TABLE invalidated_token (
    id VARCHAR(255) PRIMARY KEY,
    expiry_time DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bảng lưu trữ các JWT Token đã bị vô hiệu hóa (Logout)';


-- ── INDEXES ───────────────────────────────────────────────
-- Tối ưu các query thường gặp

-- Tìm sách theo bộ sách, khối lớp, môn học
CREATE INDEX idx_sach_bo_sach         ON sach (bo_sach, khoi_lop, mon_hoc_id);
-- Tìm chủ đề theo sách
CREATE INDEX idx_chu_de_sach          ON chu_de (sach_id, so_thu_tu);
-- Tìm bài học theo chủ đề
CREATE INDEX idx_bai_hoc_chu_de       ON bai_hoc (chu_de_id, so_thu_tu);
-- Tìm dạng bài theo bài học (Khám phá/Hoạt động/Luyện tập)
CREATE INDEX idx_dang_bai_bai_hoc     ON dang_bai (bai_hoc_id, so_thu_tu);
-- Tìm dạng bài theo GV tạo (bổ sung)
CREATE INDEX idx_dang_bai_giao_vien   ON dang_bai (giao_vien_id);
-- Tìm dạng bài theo H5P content UUID (Java dùng khi nhận kết quả từ H5P service)
CREATE INDEX idx_dang_bai_h5p_id      ON dang_bai (h5p_noi_dung_id);
-- Lọc bài tập theo lớp, học kỳ và trạng thái (dashboard HS)
CREATE INDEX idx_bai_tap_lop          ON bai_tap (lop_hoc_id, hoc_ky_id, trang_thai);
-- Lọc bài nộp theo bài tập và trạng thái (GV xem danh sách chấm bài)
CREATE INDEX idx_bai_nop_trang_thai   ON bai_nop (bai_tap_id, trang_thai);
-- Tìm bài nộp của 1 HS (lịch sử học tập, đầu vào AI)
CREATE INDEX idx_bai_nop_hoc_sinh     ON bai_nop (hoc_sinh_id, thoi_diem_nop);
-- Tìm khen thưởng của HS
CREATE INDEX idx_khen_thuong_hs       ON khen_thuong_hoc_sinh (hoc_sinh_id, thoi_diem_trao);
-- Tìm thông báo của lớp (sắp xếp ghim + ngày)
CREATE INDEX idx_thong_bao_lop        ON thong_bao (lop_hoc_id, la_ghim, ngay_dang);
-- Tìm tiến độ học sinh theo học kỳ (đầu vào AI)
CREATE INDEX idx_tien_do_hs           ON tien_do_hoc_sinh (hoc_sinh_id, hoc_ky_id, da_hoan_thanh);
-- Tìm dạng bài được phân phối cho lớp
CREATE INDEX idx_phan_phoi_lop        ON phan_phoi_dang_bai (lop_hoc_id);
-- Tìm lịch sử chuyển lớp của HS
CREATE INDEX idx_chuyen_lop_hs        ON lich_su_chuyen_lop (hoc_sinh_id, thoi_diem_chuyen);
-- Kiểm tra token hợp lệ và tìm phiên còn hiệu lực của người dùng
CREATE INDEX idx_phien_nguoi_dung      ON phien_dang_nhap (nguoi_dung_id, da_thu_hoi, het_han);


-- ── SEED DATA ─────────────────────────────────────────────

INSERT INTO mon_hoc (mon_hoc_id, ten_mon, ma_mon) VALUES
    (1, 'Toán', 'TOAN'),
    (2, 'Tiếng Việt', 'TV'),
    (3, 'Tiếng Anh', 'TA'),
    (4, 'Khoa học', 'KH'),
    (5, 'Lịch sử và Địa lý', 'LSDL'),
    (6, 'Đạo đức', 'DD'),
    (7, 'Tự nhiên và Xã hội', 'TNXH'),
    (8, 'Âm nhạc', 'AN'),
    (9, 'Mỹ thuật', 'MT'),
    (10, 'Thể dục', 'TD'),
    (11, 'Tin học', 'TH'),
    (12, 'Hoạt động trải nghiệm', 'HDTN');

INSERT INTO nam_hoc (nam_hoc_id, ten_nam_hoc, ngay_bat_dau, ngay_ket_thuc) VALUES
    (1, '2025-2026', '2025-09-05', '2026-05-31');

INSERT INTO hoc_ky (hoc_ky_id, nam_hoc_id, so_hoc_ky) VALUES
    (1, 1, 1),
    (2, 1, 2);

INSERT INTO cau_hinh_he_thong
    (cau_hinh_id, ten_truong, hoc_ky_hien_tai_id)
VALUES
    (1, 'Trường Tiểu học Titkul', 1);

-- Seed sách mẫu (sach) — Toán 1 Tập một (SGK và VBT)
INSERT INTO sach (
    sach_id, loai_sach, book_id_ngoai, bo_sach, khoi_lop, mon_hoc_id, hoc_ky,
    ten_sach, slug, mo_ta, tong_so_trang, nam_xuat_ban, ban_quyen, ban_bien_soan
) VALUES (
    1, 'SACH_GIAO_KHOA', 407,
    'Kết nối tri thức với cuộc sống', 1, 1, 1,
    'Toán 1 - Tập một', 'toan-1-tap-mot', 'Sách giáo khoa toán lớp 1',
    117, 2020, 'Nhà xuất bản',
    '[{"name":"Hà Huy Khoái","title":"Tổng Chủ biên","orderNo":0},{"name":"Lê Anh Vinh","title":"Chủ biên","orderNo":1}]'
),
(
    2, 'SACH_BAI_TAP', 408,
    'Kết nối tri thức với cuộc sống', 1, 1, 1,
    'Vở bài tập Toán 1 - Tập một', 'vo-bai-tap-toan-1-tap-mot', 'Vở bài tập toán lớp 1 (Dùng cho GV giao bài)',
    100, 2020, 'Nhà xuất bản',
    '[{"name":"Hà Huy Khoái","title":"Tổng Chủ biên","orderNo":0}]'
);

-- Seed chủ đề (chu_de) — Cấp 2
INSERT INTO chu_de
    (chu_de_id, sach_id, book_index_id_ngoai, ten_chu_de, tieu_de, slug, so_trang, so_thu_tu)
VALUES
    (1, 1, 14494, 'Các số từ 0 đến 10',                    'Chủ đề 1', 'cac-so-tu-0-den-10',                    6,  1),
    (2, 1, 14497, 'Làm quen với một số hình phẳng',         'Chủ đề 2', 'lam-quen-voi-mot-so-hinh-phang',        46, 2),
    (3, 1, 14498, 'Phép cộng, phép trừ trong phạm vi 10',  'Chủ đề 3', 'phep-cong-phep-tru-trong-pham-vi-10',   56, 3);

-- Seed bài học (bai_hoc) — Cấp 3
INSERT INTO bai_hoc
    (bai_hoc_id, chu_de_id, book_index_id_ngoai, ten_bai_hoc, tieu_de, slug, so_trang, so_thu_tu)
VALUES
    (10, 1, 14495, 'Tiết học đầu tiên',                                              '',       'tiet-hoc-dau-tien',        6,  0),
    (11, 1, 14504, 'Các số 0, 1, 2, 3, 4, 5',                                        'Bài 1',  'cac-so-0-1-2-3-4-5',       8,  1),
    (12, 1, 14506, 'Các số 6, 7, 8, 9, 10',                                          'Bài 2',  'cac-so-6-7-8-9-10',        14, 2),
    (13, 1, 14508, 'Nhiều hơn, ít hơn, bằng nhau',                                   'Bài 3',  'nhieu-hon-it-hon-bang-nhau',20, 3),
    (14, 1, 14510, 'So sánh số',                                                      'Bài 4',  'so-sanh-so',               24, 4),
    (15, 1, 14511, 'Mấy và mấy',                                                      'Bài 5',  'may-va-may',               32, 5),
    (16, 1, 14513, 'Luyện tập chung',                                                 'Bài 6',  'luyen-tap-chung',           38, 6),
    (20, 2, 14514, 'Hình vuông, hình tròn, hình tam giác, hình chữ nhật',             'Bài 7',  'hinh-vuong-hinh-tron',     46, 0),
    (21, 2, 14516, 'Thực hành lắp ghép, xếp hình',                                   'Bài 8',  'thuc-hanh-lap-ghep',       50, 1),
    (22, 2, 14518, 'Luyện tập chung',                                                 'Bài 9',  'luyen-tap-chung',           54, 2),
    (30, 3, 14519, 'Phép cộng trong phạm vi 10',                                      'Bài 10', 'phep-cong-trong-pham-vi-10',56, 0),
    (31, 3, 14523, 'Phép trừ trong phạm vi 10',                                       'Bài 11', 'phep-tru-trong-pham-vi-10', 68, 1);

-- Seed dạng bài (dang_bai) — nút lá phi cấu trúc (Cấp 4)
INSERT INTO dang_bai
    (dang_bai_id, bai_hoc_id, book_index_id_ngoai, mon_hoc_id, ten_dang_bai, slug, so_trang, so_thu_tu, cau_hinh)
VALUES
    -- Bài 1: Các số 0,1,2,3,4,5 (muc_luc_id=11)
    (1,  11, 16145, 1, 'Khám phá',  'kham-pha',  8,  0, '{"loai":"kham_pha","mo_ta":"Quan sát và nhận biết các số 0-5"}'),
    (2,  11, 16147, 1, 'Hoạt động', 'hoat-dong', 9,  1, '{"loai":"hoat_dong","mo_ta":"Thực hành viết và đếm số 0-5"}'),
    (3,  11, 16148, 1, 'Luyện tập', 'luyen-tap', 10, 2, '{"loai":"luyen_tap","mo_ta":"Bài tập củng cố số 0-5 trang 10"}'),
    (4,  11, 16149, 1, 'Luyện tập', 'luyen-tap', 12, 3, '{"loai":"luyen_tap","mo_ta":"Bài tập củng cố số 0-5 trang 12"}'),
    -- Bài 2: Các số 6,7,8,9,10 (muc_luc_id=12)
    (5,  12, 16150, 1, 'Khám phá',  'kham-pha',  14, 1, '{"loai":"kham_pha","mo_ta":"Quan sát và nhận biết các số 6-10"}'),
    (6,  12, 16151, 1, 'Hoạt động', 'hoat-dong', 15, 1, '{"loai":"hoat_dong","mo_ta":"Thực hành viết và đếm số 6-10"}'),
    (7,  12, 16152, 1, 'Luyện tập', 'luyen-tap', 16, 2, '{"loai":"luyen_tap","mo_ta":"Bài tập củng cố số 6-10 trang 16"}'),
    (8,  12, 16153, 1, 'Luyện tập', 'luyen-tap', 18, 3, '{"loai":"luyen_tap","mo_ta":"Bài tập củng cố số 6-10 trang 18"}'),
    -- Bài 4: So sánh số — nhiều Khám phá/Hoạt động xen kẽ (muc_luc_id=14)
    (9,  14, 16157, 1, 'Khám phá',  'kham-pha',  24, 1, '{"loai":"kham_pha","mo_ta":"So sánh số — tiết 1 trang 24"}'),
    (10, 14, 16158, 1, 'Hoạt động', 'hoat-dong', 24, 2, '{"loai":"hoat_dong","mo_ta":"Thực hành so sánh — tiết 1"}'),
    (11, 14, 16159, 1, 'Khám phá',  'kham-pha',  26, 3, '{"loai":"kham_pha","mo_ta":"So sánh số — tiết 2 trang 26"}'),
    (12, 14, 16160, 1, 'Hoạt động', 'hoat-dong', 26, 4, '{"loai":"hoat_dong","mo_ta":"Thực hành so sánh — tiết 2"}'),
    (13, 14, 16161, 1, 'Khám phá',  'kham-pha',  28, 5, '{"loai":"kham_pha","mo_ta":"So sánh số — tiết 3 trang 28"}'),
    (14, 14, 16162, 1, 'Hoạt động', 'hoat-dong', 28, 6, '{"loai":"hoat_dong","mo_ta":"Thực hành so sánh — tiết 3"}'),
    (15, 14, 16163, 1, 'Luyện tập', 'luyen-tap', 30, 7, '{"loai":"luyen_tap","mo_ta":"Luyện tập tổng hợp so sánh số"}'),
    -- Bài 10: Phép cộng (muc_luc_id=30)
    (16, 30, 17854, 1, 'Khám phá',  'kham-pha',  56, 0, '{"loai":"kham_pha","mo_ta":"Phép cộng — tiết 1 trang 56"}'),
    (17, 30, 17855, 1, 'Hoạt động', 'hoat-dong', 56, 1, '{"loai":"hoat_dong","mo_ta":"Thực hành cộng — tiết 1"}'),
    (18, 30, 17856, 1, 'Luyện tập', 'luyen-tap', 58, 2, '{"loai":"luyen_tap","mo_ta":"Luyện tập cộng trang 58"}'),
    -- Bài 11: Phép trừ (muc_luc_id=31)
    (19, 31, 17863, 1, 'Khám phá',  'kham-pha',  68, 0, '{"loai":"kham_pha","mo_ta":"Phép trừ — tiết 1 trang 68"}'),
    (20, 31, 17864, 1, 'Hoạt động', 'hoat-dong', 69, 1, '{"loai":"hoat_dong","mo_ta":"Thực hành trừ — tiết 1"}'),
    (21, 31, 17867, 1, 'Luyện tập', 'luyen-tap', 72, 4, '{"loai":"luyen_tap","mo_ta":"Luyện tập trừ trang 72"}');

-- Seed huy hiệu mẫu
INSERT INTO huy_hieu (ten_huy_hieu, mo_ta, loai, dieu_kien) VALUES
    ('Siêu Sao',        'Đạt điểm 10 trong 3 bài liên tiếp',
     'TU_DONG', '{"loai":"DIEM_CAO","diem":10,"so_bai_lien_tiep":3}'),
    ('Chăm Chỉ',        'Nộp đúng hạn 5 bài tập liên tiếp',
     'TU_DONG', '{"loai":"NOP_DUNG_HAN","so_bai":5}'),
    ('Toán Giỏi',       'Hoàn thành tất cả bài Toán trong tuần',
     'TU_DONG', '{"loai":"HOAN_THANH_MON","mon":"Toán"}'),
    ('Nhà Thám Hiểm',   'Xem ít nhất 10 bài giảng H5P',
     'TU_DONG', '{"loai":"XEM_BAI_GIANG","so_luong":10}'),
    ('Ngôi Sao Lớp',    'Được giáo viên khen thưởng thủ công',
     'THU_CONG', NULL),
    ('Tiến Bộ Vượt Bậc','Tăng điểm trung bình ít nhất 2 điểm so với tuần trước',
     'TU_DONG', '{"loai":"TANG_DIEM","tang_toi_thieu":2}');

-- Seed người dùng (nguoi_dung)
INSERT INTO nguoi_dung (nguoi_dung_id, ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, email, so_dien_thoai) VALUES
    (1, 'admin_demo', '$2a$10$abcdefghijklmnopqrstuvwx', 'ADMIN', 'ACTIVE', 'admin@titkul.edu.vn', '0901234567'),
    (2, 'gv_an', '$2a$10$abcdefghijklmnopqrstuvwx', 'GIAO_VIEN', 'ACTIVE', 'an.nguyen@titkul.edu.vn', '0901234568'),
    (3, 'gv_binh', '$2a$10$abcdefghijklmnopqrstuvwx', 'GIAO_VIEN', 'ACTIVE', 'binh.tran@titkul.edu.vn', '0901234569'),
    (4, 'hs_cuong', '$2a$10$abcdefghijklmnopqrstuvwx', 'HOC_SINH', 'ACTIVE', 'cuong.le@student.titkul.edu.vn', '0901234570'),
    (5, 'hs_dung', '$2a$10$abcdefghijklmnopqrstuvwx', 'HOC_SINH', 'ACTIVE', 'dung.pham@student.titkul.edu.vn', '0901234571'),
    (6, 'hs_em', '$2a$10$abcdefghijklmnopqrstuvwx', 'HOC_SINH', 'ACTIVE', 'em.hoang@student.titkul.edu.vn', '0901234572'),
    (7, 'ph_hai', '$2a$10$abcdefghijklmnopqrstuvwx', 'PHU_HUYNH', 'ACTIVE', 'hai.le@gmail.com', '0901234573'),
    (8, 'ph_khanh', '$2a$10$abcdefghijklmnopqrstuvwx', 'PHU_HUYNH', 'ACTIVE', 'khanh.pham@gmail.com', '0901234574');

-- Seed hồ sơ giáo viên (ho_so_giao_vien)
INSERT INTO ho_so_giao_vien (giao_vien_id, nguoi_dung_id, ma_giao_vien, ho_ten, bo_mon, ngay_sinh, gioi_tinh) VALUES
    (1, 2, 'GV20250001', 'Nguyễn Văn An', 'Toán - Tiếng Việt', '1985-05-12', 'NAM'),
    (2, 3, 'GV20250002', 'Trần Thị Bình', 'Toán', '1990-08-20', 'NU');

-- Seed lớp học (lop_hoc)
INSERT INTO lop_hoc (lop_hoc_id, ten_lop, khoi_lop, nam_hoc_id, giao_vien_chu_nhiem_id, si_so_toi_da, trang_thai) VALUES
    (1, '1A', 1, 1, 1, 35, 'ACTIVE'),
    (2, '2A', 2, 1, 2, 35, 'ACTIVE');

-- Seed hồ sơ học sinh (ho_so_hoc_sinh)
INSERT INTO ho_so_hoc_sinh (hoc_sinh_id, nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES
    (1, 4, 'HS20250001', 'Lê Văn Cường', '2019-02-15', 'NAM', 1, 150),
    (2, 5, 'HS20250002', 'Phạm Hồng Dũng', '2019-06-22', 'NAM', 1, 80),
    (3, 6, 'HS20250003', 'Hoàng Minh Em', '2018-11-05', 'NU', 2, 220);

-- Seed hồ sơ phụ huynh (ho_so_phu_huynh)
INSERT INTO ho_so_phu_huynh (phu_huynh_id, nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES
    (1, 7, 'Lê Văn Hải', 'hai.le@gmail.com'),
    (2, 8, 'Phạm Quốc Khánh', 'khanh.pham@gmail.com');

-- Seed liên kết phụ huynh - học sinh (phu_huynh_hoc_sinh)
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES
    (1, 1, 'Cha'),
    (2, 2, 'Cha'),
    (2, 3, 'Cha');

-- Seed phân công giảng dạy (phan_cong_giang_day)
INSERT INTO phan_cong_giang_day (giao_vien_id, lop_hoc_id, mon_hoc_id, hoc_ky_id) VALUES
    (1, 1, 1, 1),
    (1, 1, 2, 1),
    (2, 2, 1, 1);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Tổng kết cấu trúc phân cấp:
--   sach (có loai_sach: GIAO_KHOA / BAI_TAP)
--    └── chu_de
--         └── bai_hoc
--              └── dang_bai (cấp chứa nội dung JSON/H5P thật sự)
-- 
-- GV giao bài (bai_tap) có thể giao theo bai_hoc_id hoặc dang_bai_id.
-- Học sinh nộp bài (bai_nop) sẽ luôn trỏ về dang_bai_id để ghi nhận tiến độ.
-- ============================================================
