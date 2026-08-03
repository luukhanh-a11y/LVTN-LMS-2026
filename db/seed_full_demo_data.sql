-- ============================================================================
-- SEED DATA ĐẦY ĐỦ CHO DEMO / TEST TITKUL LMS
-- ============================================================================
-- Mật khẩu cho TẤT CẢ tài khoản (mới lẫn cũ): 123456
-- (script này cũng thay hash giả cũ của 12 tài khoản có sẵn thành hash thật)
--
-- CÁCH CHẠY:
--   "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p LMS ^
--       --default-character-set=utf8mb4 < db\seed_full_demo_data.sql
--
-- Script tự thêm 3 cột còn thiếu (hoc_lieu.khoi_lop, hoc_lieu.mon_hoc_id,
-- bai_tap.hoc_lieu_id) và tự nới ENUM bai_nop.trang_thai để thêm LUU_NHAP —
-- không cần restart core-service trước khi chạy file này. Khi core-service
-- restart sau đó, Hibernate ddl-auto=update sẽ thấy các cột đã tồn tại nên
-- không làm gì thêm (an toàn, không xung đột).
--
-- LƯU Ý: các lệnh ALTER TABLE ở mục 0 tự động COMMIT transaction hiện tại
-- (hành vi mặc định của MySQL với DDL) nên START TRANSACTION được đặt SAU
-- mục 0, chỉ bọc quanh phần dữ liệu (INSERT) để đảm bảo toàn bộ dữ liệu
-- được ghi trọn vẹn hoặc không ghi gì cả nếu có lỗi giữa chừng.
--
-- Script KHÔNG chạy lại được lần 2 trên cùng 1 DB (sẽ báo lỗi trùng khóa
-- ten_dang_nhap) — đây là hành vi mong muốn, chỉ seed 1 lần.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. VÁ SCHEMA CÒN THIẾU (xem giải thích ở đầu file)
-- ----------------------------------------------------------------------------
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hoc_lieu' AND COLUMN_NAME = 'khoi_lop');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE hoc_lieu ADD COLUMN khoi_lop SMALLINT NULL', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hoc_lieu' AND COLUMN_NAME = 'mon_hoc_id');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE hoc_lieu ADD COLUMN mon_hoc_id TINYINT UNSIGNED NULL, ADD CONSTRAINT fk_hoc_lieu_mon_hoc FOREIGN KEY (mon_hoc_id) REFERENCES mon_hoc(mon_hoc_id)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bai_tap' AND COLUMN_NAME = 'hoc_lieu_id');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE bai_tap ADD COLUMN hoc_lieu_id BIGINT NULL, ADD CONSTRAINT fk_bai_tap_hoc_lieu FOREIGN KEY (hoc_lieu_id) REFERENCES hoc_lieu(hoc_lieu_id)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- bai_nop.trang_thai là ENUM cứng từ dump cũ, thiếu LUU_NHAP mà Java đã dùng thật
-- (tính năng "Lưu nháp" bài tự luận). Nới ENUM ra, không mất dữ liệu cũ.
ALTER TABLE bai_nop MODIFY COLUMN trang_thai
    ENUM('LUU_NHAP','CHUA_NOP','DA_NOP','NOP_TRE','YC_LAM_LAI','DA_CHAM') NOT NULL DEFAULT 'CHUA_NOP';

START TRANSACTION;

-- ----------------------------------------------------------------------------
-- 1. HASH MẬT KHẨU THẬT CHO TÀI KHOẢN CŨ (mật khẩu: 123456)
-- ----------------------------------------------------------------------------
UPDATE nguoi_dung SET mat_khau_hash = '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia'
WHERE mat_khau_hash = '$2a$10$abcdefghijklmnopqrstuvwx';

-- ----------------------------------------------------------------------------
-- 2. GIÁO VIÊN MỚI (3 người, giữ 3 người cũ: gv_an, gv_binh, GV001)
-- ----------------------------------------------------------------------------
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, email, so_dien_thoai, bat_buoc_doi_mk)
VALUES ('gv_cuc', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'GIAO_VIEN', 'ACTIVE', 'cuc.nguyen@titkul.edu.vn', '0911111001', 0);
SET @u_cuc = LAST_INSERT_ID();
INSERT INTO ho_so_giao_vien (nguoi_dung_id, ma_giao_vien, ho_ten, bo_mon, ngay_sinh, gioi_tinh)
VALUES (@u_cuc, 'GV20250003', 'Nguyễn Thị Cúc', 'Toán', '1988-03-14', 'NU');
SET @gv_cuc = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, email, so_dien_thoai, bat_buoc_doi_mk)
VALUES ('gv_duc', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'GIAO_VIEN', 'ACTIVE', 'duc.tran@titkul.edu.vn', '0911111002', 0);
SET @u_duc = LAST_INSERT_ID();
INSERT INTO ho_so_giao_vien (nguoi_dung_id, ma_giao_vien, ho_ten, bo_mon, ngay_sinh, gioi_tinh)
VALUES (@u_duc, 'GV20250004', 'Trần Văn Đức', 'Tiếng Việt', '1992-11-02', 'NAM');
SET @gv_duc = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, email, so_dien_thoai, bat_buoc_doi_mk)
VALUES ('gv_hoa', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'GIAO_VIEN', 'ACTIVE', 'hoa.ly@titkul.edu.vn', '0911111003', 0);
SET @u_hoa = LAST_INSERT_ID();
INSERT INTO ho_so_giao_vien (nguoi_dung_id, ma_giao_vien, ho_ten, bo_mon, ngay_sinh, gioi_tinh)
VALUES (@u_hoa, 'GV20250005', 'Lý Thị Hoa', 'Toán - Tiếng Việt', '1986-01-25', 'NU');
SET @gv_hoa = LAST_INSERT_ID();

