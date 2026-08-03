-- ============================================================================
-- SEED CÂY SGK (Sách/Chủ đề/Bài học/ContentNode) CHO KHỐI 2-5 (môn Toán)
-- + gắn H5P thật vào vài ContentNode Khối 1 sẵn có
-- ============================================================================
-- Chạy sau file seed_full_demo_data.sql (cần 5 lớp 1A-5A đã tồn tại để test).
-- Chỉ có content id '2048283116' là H5P thật chơi được (bài "Con vật"), các
-- ContentNode "Luyện tập" dưới đây dùng lại ID này để test được Player thật;
-- các node "Khám phá"/"Hoạt động" để loai_noi_dung=JSON_TEXT (chưa có nội dung
-- tương tác) nhằm test luôn nhánh fallback "chưa có nội dung" của LessonPlayer.
-- ============================================================================

START TRANSACTION;

-- Gắn H5P thật vào 2 ContentNode "Luyện tập" của Khối 1 đã có sẵn (chương Phép cộng/trừ)
UPDATE dang_bai SET loai_noi_dung = 'H5P', h5p_noi_dung_id = '2048283116', xp_thuong = 10 WHERE dang_bai_id = 18; -- Luyện tập (Phép cộng)
UPDATE dang_bai SET loai_noi_dung = 'H5P', h5p_noi_dung_id = '2048283116', xp_thuong = 10 WHERE dang_bai_id = 21; -- Luyện tập (Phép trừ)

-- ----------------------------------------------------------------------------
-- KHỐI 2 — Toán 2
-- ----------------------------------------------------------------------------
INSERT INTO sach (loai_sach, bo_sach, khoi_lop, mon_hoc_id, ten_sach, trang_thai) VALUES ('SACH_GIAO_KHOA', 'Kết nối tri thức', 2, 1, 'Toán 2 - Tập một', 'ACTIVE');
SET @sach_k2 = LAST_INSERT_ID();

INSERT INTO chu_de (sach_id, ten_chu_de, so_thu_tu) VALUES (@sach_k2, 'Phép cộng, phép trừ trong phạm vi 100', 1);
SET @cd_k2_1 = LAST_INSERT_ID();
INSERT INTO chu_de (sach_id, ten_chu_de, so_thu_tu) VALUES (@sach_k2, 'Phép nhân, phép chia', 2);
SET @cd_k2_2 = LAST_INSERT_ID();

INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k2_1, 'Phép cộng có nhớ trong phạm vi 100', 1);
SET @bh_k2_1 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k2_1, 'Phép trừ có nhớ trong phạm vi 100', 2);
SET @bh_k2_2 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k2_2, 'Bảng nhân 2, nhân 5', 1);
SET @bh_k2_3 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k2_2, 'Bảng chia 2, chia 5', 2);
SET @bh_k2_4 = LAST_INSERT_ID();

INSERT INTO dang_bai (bai_hoc_id, ten_dang_bai, mon_hoc_id, loai_noi_dung, xp_thuong, so_thu_tu) VALUES
(@bh_k2_1, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k2_1, 'Luyện tập', 1, 'H5P', 10, 1),
(@bh_k2_2, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k2_2, 'Luyện tập', 1, 'H5P', 10, 1),
(@bh_k2_3, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k2_3, 'Luyện tập', 1, 'H5P', 15, 1),
(@bh_k2_4, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k2_4, 'Luyện tập', 1, 'H5P', 15, 1);
UPDATE dang_bai SET h5p_noi_dung_id = '2048283116' WHERE loai_noi_dung = 'H5P' AND bai_hoc_id IN (@bh_k2_1, @bh_k2_2, @bh_k2_3, @bh_k2_4);

-- ----------------------------------------------------------------------------
-- KHỐI 3 — Toán 3
-- ----------------------------------------------------------------------------
INSERT INTO sach (loai_sach, bo_sach, khoi_lop, mon_hoc_id, ten_sach, trang_thai) VALUES ('SACH_GIAO_KHOA', 'Kết nối tri thức', 3, 1, 'Toán 3 - Tập một', 'ACTIVE');
SET @sach_k3 = LAST_INSERT_ID();

INSERT INTO chu_de (sach_id, ten_chu_de, so_thu_tu) VALUES (@sach_k3, 'Nhân chia trong phạm vi 1000', 1);
SET @cd_k3_1 = LAST_INSERT_ID();
INSERT INTO chu_de (sach_id, ten_chu_de, so_thu_tu) VALUES (@sach_k3, 'Hình học cơ bản', 2);
SET @cd_k3_2 = LAST_INSERT_ID();

INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k3_1, 'Bảng nhân, chia 6, 7', 1);
SET @bh_k3_1 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k3_1, 'Bảng nhân, chia 8, 9', 2);
SET @bh_k3_2 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k3_2, 'Chu vi hình chữ nhật, hình vuông', 1);
SET @bh_k3_3 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k3_2, 'Diện tích hình chữ nhật, hình vuông', 2);
SET @bh_k3_4 = LAST_INSERT_ID();