-- ----------------------------------------------------------------------------
-- 3. LỚP HỌC MỚI (giữ 1A/2A cũ, thêm 3A/4A/5A + 1B đang đóng băng)
-- ----------------------------------------------------------------------------
INSERT INTO lop_hoc (ten_lop, khoi_lop, nam_hoc_id, giao_vien_chu_nhiem_id, si_so_toi_da, trang_thai)
VALUES ('3A', 3, 1, @gv_cuc, 35, 'ACTIVE');
SET @cls_3a = LAST_INSERT_ID();

INSERT INTO lop_hoc (ten_lop, khoi_lop, nam_hoc_id, giao_vien_chu_nhiem_id, si_so_toi_da, trang_thai)
VALUES ('4A', 4, 1, @gv_duc, 35, 'ACTIVE');
SET @cls_4a = LAST_INSERT_ID();

INSERT INTO lop_hoc (ten_lop, khoi_lop, nam_hoc_id, giao_vien_chu_nhiem_id, si_so_toi_da, trang_thai)
VALUES ('5A', 5, 1, @gv_hoa, 35, 'ACTIVE');
SET @cls_5a = LAST_INSERT_ID();

-- Lớp đóng băng: chưa phân công GVCN (test cả 2 trạng thái cùng lúc)
INSERT INTO lop_hoc (ten_lop, khoi_lop, nam_hoc_id, giao_vien_chu_nhiem_id, si_so_toi_da, trang_thai)
VALUES ('1B', 1, 1, NULL, 35, 'DONG_BANG');
SET @cls_1b = LAST_INSERT_ID();

-- Lớp cũ đã có sẵn: lop_hoc_id 1 = 1A (khối 1), lop_hoc_id 2 = 2A (khối 2)
SET @cls_1a = 1;
SET @cls_2a = 2;

-- ----------------------------------------------------------------------------
-- 4. HỌC SINH MỚI (18 em, cộng 3 em có sẵn = 21 học sinh)
-- ----------------------------------------------------------------------------
-- 1A (thêm 2, đã có Cường hs=1, Dũng hs=2)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_lan', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_lan = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_lan, 'HS20250004', 'Vũ Thị Lan', '2019-04-10', 'NU', @cls_1a, 320);
SET @hs_lan = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_nam', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_nam = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_nam, 'HS20250005', 'Đặng Văn Nam', '2019-09-01', 'NAM', @cls_1a, 20);
SET @hs_nam = LAST_INSERT_ID();

-- 1B (đóng băng, 2 em)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_oanh', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_oanh = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_oanh, 'HS20250006', 'Bùi Thị Oanh', '2019-02-18', 'NU', @cls_1b, 0);
SET @hs_oanh = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_phuc', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_phuc = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_phuc, 'HS20250007', 'Ngô Văn Phúc', '2019-07-07', 'NAM', @cls_1b, 0);
SET @hs_phuc = LAST_INSERT_ID();

-- 2A (thêm 2, đã có Em hs=3)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_quynh', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_quynh = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_quynh, 'HS20250008', 'Đỗ Thị Quỳnh', '2018-05-30', 'NU', @cls_2a, 410);
SET @hs_quynh = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_son', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_son = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_son, 'HS20250009', 'Trịnh Văn Sơn', '2018-12-12', 'NAM', @cls_2a, 60);
SET @hs_son = LAST_INSERT_ID();

-- 3A (4 em)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_tuyet', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_tuyet = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_tuyet, 'HS20250010', 'Lâm Thị Tuyết', '2017-03-03', 'NU', @cls_3a, 540);
SET @hs_tuyet = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_uy', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_uy = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_uy, 'HS20250011', 'Phan Văn Uy', '2017-08-08', 'NAM', @cls_3a, 300);
SET @hs_uy = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_van', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_van = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_van, 'HS20250012', 'Mai Thị Vân', '2017-01-20', 'NU', @cls_3a, 150);
SET @hs_van = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_xuan', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_xuan = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_xuan, 'HS20250013', 'Đinh Văn Xuân', '2017-06-16', 'NAM', @cls_3a, 0);
SET @hs_xuan = LAST_INSERT_ID();

-- 4A (4 em)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_yen', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_yen = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_yen, 'HS20250014', 'Chu Thị Yến', '2016-04-25', 'NU', @cls_4a, 610);
SET @hs_yen = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_bao', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_bao = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_bao, 'HS20250015', 'Tô Văn Bảo', '2016-09-09', 'NAM', @cls_4a, 200);
SET @hs_bao = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_cam', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_cam = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_cam, 'HS20250016', 'Hà Thị Cẩm', '2016-02-14', 'NU', @cls_4a, 90);
SET @hs_cam = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_danh', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_danh = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_danh, 'HS20250017', 'Kiều Văn Danh', '2016-11-11', 'NAM', @cls_4a, 0);
SET @hs_danh = LAST_INSERT_ID();

-- 5A (4 em)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_giang', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_giang = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_giang, 'HS20250018', 'Lương Thị Giang', '2015-05-05', 'NU', @cls_5a, 780);
SET @hs_giang = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_hung', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_hung = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_hung, 'HS20250019', 'Đào Văn Hùng', '2015-10-10', 'NAM', @cls_5a, 430);
SET @hs_hung = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_khue', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_khue = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_khue, 'HS20250020', 'Vương Thị Khuê', '2015-07-17', 'NU', @cls_5a, 150);
SET @hs_khue = LAST_INSERT_ID();

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('hs_long', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'HOC_SINH', 'ACTIVE', 0);
SET @u_long = LAST_INSERT_ID();
INSERT INTO ho_so_hoc_sinh (nguoi_dung_id, ma_hoc_sinh, ho_ten, ngay_sinh, gioi_tinh, lop_hoc_id, tong_xp) VALUES (@u_long, 'HS20250021', 'Tăng Văn Long', '2015-12-01', 'NAM', @cls_5a, 0);
SET @hs_long = LAST_INSERT_ID();

-- Lấy lại id 3 học sinh cũ để dùng ở phần Bài nộp/Đánh giá bên dưới
SET @hs_cuong = 1; -- Lê Văn Cường, 1A
SET @hs_dung  = 2; -- Phạm Hồng Dũng, 1A
SET @hs_em    = 3; -- Hoàng Minh Em, 2A

-- ----------------------------------------------------------------------------
-- 5. PHỤ HUYNH MỚI + LIÊN KẾT (11 phụ huynh mới, giữ 2 phụ huynh cũ)
-- ----------------------------------------------------------------------------
-- ph_lan: không có email -> test hiển thị "Chưa cập nhật"
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('ph_lan', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'PHU_HUYNH', 'ACTIVE', 0);
SET @u_ph_lan = LAST_INSERT_ID();
INSERT INTO ho_so_phu_huynh (nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES (@u_ph_lan, 'Vũ Văn Lâm', NULL);
SET @p_lan = LAST_INSERT_ID();
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES (@p_lan, @hs_lan, 'Cha');

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('ph_nam', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'PHU_HUYNH', 'ACTIVE', 0);
SET @u_ph_nam = LAST_INSERT_ID();
INSERT INTO ho_so_phu_huynh (nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES (@u_ph_nam, 'Đặng Thị Nga', 'nga.dang@gmail.com');
SET @p_nam = LAST_INSERT_ID();
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES (@p_nam, @hs_nam, 'Mẹ');

-- anh em Oanh + Phúc (lớp 1B đóng băng)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('ph_oanhphuc', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'PHU_HUYNH', 'ACTIVE', 0);
SET @u_ph_op = LAST_INSERT_ID();
INSERT INTO ho_so_phu_huynh (nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES (@u_ph_op, 'Ngô Văn Bình', 'binh.ngo@gmail.com');
SET @p_op = LAST_INSERT_ID();
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES (@p_op, @hs_oanh, 'Cha'), (@p_op, @hs_phuc, 'Cha');

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('ph_quynh', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'PHU_HUYNH', 'ACTIVE', 0);
SET @u_ph_quynh = LAST_INSERT_ID();
INSERT INTO ho_so_phu_huynh (nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES (@u_ph_quynh, 'Đỗ Văn Tâm', 'tam.do@gmail.com');
SET @p_quynh = LAST_INSERT_ID();
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES (@p_quynh, @hs_quynh, 'Cha');

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('ph_son', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'PHU_HUYNH', 'ACTIVE', 0);
SET @u_ph_son = LAST_INSERT_ID();
INSERT INTO ho_so_phu_huynh (nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES (@u_ph_son, 'Trịnh Thị Hạnh', 'hanh.trinh@gmail.com');
SET @p_son = LAST_INSERT_ID();
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES (@p_son, @hs_son, 'Mẹ');

-- anh em Tuyết + Uy (3A)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('ph_tuyetuy', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'PHU_HUYNH', 'ACTIVE', 0);
SET @u_ph_tu = LAST_INSERT_ID();
INSERT INTO ho_so_phu_huynh (nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES (@u_ph_tu, 'Lâm Văn Phong', 'phong.lam@gmail.com');
SET @p_tu = LAST_INSERT_ID();
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES (@p_tu, @hs_tuyet, 'Cha'), (@p_tu, @hs_uy, 'Cha');

-- anh em Vân + Xuân (3A)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('ph_vanxuan', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'PHU_HUYNH', 'ACTIVE', 0);
SET @u_ph_vx = LAST_INSERT_ID();
INSERT INTO ho_so_phu_huynh (nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES (@u_ph_vx, 'Mai Văn Đông', 'dong.mai@gmail.com');
SET @p_vx = LAST_INSERT_ID();
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES (@p_vx, @hs_van, 'Cha'), (@p_vx, @hs_xuan, 'Cha');

-- anh em Yến + Bảo (4A)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('ph_yenbao', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'PHU_HUYNH', 'ACTIVE', 0);
SET @u_ph_yb = LAST_INSERT_ID();
INSERT INTO ho_so_phu_huynh (nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES (@u_ph_yb, 'Chu Văn Kiên', 'kien.chu@gmail.com');
SET @p_yb = LAST_INSERT_ID();
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES (@p_yb, @hs_yen, 'Cha'), (@p_yb, @hs_bao, 'Cha');

-- anh em Cẩm + Danh (4A)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('ph_camdanh', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'PHU_HUYNH', 'ACTIVE', 0);
SET @u_ph_cd = LAST_INSERT_ID();
INSERT INTO ho_so_phu_huynh (nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES (@u_ph_cd, 'Hà Văn Thanh', 'thanh.ha@gmail.com');
SET @p_cd = LAST_INSERT_ID();
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES (@p_cd, @hs_cam, 'Cha'), (@p_cd, @hs_danh, 'Cha');

-- anh em Giang + Hùng (5A)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('ph_gianghung', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'PHU_HUYNH', 'ACTIVE', 0);
SET @u_ph_gh = LAST_INSERT_ID();
INSERT INTO ho_so_phu_huynh (nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES (@u_ph_gh, 'Lương Văn Sáng', 'sang.luong@gmail.com');
SET @p_gh = LAST_INSERT_ID();
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES (@p_gh, @hs_giang, 'Cha'), (@p_gh, @hs_hung, 'Cha');

-- anh em Khuê + Long (5A)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, vai_tro, trang_thai, bat_buoc_doi_mk) VALUES ('ph_khuelong', '$2a$10$ZWF7E8ss.InP0kq/CvSsR.CbezovHWrlRtUeEOp0Ttqrcdmc6GUia', 'PHU_HUYNH', 'ACTIVE', 0);
SET @u_ph_kl = LAST_INSERT_ID();
INSERT INTO ho_so_phu_huynh (nguoi_dung_id, ho_ten, email_nhan_thong_bao) VALUES (@u_ph_kl, 'Vương Văn Đạt', 'dat.vuong@gmail.com');
SET @p_kl = LAST_INSERT_ID();
INSERT INTO phu_huynh_hoc_sinh (phu_huynh_id, hoc_sinh_id, quan_he) VALUES (@p_kl, @hs_khue, 'Cha'), (@p_kl, @hs_long, 'Cha');

-- ----------------------------------------------------------------------------
-- 6. HỌC LIỆU (Kho Học Liệu H5P) — có phân loại Khối/Môn + 1 cái CHƯA phân loại
-- ----------------------------------------------------------------------------
-- Lưu ý: chỉ có content id '2048283116' là H5P thật đã tồn tại trong h5p-service
-- (bài "Con vật" MultiChoice) nên chơi thử được thật. Các content id khác dưới
-- đây là ID giả chỉ để test danh sách/lọc Kho Học Liệu, KHÔNG chơi được thật.
INSERT INTO hoc_lieu (tieu_de, loai_hoc_lieu, nguon_goc, giao_vien_id, h5p_content_id, xp_thuong, cho_lam_lai, ngay_tao, khoi_lop, mon_hoc_id)
VALUES ('Phép cộng trong phạm vi 10', 'BAI_TAP_H5P', 'GIAO_VIEN_TAO', 1, '2048283116', 20, 1, NOW(), 1, 1);
SET @hl_toan_k1 = LAST_INSERT_ID();

INSERT INTO hoc_lieu (tieu_de, loai_hoc_lieu, nguon_goc, giao_vien_id, h5p_content_id, xp_thuong, cho_lam_lai, ngay_tao, khoi_lop, mon_hoc_id)
VALUES ('Bảng chữ cái Tiếng Việt', 'BAI_GIANG_H5P', 'GIAO_VIEN_TAO', 1, 'seed-tv-k1-001', 0, 0, NOW(), 1, 2);
SET @hl_van_k1 = LAST_INSERT_ID();

INSERT INTO hoc_lieu (tieu_de, loai_hoc_lieu, nguon_goc, giao_vien_id, h5p_content_id, xp_thuong, cho_lam_lai, ngay_tao, khoi_lop, mon_hoc_id)
VALUES ('Phép trừ có nhớ trong phạm vi 20', 'BAI_TAP_H5P', 'GIAO_VIEN_TAO', 2, '2048283116', 25, 1, NOW(), 2, 1);
SET @hl_toan_k2 = LAST_INSERT_ID();

INSERT INTO hoc_lieu (tieu_de, loai_hoc_lieu, nguon_goc, giao_vien_id, h5p_content_id, xp_thuong, cho_lam_lai, ngay_tao, khoi_lop, mon_hoc_id)
VALUES ('Kể chuyện: Cây bàng trước ngõ', 'BAI_GIANG_H5P', 'GIAO_VIEN_TAO', 2, 'seed-tv-k2-001', 0, 0, NOW(), 2, 2);
SET @hl_van_k2 = LAST_INSERT_ID();

INSERT INTO hoc_lieu (tieu_de, loai_hoc_lieu, nguon_goc, giao_vien_id, h5p_content_id, xp_thuong, cho_lam_lai, ngay_tao, khoi_lop, mon_hoc_id)
VALUES ('Nhân chia trong phạm vi 100', 'BAI_TAP_H5P', 'GIAO_VIEN_TAO', @gv_cuc, '2048283116', 30, 1, NOW(), 3, 1);
SET @hl_toan_k3 = LAST_INSERT_ID();

INSERT INTO hoc_lieu (tieu_de, loai_hoc_lieu, nguon_goc, giao_vien_id, h5p_content_id, xp_thuong, cho_lam_lai, ngay_tao, khoi_lop, mon_hoc_id)
VALUES ('Tập làm văn: Tả cảnh sân trường', 'BAI_TAP_H5P', 'GIAO_VIEN_TAO', @gv_cuc, 'seed-tv-k3-001', 20, 1, NOW(), 3, 2);
SET @hl_van_k3 = LAST_INSERT_ID();

INSERT INTO hoc_lieu (tieu_de, loai_hoc_lieu, nguon_goc, giao_vien_id, h5p_content_id, xp_thuong, cho_lam_lai, ngay_tao, khoi_lop, mon_hoc_id)
VALUES ('Chính tả nghe - viết: Quê hương', 'BAI_TAP_H5P', 'GIAO_VIEN_TAO', @gv_duc, '2048283116', 20, 1, NOW(), 4, 2);
SET @hl_van_k4 = LAST_INSERT_ID();

INSERT INTO hoc_lieu (tieu_de, loai_hoc_lieu, nguon_goc, giao_vien_id, h5p_content_id, xp_thuong, cho_lam_lai, ngay_tao, khoi_lop, mon_hoc_id)
VALUES ('Bốn phép tính với số thập phân', 'BAI_TAP_H5P', 'GIAO_VIEN_TAO', @gv_duc, 'seed-toan-k4-001', 25, 1, NOW(), 4, 1);
SET @hl_toan_k4 = LAST_INSERT_ID();

INSERT INTO hoc_lieu (tieu_de, loai_hoc_lieu, nguon_goc, giao_vien_id, h5p_content_id, xp_thuong, cho_lam_lai, ngay_tao, khoi_lop, mon_hoc_id)
VALUES ('Phân số và các phép tính', 'BAI_TAP_H5P', 'GIAO_VIEN_TAO', @gv_hoa, '2048283116', 35, 1, NOW(), 5, 1);
SET @hl_toan_k5 = LAST_INSERT_ID();

INSERT INTO hoc_lieu (tieu_de, loai_hoc_lieu, nguon_goc, giao_vien_id, h5p_content_id, xp_thuong, cho_lam_lai, ngay_tao, khoi_lop, mon_hoc_id)
VALUES ('Luyện từ và câu: Trạng ngữ', 'BAI_TAP_H5P', 'GIAO_VIEN_TAO', @gv_hoa, 'seed-tv-k5-001', 20, 1, NOW(), 5, 2);
SET @hl_van_k5 = LAST_INSERT_ID();

-- Cố tình CHƯA phân loại Khối/Môn -> test badge "Chưa phân loại Khối/Môn"
INSERT INTO hoc_lieu (tieu_de, loai_hoc_lieu, nguon_goc, giao_vien_id, h5p_content_id, xp_thuong, cho_lam_lai, ngay_tao, khoi_lop, mon_hoc_id)
VALUES ('Trò chơi ghép hình vui nhộn', 'BAI_GIANG_H5P', 'GIAO_VIEN_TAO', @gv_hoa, 'seed-unclassified-001', 0, 0, NOW(), NULL, NULL);
SET @hl_unclassified = LAST_INSERT_ID();

-- ----------------------------------------------------------------------------
-- 7. BÀI TẬP (Assignment) — 2 bài mỗi lớp đang hoạt động (Toán H5P + Tiếng Việt tự luận)
-- ----------------------------------------------------------------------------
-- 1A & 2A: deadline đã QUA (học kỳ 1) -> để test NOP_TRE/DA_CHAM đầy đủ
INSERT INTO bai_tap (giao_vien_id, lop_hoc_id, hoc_ky_id, hoc_lieu_id, tieu_de, mo_ta, loai_bai_tap, deadline, cho_nop_lai, so_lan_nop_lai_toi_da, trang_thai)
VALUES (1, @cls_1a, 1, @hl_toan_k1, 'Luyện tập phép cộng trong phạm vi 10', 'Hoàn thành bài tập H5P trắc nghiệm phép cộng.', 'H5P', '2026-06-20 23:59:00', 1, 2, 'DA_DONG');
SET @a_1a_toan = LAST_INSERT_ID();

INSERT INTO bai_tap (giao_vien_id, lop_hoc_id, hoc_ky_id, hoc_lieu_id, tieu_de, mo_ta, loai_bai_tap, deadline, cho_nop_lai, so_lan_nop_lai_toi_da, trang_thai)
VALUES (1, @cls_1a, 1, @hl_van_k1, 'Viết đoạn văn ngắn về gia đình em', 'Viết 3-5 câu miêu tả gia đình của em.', 'TU_LUAN', '2026-06-25 23:59:00', 1, 2, 'DA_DONG');
SET @a_1a_van = LAST_INSERT_ID();

INSERT INTO bai_tap (giao_vien_id, lop_hoc_id, hoc_ky_id, hoc_lieu_id, tieu_de, mo_ta, loai_bai_tap, deadline, cho_nop_lai, so_lan_nop_lai_toi_da, trang_thai)
VALUES (2, @cls_2a, 1, @hl_toan_k2, 'Luyện tập phép trừ có nhớ', 'Hoàn thành bài tập H5P trắc nghiệm phép trừ.', 'H5P', '2026-06-22 23:59:00', 1, 2, 'DA_DONG');
SET @a_2a_toan = LAST_INSERT_ID();

INSERT INTO bai_tap (giao_vien_id, lop_hoc_id, hoc_ky_id, hoc_lieu_id, tieu_de, mo_ta, loai_bai_tap, deadline, cho_nop_lai, so_lan_nop_lai_toi_da, trang_thai)
VALUES (2, @cls_2a, 1, @hl_van_k2, 'Kể lại câu chuyện Cây bàng trước ngõ', 'Kể lại bằng lời của em.', 'TU_LUAN', '2026-06-28 23:59:00', 1, 2, 'DA_DONG');
SET @a_2a_van = LAST_INSERT_ID();

-- 3A: 1 bài quá hạn gần đây (mixed), 1 bài còn hạn gần (học kỳ 2)
INSERT INTO bai_tap (giao_vien_id, lop_hoc_id, hoc_ky_id, hoc_lieu_id, tieu_de, mo_ta, loai_bai_tap, deadline, cho_nop_lai, so_lan_nop_lai_toi_da, trang_thai)
VALUES (@gv_cuc, @cls_3a, 2, @hl_toan_k3, 'Luyện tập nhân chia trong phạm vi 100', 'Hoàn thành bài tập H5P.', 'H5P', '2026-07-05 23:59:00', 1, 2, 'DA_DONG');
SET @a_3a_toan = LAST_INSERT_ID();

INSERT INTO bai_tap (giao_vien_id, lop_hoc_id, hoc_ky_id, hoc_lieu_id, tieu_de, mo_ta, loai_bai_tap, deadline, cho_nop_lai, so_lan_nop_lai_toi_da, trang_thai)
VALUES (@gv_cuc, @cls_3a, 2, @hl_van_k3, 'Tả cảnh sân trường giờ ra chơi', 'Viết đoạn văn 5-7 câu.', 'TU_LUAN', '2026-07-12 23:59:00', 1, 2, 'DANG_MO');
SET @a_3a_van = LAST_INSERT_ID();

-- 4A: cả 2 bài còn hạn tương lai gần (đang mở)
INSERT INTO bai_tap (giao_vien_id, lop_hoc_id, hoc_ky_id, hoc_lieu_id, tieu_de, mo_ta, loai_bai_tap, deadline, cho_nop_lai, so_lan_nop_lai_toi_da, trang_thai)
VALUES (@gv_duc, @cls_4a, 2, @hl_toan_k4, 'Bốn phép tính với số thập phân', 'Hoàn thành bài tập H5P.', 'H5P', '2026-07-15 23:59:00', 1, 2, 'DANG_MO');
SET @a_4a_toan = LAST_INSERT_ID();

INSERT INTO bai_tap (giao_vien_id, lop_hoc_id, hoc_ky_id, hoc_lieu_id, tieu_de, mo_ta, loai_bai_tap, deadline, cho_nop_lai, so_lan_nop_lai_toi_da, trang_thai)
VALUES (@gv_duc, @cls_4a, 2, @hl_van_k4, 'Chính tả nghe - viết: Quê hương', 'Nghe và viết lại đoạn văn.', 'TU_LUAN', '2026-07-20 23:59:00', 1, 2, 'DANG_MO');
SET @a_4a_van = LAST_INSERT_ID();

-- 5A: bài còn hạn xa (lớp "sạch", chưa ai nộp gì) — test empty state
INSERT INTO bai_tap (giao_vien_id, lop_hoc_id, hoc_ky_id, hoc_lieu_id, tieu_de, mo_ta, loai_bai_tap, deadline, cho_nop_lai, so_lan_nop_lai_toi_da, trang_thai)
VALUES (@gv_hoa, @cls_5a, 2, @hl_toan_k5, 'Phân số và các phép tính', 'Hoàn thành bài tập H5P.', 'H5P', '2026-08-10 23:59:00', 1, 2, 'DANG_MO');
SET @a_5a_toan = LAST_INSERT_ID();

INSERT INTO bai_tap (giao_vien_id, lop_hoc_id, hoc_ky_id, hoc_lieu_id, tieu_de, mo_ta, loai_bai_tap, deadline, cho_nop_lai, so_lan_nop_lai_toi_da, trang_thai)
VALUES (@gv_hoa, @cls_5a, 2, @hl_van_k5, 'Luyện từ và câu: Trạng ngữ', 'Làm bài tập trong phiếu.', 'TU_LUAN', '2026-08-15 23:59:00', 1, 2, 'DANG_MO');
SET @a_5a_van = LAST_INSERT_ID();

-- ----------------------------------------------------------------------------
-- 8. BÀI NỘP (Submission) — đa dạng trạng thái
-- ----------------------------------------------------------------------------
-- === 1A / bài Toán (H5P, hạn 2026-06-20, cho nộp lại) ===
INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, diem_tu_dong, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_1a_toan, @hs_cuong, 'DA_CHAM', 10.0, 20, 1, 0, '2026-06-18 09:00:00');
SET @sub_1a_toan_cuong = LAST_INSERT_ID();

INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, diem_tu_dong, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_1a_toan, @hs_dung, 'DA_CHAM', 4.0, 0, 1, 1, '2026-06-21 10:00:00');
SET @sub_1a_toan_dung = LAST_INSERT_ID();

INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, diem_tu_dong, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_1a_toan, @hs_lan, 'DA_CHAM', 9.5, 20, 1, 0, '2026-06-19 14:00:00');
SET @sub_1a_toan_lan = LAST_INSERT_ID();

INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, diem_tu_dong, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_1a_toan, @hs_nam, 'DA_NOP', 6.0, 0, 1, 0, '2026-06-20 08:00:00');
SET @sub_1a_toan_nam = LAST_INSERT_ID();

-- === 1A / bài Tiếng Việt (tự luận, hạn 2026-06-25) ===
INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, noi_dung_text, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_1a_van, @hs_cuong, 'DA_CHAM', 'Gia đình em có bốn người: bố, mẹ, em và em gái. Bố em là bộ đội, mẹ em là giáo viên. Em rất yêu gia đình của mình.', 15, 1, 0, '2026-06-23 19:00:00');
SET @sub_1a_van_cuong = LAST_INSERT_ID();

INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, noi_dung_text, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_1a_van, @hs_dung, 'YC_LAM_LAI', 'Gia dinh em', 0, 1, 0, '2026-06-24 20:00:00');
SET @sub_1a_van_dung = LAST_INSERT_ID();

INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, noi_dung_text, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_1a_van, @hs_lan, 'DA_CHAM', 'Gia đình em có ông, bà, bố, mẹ và em. Mỗi buổi tối cả nhà cùng ăn cơm và kể chuyện vui. Em rất hạnh phúc.', 15, 1, 0, '2026-06-22 18:00:00');
SET @sub_1a_van_lan = LAST_INSERT_ID();

-- Nam: chỉ lưu nháp, chưa nộp chính thức (test tính năng Lưu nháp)
INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, noi_dung_text, xp_nhan_duoc, so_lan_lam, la_nop_tre)
VALUES (@a_1a_van, @hs_nam, 'LUU_NHAP', 'Gia đình em có...', 0, 1, 0);

-- === 2A / bài Toán (H5P, hạn 2026-06-22) ===
INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, diem_tu_dong, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_2a_toan, @hs_em, 'DA_CHAM', 10.0, 25, 1, 0, '2026-06-20 09:00:00');
SET @sub_2a_toan_em = LAST_INSERT_ID();

INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, diem_tu_dong, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_2a_toan, @hs_quynh, 'DA_CHAM', 7.0, 25, 1, 1, '2026-06-23 11:00:00');
SET @sub_2a_toan_quynh = LAST_INSERT_ID();

INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, diem_tu_dong, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_2a_toan, @hs_son, 'DA_NOP', 5.0, 0, 1, 0, '2026-06-22 07:30:00');
SET @sub_2a_toan_son = LAST_INSERT_ID();

-- === 2A / bài Tiếng Việt (tự luận, hạn 2026-06-28); Sơn chưa nộp (không có dòng) ===
INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, noi_dung_text, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_2a_van, @hs_em, 'DA_CHAM', 'Ngày xưa có cây bàng cổ thụ đứng trước ngõ nhà em. Mỗi mùa hè, tán bàng xanh mát che bóng cho cả xóm.', 20, 1, 0, '2026-06-26 20:00:00');
SET @sub_2a_van_em = LAST_INSERT_ID();

INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, noi_dung_text, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_2a_van, @hs_quynh, 'DA_CHAM', 'Cây bàng trước ngõ nhà em rất to. Em thích ngồi học bài dưới gốc cây vào buổi chiều.', 20, 1, 0, '2026-06-27 19:30:00');
SET @sub_2a_van_quynh = LAST_INSERT_ID();