INSERT INTO dang_bai (bai_hoc_id, ten_dang_bai, mon_hoc_id, loai_noi_dung, xp_thuong, so_thu_tu) VALUES
(@bh_k3_1, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k3_1, 'Luyện tập', 1, 'H5P', 15, 1),
(@bh_k3_2, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k3_2, 'Luyện tập', 1, 'H5P', 15, 1),
(@bh_k3_3, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k3_3, 'Luyện tập', 1, 'H5P', 20, 1),
(@bh_k3_4, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k3_4, 'Luyện tập', 1, 'H5P', 20, 1);
UPDATE dang_bai SET h5p_noi_dung_id = '2048283116' WHERE loai_noi_dung = 'H5P' AND bai_hoc_id IN (@bh_k3_1, @bh_k3_2, @bh_k3_3, @bh_k3_4);

-- ----------------------------------------------------------------------------
-- KHỐI 4 — Toán 4
-- ----------------------------------------------------------------------------
INSERT INTO sach (loai_sach, bo_sach, khoi_lop, mon_hoc_id, ten_sach, trang_thai) VALUES ('SACH_GIAO_KHOA', 'Kết nối tri thức', 4, 1, 'Toán 4 - Tập một', 'ACTIVE');
SET @sach_k4 = LAST_INSERT_ID();

INSERT INTO chu_de (sach_id, ten_chu_de, so_thu_tu) VALUES (@sach_k4, 'Phân số', 1);
SET @cd_k4_1 = LAST_INSERT_ID();
INSERT INTO chu_de (sach_id, ten_chu_de, so_thu_tu) VALUES (@sach_k4, 'Số thập phân', 2);
SET @cd_k4_2 = LAST_INSERT_ID();

INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k4_1, 'Khái niệm phân số', 1);
SET @bh_k4_1 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k4_1, 'So sánh phân số', 2);
SET @bh_k4_2 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k4_2, 'Khái niệm số thập phân', 1);
SET @bh_k4_3 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k4_2, 'Bốn phép tính với số thập phân', 2);
SET @bh_k4_4 = LAST_INSERT_ID();

INSERT INTO dang_bai (bai_hoc_id, ten_dang_bai, mon_hoc_id, loai_noi_dung, xp_thuong, so_thu_tu) VALUES
(@bh_k4_1, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k4_1, 'Luyện tập', 1, 'H5P', 20, 1),
(@bh_k4_2, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k4_2, 'Luyện tập', 1, 'H5P', 20, 1),
(@bh_k4_3, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k4_3, 'Luyện tập', 1, 'H5P', 25, 1),
(@bh_k4_4, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k4_4, 'Luyện tập', 1, 'H5P', 25, 1);
UPDATE dang_bai SET h5p_noi_dung_id = '2048283116' WHERE loai_noi_dung = 'H5P' AND bai_hoc_id IN (@bh_k4_1, @bh_k4_2, @bh_k4_3, @bh_k4_4);

-- ----------------------------------------------------------------------------
-- KHỐI 5 — Toán 5
-- ----------------------------------------------------------------------------
INSERT INTO sach (loai_sach, bo_sach, khoi_lop, mon_hoc_id, ten_sach, trang_thai) VALUES ('SACH_GIAO_KHOA', 'Kết nối tri thức', 5, 1, 'Toán 5 - Tập một', 'ACTIVE');
SET @sach_k5 = LAST_INSERT_ID();

INSERT INTO chu_de (sach_id, ten_chu_de, so_thu_tu) VALUES (@sach_k5, 'Số thập phân nâng cao', 1);
SET @cd_k5_1 = LAST_INSERT_ID();
INSERT INTO chu_de (sach_id, ten_chu_de, so_thu_tu) VALUES (@sach_k5, 'Hình học không gian', 2);
SET @cd_k5_2 = LAST_INSERT_ID();

INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k5_1, 'Nhân, chia số thập phân', 1);
SET @bh_k5_1 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k5_1, 'Tỉ số phần trăm', 2);
SET @bh_k5_2 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k5_2, 'Diện tích hình thang', 1);
SET @bh_k5_3 = LAST_INSERT_ID();
INSERT INTO bai_hoc (chu_de_id, ten_bai_hoc, so_thu_tu) VALUES (@cd_k5_2, 'Thể tích hình hộp chữ nhật', 2);
SET @bh_k5_4 = LAST_INSERT_ID();

INSERT INTO dang_bai (bai_hoc_id, ten_dang_bai, mon_hoc_id, loai_noi_dung, xp_thuong, so_thu_tu) VALUES
(@bh_k5_1, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k5_1, 'Luyện tập', 1, 'H5P', 25, 1),
(@bh_k5_2, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k5_2, 'Luyện tập', 1, 'H5P', 25, 1),
(@bh_k5_3, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k5_3, 'Luyện tập', 1, 'H5P', 30, 1),
(@bh_k5_4, 'Khám phá', 1, 'JSON_TEXT', 0, 0),
(@bh_k5_4, 'Luyện tập', 1, 'H5P', 30, 1);
UPDATE dang_bai SET h5p_noi_dung_id = '2048283116' WHERE loai_noi_dung = 'H5P' AND bai_hoc_id IN (@bh_k5_1, @bh_k5_2, @bh_k5_3, @bh_k5_4);

COMMIT;