-- === 3A / bài Toán (H5P, hạn 2026-07-05, đã qua) ===
INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, diem_tu_dong, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_3a_toan, @hs_tuyet, 'DA_CHAM', 10.0, 30, 1, 0, '2026-07-03 09:00:00');
SET @sub_3a_toan_tuyet = LAST_INSERT_ID();

INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, diem_tu_dong, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_3a_toan, @hs_uy, 'DA_CHAM', 7.5, 30, 1, 0, '2026-07-04 15:00:00');
SET @sub_3a_toan_uy = LAST_INSERT_ID();

INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, diem_tu_dong, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_3a_toan, @hs_van, 'NOP_TRE', 5.0, 0, 1, 1, '2026-07-06 21:00:00');
SET @sub_3a_toan_van = LAST_INSERT_ID();
-- Xuân: chưa nộp (không có dòng)

-- === 3A / bài Tiếng Việt (tự luận, hạn 2026-07-12, còn hạn) ===
INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, noi_dung_text, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_3a_van, @hs_tuyet, 'DA_NOP', 'Giờ ra chơi, sân trường rộn ràng tiếng cười đùa của các bạn học sinh. Có bạn chơi nhảy dây, có bạn đá cầu.', 0, 1, 0, '2026-07-08 10:00:00');

-- === 4A / bài Toán (H5P, hạn 2026-07-15, còn hạn) ===
INSERT INTO bai_nop (bai_tap_id, hoc_sinh_id, trang_thai, diem_tu_dong, xp_nhan_duoc, so_lan_lam, la_nop_tre, thoi_diem_nop)
VALUES (@a_4a_toan, @hs_yen, 'DA_NOP', 9.0, 0, 1, 0, '2026-07-08 08:00:00');

-- 4A bài Tiếng Việt: chưa ai nộp (không tạo dòng)
-- 5A: không có bài nộp nào (lớp sạch để test empty state hoàn toàn)

-- ----------------------------------------------------------------------------
-- 9. ĐÁNH GIÁ (Evaluation) — khớp với các bài nộp DA_CHAM/YC_LAM_LAI ở trên
-- ----------------------------------------------------------------------------
-- 1A Toán
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_1a_toan_cuong, 1, 10.0, 'HOAN_THANH_TOT', 'Con làm bài rất tốt, chính xác 100%!', 'DUYET', '2026-06-19 08:00:00');
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_1a_toan_dung, 1, 4.0, 'CHUA_HOAN_THANH', 'Con cần luyện tập thêm phép cộng, nộp bài trễ hạn.', 'DUYET', '2026-06-22 08:00:00');
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_1a_toan_lan, 1, 9.5, 'HOAN_THANH_TOT', 'Rất xuất sắc, con tiến bộ nhiều!', 'DUYET', '2026-06-20 08:00:00');

-- 1A Tiếng Việt
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_1a_van_cuong, 1, 8.0, 'HOAN_THANH', 'Đoạn văn khá tốt, cần thêm chi tiết miêu tả.', 'DUYET', '2026-06-24 09:00:00');
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_1a_van_dung, 1, 3.0, 'CHUA_HOAN_THANH', 'Bài viết quá ngắn, con hãy viết lại đầy đủ hơn nhé.', 'YC_LAM_LAI', '2026-06-25 09:00:00');
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_1a_van_lan, 1, 9.0, 'HOAN_THANH_TOT', 'Văn phong sinh động, giàu cảm xúc!', 'DUYET', '2026-06-23 09:00:00');

-- 2A Toán
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_2a_toan_em, 2, 10.0, 'HOAN_THANH_TOT', 'Xuất sắc, không sai câu nào!', 'DUYET', '2026-06-21 08:00:00');
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_2a_toan_quynh, 2, 7.0, 'HOAN_THANH', 'Nộp trễ hạn, cần chú ý deadline hơn.', 'DUYET', '2026-06-24 08:00:00');

-- 2A Tiếng Việt
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_2a_van_em, 2, 9.0, 'HOAN_THANH_TOT', 'Kể chuyện mạch lạc, cảm xúc chân thật.', 'DUYET', '2026-06-27 09:00:00');
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_2a_van_quynh, 2, 7.5, 'HOAN_THANH', 'Bài kể tốt, cần thêm câu mở đầu hấp dẫn hơn.', 'DUYET', '2026-06-28 09:00:00');

-- 3A Toán
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_3a_toan_tuyet, @gv_cuc, 10.0, 'HOAN_THANH_TOT', 'Con làm bài rất nhanh và chính xác!', 'DUYET', '2026-07-04 08:00:00');
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_3a_toan_uy, @gv_cuc, 7.5, 'HOAN_THANH', 'Còn sai vài phép chia, cần ôn lại bảng cửu chương.', 'DUYET', '2026-07-05 08:00:00');
INSERT INTO danh_gia_bai_lam (bai_nop_id, giao_vien_id, diem_so, xep_loai, nhan_xet, hanh_dong, thoi_diem_cham) VALUES (@sub_3a_toan_van, @gv_cuc, 5.0, 'CHUA_HOAN_THANH', 'Nộp trễ và làm sai khá nhiều, cần cố gắng hơn.', 'DUYET', '2026-07-07 08:00:00');

-- (3A Tiếng Việt của Tuyết và 4A Toán của Yến còn ở trạng thái DA_NOP/chưa chấm —
--  cố tình để vậy nhằm test hàng đợi "Chờ chấm" trong Grading.tsx)

-- ----------------------------------------------------------------------------
-- 10. PHIẾU HỖ TRỢ (Ticket) — đa dạng loại yêu cầu + trạng thái xử lý
-- ----------------------------------------------------------------------------
INSERT INTO phieu_ho_tro (giao_vien_tao_id, hoc_sinh_lien_quan_id, loai_yeu_cau, mo_ta, trang_thai, ngay_tao)
VALUES (1, @hs_dung, 'RESET_MAT_KHAU', 'Phụ huynh báo quên mật khẩu, nhờ Admin cấp lại mật khẩu mặc định.', 'CHO_DUYET', '2026-07-08 09:00:00');

INSERT INTO phieu_ho_tro (giao_vien_tao_id, hoc_sinh_lien_quan_id, loai_yeu_cau, mo_ta, admin_xu_ly_id, trang_thai, ghi_chu_xu_ly, ngay_tao, ngay_xu_ly)
VALUES (2, @hs_quynh, 'SAI_THONG_TIN', 'Học sinh nhập sai ngày sinh lúc đăng ký, cần admin sửa lại.', 1, 'DA_DUYET', 'Đã cập nhật lại ngày sinh chính xác trong hồ sơ.', '2026-07-06 10:00:00', '2026-07-06 15:00:00');

INSERT INTO phieu_ho_tro (giao_vien_tao_id, hoc_sinh_lien_quan_id, loai_yeu_cau, mo_ta, admin_xu_ly_id, trang_thai, ghi_chu_xu_ly, ngay_tao, ngay_xu_ly)
VALUES (@gv_cuc, @hs_van, 'RESET_MAT_KHAU', 'Học sinh quên mật khẩu, phụ huynh chưa xác minh được danh tính.', 1, 'TU_CHOI', 'Chưa đủ thông tin xác minh, vui lòng liên hệ trực tiếp văn phòng.', '2026-07-07 08:30:00', '2026-07-07 14:00:00');

INSERT INTO phieu_ho_tro (giao_vien_tao_id, hoc_sinh_lien_quan_id, loai_yeu_cau, mo_ta, trang_thai, ngay_tao)
VALUES (@gv_duc, @hs_yen, 'HO_TRO_KY_THUAT', 'Học sinh báo không xem được video bài giảng H5P trên máy tính bảng.', 'CHO_DUYET', '2026-07-09 07:45:00');

-- ----------------------------------------------------------------------------
-- 11. LỊCH SỬ CHUYỂN LỚP — ví dụ HS lên lớp từ năm trước
-- ----------------------------------------------------------------------------
INSERT INTO lich_su_chuyen_lop (hoc_sinh_id, lop_cu_id, lop_moi_id, nam_hoc_cu, nam_hoc_moi, ly_do, ghi_chu, nguoi_thuc_hien_id, thoi_diem_chuyen)
VALUES (@hs_em, @cls_1a, @cls_2a, '2024-2025', '2025-2026', 'LEN_LOP', 'Học sinh hoàn thành chương trình khối 1, lên khối 2.', 1, '2025-08-15 08:00:00');

INSERT INTO lich_su_chuyen_lop (hoc_sinh_id, lop_cu_id, lop_moi_id, nam_hoc_cu, nam_hoc_moi, ly_do, ghi_chu, nguoi_thuc_hien_id, thoi_diem_chuyen)
VALUES (@hs_oanh, NULL, @cls_1b, NULL, '2025-2026', 'NHAP_HOC_MOI', 'Học sinh mới nhập học đầu năm.', 1, '2025-09-01 08:00:00');

-- ----------------------------------------------------------------------------
-- 12. KHEN THƯỞNG (StudentReward) — trao một số huy hiệu có sẵn cho học sinh
-- ----------------------------------------------------------------------------
-- huy_hieu_id có sẵn: 1=Siêu Sao, 2=Chăm Chỉ, 3=Toán Giỏi, 4=Nhà Thám Hiểm, 5=Ngôi Sao Lớp, 6=Tiến Bộ Vượt Bậc
INSERT INTO khen_thuong_hoc_sinh (hoc_sinh_id, huy_hieu_id, giao_vien_id, thu_khen, nguon_cap, thoi_diem_trao, da_gui_email)
VALUES (@hs_cuong, 5, 1, 'Cô khen con vì tinh thần học tập chăm chỉ và luôn giúp đỡ bạn bè trong lớp!', 'THU_CONG', '2026-06-20 10:00:00', 1);

INSERT INTO khen_thuong_hoc_sinh (hoc_sinh_id, huy_hieu_id, giao_vien_id, thu_khen, nguon_cap, thoi_diem_trao, da_gui_email)
VALUES (@hs_lan, 1, 1, 'Con đạt điểm 10 liên tiếp 3 bài kiểm tra Toán, cô rất tự hào!', 'HE_THONG', '2026-06-19 10:00:00', 1);

INSERT INTO khen_thuong_hoc_sinh (hoc_sinh_id, huy_hieu_id, giao_vien_id, nguon_cap, thoi_diem_trao, da_gui_email)
VALUES (@hs_em, 3, 2, 'HE_THONG', '2026-06-21 10:00:00', 0);

INSERT INTO khen_thuong_hoc_sinh (hoc_sinh_id, huy_hieu_id, giao_vien_id, thu_khen, nguon_cap, thoi_diem_trao, da_gui_email)
VALUES (@hs_tuyet, 2, @gv_cuc, 'Con luôn nộp bài đúng hạn suốt học kỳ, cô khen ngợi tinh thần kỷ luật của con!', 'THU_CONG', '2026-07-04 10:00:00', 0);

-- ----------------------------------------------------------------------------
-- 13. PHÂN CÔNG GIẢNG DẠY (bảng chưa được dùng ở tầng ứng dụng, seed cho đủ)
-- ----------------------------------------------------------------------------
INSERT INTO phan_cong_giang_day (giao_vien_id, lop_hoc_id, mon_hoc_id, hoc_ky_id) VALUES
(@gv_cuc, @cls_3a, 1, 2),
(@gv_cuc, @cls_3a, 2, 2),
(@gv_duc, @cls_4a, 2, 2),
(@gv_duc, @cls_4a, 1, 2),
(@gv_hoa, @cls_5a, 1, 2),
(@gv_hoa, @cls_5a, 2, 2);

-- QUAN TRỌNG: ParentProfile.getChildren() (dùng ở KHẮP ParentService) đọc qua
-- FK trực tiếp ho_so_hoc_sinh.phu_huynh_id, KHÔNG phải qua bảng phu_huynh_hoc_sinh
-- ở trên — nếu thiếu bước backfill này, mọi phụ huynh sẽ luôn thấy 0 con dù đã
-- có dữ liệu liên kết trong phu_huynh_hoc_sinh.
UPDATE ho_so_hoc_sinh hs
JOIN phu_huynh_hoc_sinh phs ON hs.hoc_sinh_id = phs.hoc_sinh_id
SET hs.phu_huynh_id = phs.phu_huynh_id
WHERE hs.phu_huynh_id IS NULL;

COMMIT;
