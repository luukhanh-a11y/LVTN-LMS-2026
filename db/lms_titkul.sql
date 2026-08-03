-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th6 29, 2026 lúc 02:23 PM
-- Phiên bản máy phục vụ: 9.6.0
-- Phiên bản PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `lms_titkul`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bai_nop`
--

DROP TABLE IF EXISTS `bai_nop`;
CREATE TABLE IF NOT EXISTS `bai_nop` (
  `bai_nop_id` bigint NOT NULL AUTO_INCREMENT,
  `file_dinh_kem` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `so_lan_lam` tinyint UNSIGNED NOT NULL,
  `diem_h5p` decimal(5,2) DEFAULT NULL,
  `la_nop_tre` bit(1) NOT NULL,
  `trang_thai` enum('LUU_NHAP','CHUA_NOP','DA_NOP','NOP_TRE','YC_LAM_LAI','DA_CHAM') COLLATE utf8mb4_unicode_ci NOT NULL,
  `thoi_diem_nop` datetime(6) DEFAULT NULL,
  `noi_dung_text` text COLLATE utf8mb4_unicode_ci,
  `xp_nhan_duoc` smallint UNSIGNED NOT NULL,
  `bai_tap_id` bigint NOT NULL,
  `hoc_sinh_id` bigint NOT NULL,
  PRIMARY KEY (`bai_nop_id`),
  KEY `FK8qb08f810w5vs1ur95ygbe0n5` (`bai_tap_id`),
  KEY `FK3r2ppg7ebgm54wrofeod2qo0m` (`hoc_sinh_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bai_tap`
--

DROP TABLE IF EXISTS `bai_tap`;
CREATE TABLE IF NOT EXISTS `bai_tap` (
  `bai_tap_id` bigint NOT NULL AUTO_INCREMENT,
  `cho_nop_lai` bit(1) NOT NULL,
  `ngay_tao` datetime(6) NOT NULL,
  `deadline` datetime(6) NOT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `hard_lock` bit(1) NOT NULL,
  `thoi_diem_bat_dau` datetime(6) DEFAULT NULL,
  `trang_thai` enum('CHO_DANG','DANG_MO','DA_DONG') COLLATE utf8mb4_unicode_ci NOT NULL,
  `tieu_de` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai_bai_tap` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lop_hoc_id` bigint NOT NULL,
  `hoc_lieu_id` bigint DEFAULT NULL,
  `giao_vien_id` bigint NOT NULL,
  PRIMARY KEY (`bai_tap_id`),
  KEY `FKyrngly7j32avi4olmw4xcy9f` (`lop_hoc_id`),
  KEY `FKiouostpkld2t3o0knhq3cureg` (`hoc_lieu_id`),
  KEY `FKow2b2osatt2tfr8ee0ev2xfw0` (`giao_vien_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bai_tap`
--

INSERT INTO `bai_tap` (`bai_tap_id`, `cho_nop_lai`, `ngay_tao`, `deadline`, `mo_ta`, `hard_lock`, `thoi_diem_bat_dau`, `trang_thai`, `tieu_de`, `loai_bai_tap`, `lop_hoc_id`, `hoc_lieu_id`, `giao_vien_id`) VALUES
(1, b'0', '2026-06-19 20:48:10.102421', '2026-06-21 05:00:00.000000', 'Giới thiệu bản thân bằng tiếng Anh', b'1', NULL, 'CHO_DANG', 'Mini Test', 'TU_LUAN', 1, NULL, 2),
(2, b'0', '2026-06-19 21:00:37.701546', '2026-06-19 17:00:00.000000', 'Miêu tả con vật yêu thích bằng tiếng Anh', b'1', NULL, 'CHO_DANG', 'Mini Test Part 1', 'TU_LUAN', 2, NULL, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cau_hinh_he_thong`
--

DROP TABLE IF EXISTS `cau_hinh_he_thong`;
CREATE TABLE IF NOT EXISTS `cau_hinh_he_thong` (
  `id` bigint NOT NULL,
  `nam_hoc_hien_tai` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nam_hoc` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hoc_ky` int NOT NULL,
  `danh_sach_khoi` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ten_truong` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `danh_sach_mon` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cau_hinh_he_thong`
--

INSERT INTO `cau_hinh_he_thong` (`id`, `nam_hoc_hien_tai`, `nam_hoc`, `hoc_ky`, `danh_sach_khoi`, `logo_url`, `ten_truong`, `danh_sach_mon`) VALUES
(1, '2026-2027', '2026-2027', 1, 'Khối 1,Khối 2,Khối 3,Khối 4,Khối 5', NULL, 'Trường Tiểu Học Titkul', 'Toán,Tiếng Việt,Đạo đức,Tự nhiên và Xã hội,Lịch sử,Địa lý,Âm nhạc,Mỹ thuật,Thể dục,Tin học,Tiếng Anh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_gia_bai_lam`
--

DROP TABLE IF EXISTS `danh_gia_bai_lam`;
CREATE TABLE IF NOT EXISTS `danh_gia_bai_lam` (
  `danh_gia_id` bigint NOT NULL AUTO_INCREMENT,
  `hanh_dong` enum('DUYET','YC_LAM_LAI') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nhan_xet` text COLLATE utf8mb4_unicode_ci,
  `thoi_diem_cham` datetime(6) NOT NULL,
  `xep_loai` enum('HOAN_THANH_TOT','HOAN_THANH','CHUA_HOAN_THANH') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `diem_so` decimal(4,1) DEFAULT NULL,
  `bai_nop_id` bigint NOT NULL,
  `giao_vien_id` bigint NOT NULL,
  PRIMARY KEY (`danh_gia_id`),
  UNIQUE KEY `UK_n97de8rhs73vkw5neg3yxcgvv` (`bai_nop_id`),
  KEY `FKtj969spcln4ro0bjl9mxkyhw7` (`giao_vien_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_muc_bai_hoc`
--

DROP TABLE IF EXISTS `danh_muc_bai_hoc`;
CREATE TABLE IF NOT EXISTS `danh_muc_bai_hoc` (
  `bai_hoc_id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `bo_sach` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `khoi_lop` tinyint UNSIGNED NOT NULL,
  `ten_bai` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_bai` smallint UNSIGNED DEFAULT NULL,
  `hoc_ky` tinyint UNSIGNED DEFAULT NULL,
  `mon_hoc` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`bai_hoc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoc_lieu`
--

DROP TABLE IF EXISTS `hoc_lieu`;
CREATE TABLE IF NOT EXISTS `hoc_lieu` (
  `hoc_lieu_id` bigint NOT NULL AUTO_INCREMENT,
  `cho_lam_lai` bit(1) NOT NULL,
  `file_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noi_dung_h5p` json DEFAULT NULL,
  `loai_hoc_lieu` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_lan_lam_toi_da` tinyint UNSIGNED DEFAULT NULL,
  `nguon_goc` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tieu_de` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `xp_thuong` smallint UNSIGNED NOT NULL,
  `bai_hoc_id` int UNSIGNED DEFAULT NULL,
  `giao_vien_id` bigint DEFAULT NULL,
  PRIMARY KEY (`hoc_lieu_id`),
  KEY `FK5jixoqhkvkw2j48nojcf7mhfj` (`bai_hoc_id`),
  KEY `FKt135br9vxc7xc4colj8q482e` (`giao_vien_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ho_so_giao_vien`
--

DROP TABLE IF EXISTS `ho_so_giao_vien`;
CREATE TABLE IF NOT EXISTS `ho_so_giao_vien` (
  `giao_vien_id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_sinh` date DEFAULT NULL,
  `bo_mon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ho_ten` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nguoi_dung_id` bigint NOT NULL,
  PRIMARY KEY (`giao_vien_id`),
  UNIQUE KEY `UK_smdmrfy5oo668qjrn44suctdm` (`nguoi_dung_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ho_so_giao_vien`
--

INSERT INTO `ho_so_giao_vien` (`giao_vien_id`, `ngay_sinh`, `bo_mon`, `ho_ten`, `nguoi_dung_id`) VALUES
(1, NULL, 'Toán', 'Nguyễn Văn GV', 2),
(2, '2000-07-11', 'Tiếng Anh', 'Nguyễn Kiều Minh Toàn', 7);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ho_so_hoc_sinh`
--

DROP TABLE IF EXISTS `ho_so_hoc_sinh`;
CREATE TABLE IF NOT EXISTS `ho_so_hoc_sinh` (
  `hoc_sinh_id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_sinh` date DEFAULT NULL,
  `ho_ten` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ma_hoc_sinh` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tong_xp` int NOT NULL,
  `lop_hoc_id` bigint DEFAULT NULL,
  `phu_huynh_id` bigint DEFAULT NULL,
  `nguoi_dung_id` bigint NOT NULL,
  PRIMARY KEY (`hoc_sinh_id`),
  UNIQUE KEY `UK_dyr8kif69drxui1iut1w6rg5e` (`ma_hoc_sinh`),
  UNIQUE KEY `UK_2ndoblf085pled5w3qks4uldv` (`nguoi_dung_id`),
  KEY `FKprvdoml4awle5gu83gbpngefi` (`lop_hoc_id`),
  KEY `FKlp96san7ah61o9j17n2tg0vyy` (`phu_huynh_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ho_so_hoc_sinh`
--

INSERT INTO `ho_so_hoc_sinh` (`hoc_sinh_id`, `ngay_sinh`, `ho_ten`, `ma_hoc_sinh`, `tong_xp`, `lop_hoc_id`, `phu_huynh_id`, `nguoi_dung_id`) VALUES
(1, NULL, 'Lưu Nhật Khánh', 'HS999', 0, 2, 1, 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ho_so_phu_huynh`
--

DROP TABLE IF EXISTS `ho_so_phu_huynh`;
CREATE TABLE IF NOT EXISTS `ho_so_phu_huynh` (
  `phu_huynh_id` bigint NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_nhan_thong_bao` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nguoi_dung_id` bigint NOT NULL,
  PRIMARY KEY (`phu_huynh_id`),
  UNIQUE KEY `UK_bhnsk5p4s40no58mbayi1npar` (`nguoi_dung_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ho_so_phu_huynh`
--

INSERT INTO `ho_so_phu_huynh` (`phu_huynh_id`, `ho_ten`, `email_nhan_thong_bao`, `nguoi_dung_id`) VALUES
(1, 'Hoàng Văn Hùng', 'tuan.phuynh@mail.com', 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lop_hoc`
--

DROP TABLE IF EXISTS `lop_hoc`;
CREATE TABLE IF NOT EXISTS `lop_hoc` (
  `lop_hoc_id` bigint NOT NULL AUTO_INCREMENT,
  `nam_hoc` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `khoi_lop` tinyint UNSIGNED NOT NULL,
  `si_so_toi_da` tinyint UNSIGNED NOT NULL,
  `ten_lop` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` enum('ACTIVE','DONG_BANG') COLLATE utf8mb4_unicode_ci NOT NULL,
  `giao_vien_chu_nhiem_id` bigint DEFAULT NULL,
  PRIMARY KEY (`lop_hoc_id`),
  KEY `FK96e4m3dj0bp88d16b0vwvitnn` (`giao_vien_chu_nhiem_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `lop_hoc`
--

INSERT INTO `lop_hoc` (`lop_hoc_id`, `nam_hoc`, `khoi_lop`, `si_so_toi_da`, `ten_lop`, `trang_thai`, `giao_vien_chu_nhiem_id`) VALUES
(1, '2026-2027', 5, 40, 'Lớp 5A', 'ACTIVE', 1),
(2, '2026-2027', 5, 40, 'Lớp 5A9', 'ACTIVE', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lo_import`
--

DROP TABLE IF EXISTS `lo_import`;
CREATE TABLE IF NOT EXISTS `lo_import` (
  `lo_id` bigint NOT NULL AUTO_INCREMENT,
  `chi_tiet_loi` json DEFAULT NULL,
  `ten_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loai_import` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `so_thanh_cong` int DEFAULT NULL,
  `tom_tat_ket_qua` json DEFAULT NULL,
  `nguoi_thuc_hien_id` bigint DEFAULT NULL,
  PRIMARY KEY (`lo_id`),
  KEY `FKf9g4f0enflwcotsja6pm81ory` (`nguoi_thuc_hien_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `lo_import`
--

INSERT INTO `lo_import` (`lo_id`, `chi_tiet_loi`, `ten_file`, `loai_import`, `trang_thai`, `so_thanh_cong`, `tom_tat_ket_qua`, `nguoi_thuc_hien_id`) VALUES
(1, '[]', 'Danh_Sach_Hoc_Sinh_v2.xlsx', 'TAI_KHOAN', 'THANH_CONG', 1, '{\"total\": 1, \"failure\": 0, \"success\": 1}', 3),
(2, '[{\"errorMsg\": \"Mã học sinh (Username) đã tồn tại trong hệ thống.\", \"rowNumber\": 2, \"studentCode\": \"HS999\", \"studentName\": \"Lưu Nhật Khánh\"}]', 'Danh_Sach_Hoc_Sinh_v2.xlsx', 'TAI_KHOAN', 'THAT_BAI', 0, '{\"total\": 1, \"failure\": 1, \"success\": 0}', 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
CREATE TABLE IF NOT EXISTS `nguoi_dung` (
  `nguoi_dung_id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_tao` datetime(6) DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lan_dang_nhap_cuoi` datetime(6) DEFAULT NULL,
  `mat_khau_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bat_buoc_doi_mk` bit(1) NOT NULL,
  `vai_tro` enum('ADMIN','GIAO_VIEN','HOC_SINH','PHU_HUYNH') COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` enum('ACTIVE','LOCKED','DISABLED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay_cap_nhat` datetime(6) DEFAULT NULL,
  `ten_dang_nhap` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`nguoi_dung_id`),
  UNIQUE KEY `UK_o0s268lrp9is6o1e4ek6m1lc6` (`ten_dang_nhap`),
  UNIQUE KEY `UK_majqh5g4djy2tp3p9dvr64brp` (`email`),
  UNIQUE KEY `UK_r8hrsenotp8hvdk4n96mrtnay` (`so_dien_thoai`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`nguoi_dung_id`, `ngay_tao`, `email`, `lan_dang_nhap_cuoi`, `mat_khau_hash`, `so_dien_thoai`, `bat_buoc_doi_mk`, `vai_tro`, `trang_thai`, `ngay_cap_nhat`, `ten_dang_nhap`) VALUES
(1, NULL, NULL, NULL, '$2a$10$QEoM4sT9lpGrWfpl.i0o6eg1uba9xNbK73/1XSu5BmTShcn8ymnNS', NULL, b'0', 'HOC_SINH', 'ACTIVE', NULL, 'HS001'),
(2, NULL, NULL, NULL, '$2a$10$H0aE7uvo1ojPvJXW3RABYuhCa/AXeZSWeFLeUy27zxrCZ81E5CzN.', NULL, b'0', 'GIAO_VIEN', 'ACTIVE', NULL, 'GV001'),
(3, NULL, NULL, NULL, '$2a$10$MEVlw4was/UGfqLauzlLKevrhtHDzvzLyalvWX9X/sTeHjh/ySYs6', NULL, b'0', 'ADMIN', 'ACTIVE', NULL, 'AD001'),
(4, NULL, NULL, NULL, '$2a$10$qFFOdRtDkJ1sOqGXzOTmt.wZDguzB6l2wLWUNSQ66Jd9pC0tAuykK', NULL, b'0', 'PHU_HUYNH', 'ACTIVE', NULL, 'PH001'),
(5, NULL, 'tuan.phuynh@mail.com', NULL, '$2a$10$mLNa3eHjMhvzWeLSTC67u.JdwyQy1yxOh9K7aPVOBFHOw3ZlylT72', '0911112222', b'0', 'PHU_HUYNH', 'ACTIVE', NULL, '0911112222'),
(6, NULL, 'giahuyttdeveloper@gmail.com', NULL, '$2a$10$DDceqw.lf9uMRXky.EJtIu7uAGD24G2zB8Ng/dLJ1r/sI4utuUfO.', NULL, b'1', 'HOC_SINH', 'ACTIVE', NULL, 'HS999'),
(7, NULL, NULL, NULL, '$2a$10$lMUe3LpXqbjsFmAPtKUk9euuv46FHwX2pXTBwieU1xvyK9HqdAV5K', '0987654432', b'0', 'GIAO_VIEN', 'ACTIVE', NULL, 'GV99');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phan_phoi_hoc_lieu`
--

DROP TABLE IF EXISTS `phan_phoi_hoc_lieu`;
CREATE TABLE IF NOT EXISTS `phan_phoi_hoc_lieu` (
  `phan_phoi_id` bigint NOT NULL AUTO_INCREMENT,
  `ngay_chia_se` datetime(6) NOT NULL,
  `lop_hoc_id` bigint NOT NULL,
  `hoc_lieu_id` bigint NOT NULL,
  `giao_vien_id` bigint NOT NULL,
  PRIMARY KEY (`phan_phoi_id`),
  KEY `FK9e7c90oiggbu762d4h5mijy2f` (`lop_hoc_id`),
  KEY `FKpxc66ebx4ohhwqn9ltgbrxx0c` (`hoc_lieu_id`),
  KEY `FKi8vl9e3qe30v4slqp1qko5k1a` (`giao_vien_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phan_thuong_hoc_sinh`
--

DROP TABLE IF EXISTS `phan_thuong_hoc_sinh`;
CREATE TABLE IF NOT EXISTS `phan_thuong_hoc_sinh` (
  `phan_thuong_id` bigint NOT NULL AUTO_INCREMENT,
  `mo_ta` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_url` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ten_thuong` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mon_hoc` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loai_thuong` enum('BADGE','LETTER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay_dat_duoc` date DEFAULT NULL,
  `hoc_sinh_id` bigint NOT NULL,
  `giao_vien_tang_id` bigint DEFAULT NULL,
  PRIMARY KEY (`phan_thuong_id`),
  KEY `FKt18iyd3agvmcph9hlwnhj95xi` (`hoc_sinh_id`),
  KEY `FKfm6djnf69d0x06x8day9kw554` (`giao_vien_tang_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieu_ho_tro`
--

DROP TABLE IF EXISTS `phieu_ho_tro`;
CREATE TABLE IF NOT EXISTS `phieu_ho_tro` (
  `phieu_id` bigint NOT NULL AUTO_INCREMENT,
  `ghi_chu_xu_ly` text COLLATE utf8mb4_unicode_ci,
  `ngay_tao` datetime(6) NOT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `ngay_xu_ly` datetime(6) DEFAULT NULL,
  `trang_thai` enum('CHO_DUYET','DA_DUYET','TU_CHOI') COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai_yeu_cau` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_xu_ly_id` bigint DEFAULT NULL,
  `hoc_sinh_lien_quan_id` bigint NOT NULL,
  `giao_vien_tao_id` bigint NOT NULL,
  PRIMARY KEY (`phieu_id`),
  KEY `FKphf8cil4cpuos9nufc8ropsou` (`admin_xu_ly_id`),
  KEY `FKhtynf0fm6jxolmdku6qxb5f7h` (`hoc_sinh_lien_quan_id`),
  KEY `FKeiotqk6qpu26oyq1vp0ya491q` (`giao_vien_tao_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieu_ho_tro`
--

INSERT INTO `phieu_ho_tro` (`phieu_id`, `ghi_chu_xu_ly`, `ngay_tao`, `mo_ta`, `ngay_xu_ly`, `trang_thai`, `loai_yeu_cau`, `admin_xu_ly_id`, `hoc_sinh_lien_quan_id`, `giao_vien_tao_id`) VALUES
(1, '', '2026-06-29 12:24:04.694706', 'Phụ huynh báo quên mật khẩu, nhờ Admin cấp lại mật khẩu mặc định.', '2026-06-29 12:24:45.512143', 'DA_DUYET', 'RESET_MAT_KHAU', 3, 6, 7),
(2, 'Không đủ bằng chứng', '2026-06-29 12:31:43.881654', 'Phụ huynh báo quên mật khẩu, nhờ Admin cấp lại mật khẩu mặc định.', '2026-06-29 12:32:22.034972', 'TU_CHOI', 'RESET_MAT_KHAU', 3, 6, 7),
(3, 'Không đủ xác thực', '2026-06-29 12:43:52.159544', 'Phụ huynh báo quên mật khẩu, nhờ Admin cấp lại mật khẩu mặc định.', '2026-06-29 12:44:10.103560', 'TU_CHOI', 'RESET_MAT_KHAU', 7, 6, 7),
(4, '', '2026-06-29 12:46:25.616828', 'Phụ huynh báo quên mật khẩu, nhờ Admin cấp lại mật khẩu mặc định.', '2026-06-29 12:46:39.967062', 'DA_DUYET', 'RESET_MAT_KHAU', 6, 6, 7),
(5, '', '2026-06-29 12:48:36.556163', 'Phụ huynh báo quên mật khẩu, nhờ Admin cấp lại mật khẩu mặc định.', '2026-06-29 12:48:57.422278', 'DA_DUYET', 'RESET_MAT_KHAU', 6, 6, 6),
(6, 'Test', '2026-06-29 12:49:42.917250', 'Phụ huynh báo quên mật khẩu, nhờ Admin cấp lại mật khẩu mặc định.', '2026-06-29 12:49:51.915456', 'TU_CHOI', 'RESET_MAT_KHAU', 6, 6, 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thong_bao`
--

DROP TABLE IF EXISTS `thong_bao`;
CREATE TABLE IF NOT EXISTS `thong_bao` (
  `thong_bao_id` bigint NOT NULL AUTO_INCREMENT,
  `noi_dung` text COLLATE utf8mb4_unicode_ci,
  `ngay_gui` datetime(6) NOT NULL,
  `da_ghim` bit(1) NOT NULL,
  `da_doc` bit(1) NOT NULL,
  `tieu_de` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai_thong_bao` enum('NOI_BO','KHEN_THUONG','NHAC_NHO','HE_THONG') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nguoi_nhan_id` bigint NOT NULL,
  PRIMARY KEY (`thong_bao_id`),
  KEY `FKuqt61uibe8dxw2aw7rn5gq6l` (`nguoi_nhan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `bai_nop`
--
ALTER TABLE `bai_nop`
  ADD CONSTRAINT `FK3r2ppg7ebgm54wrofeod2qo0m` FOREIGN KEY (`hoc_sinh_id`) REFERENCES `ho_so_hoc_sinh` (`hoc_sinh_id`),
  ADD CONSTRAINT `FK8qb08f810w5vs1ur95ygbe0n5` FOREIGN KEY (`bai_tap_id`) REFERENCES `bai_tap` (`bai_tap_id`);

--
-- Ràng buộc cho bảng `bai_tap`
--
ALTER TABLE `bai_tap`
  ADD CONSTRAINT `FKiouostpkld2t3o0knhq3cureg` FOREIGN KEY (`hoc_lieu_id`) REFERENCES `hoc_lieu` (`hoc_lieu_id`),
  ADD CONSTRAINT `FKow2b2osatt2tfr8ee0ev2xfw0` FOREIGN KEY (`giao_vien_id`) REFERENCES `ho_so_giao_vien` (`giao_vien_id`),
  ADD CONSTRAINT `FKyrngly7j32avi4olmw4xcy9f` FOREIGN KEY (`lop_hoc_id`) REFERENCES `lop_hoc` (`lop_hoc_id`);

--
-- Ràng buộc cho bảng `danh_gia_bai_lam`
--
ALTER TABLE `danh_gia_bai_lam`
  ADD CONSTRAINT `FKe4mcbh0diw4a9iv6ogkak53de` FOREIGN KEY (`bai_nop_id`) REFERENCES `bai_nop` (`bai_nop_id`),
  ADD CONSTRAINT `FKtj969spcln4ro0bjl9mxkyhw7` FOREIGN KEY (`giao_vien_id`) REFERENCES `ho_so_giao_vien` (`giao_vien_id`);

--
-- Ràng buộc cho bảng `hoc_lieu`
--
ALTER TABLE `hoc_lieu`
  ADD CONSTRAINT `FK5jixoqhkvkw2j48nojcf7mhfj` FOREIGN KEY (`bai_hoc_id`) REFERENCES `danh_muc_bai_hoc` (`bai_hoc_id`),
  ADD CONSTRAINT `FKt135br9vxc7xc4colj8q482e` FOREIGN KEY (`giao_vien_id`) REFERENCES `ho_so_giao_vien` (`giao_vien_id`);

--
-- Ràng buộc cho bảng `ho_so_giao_vien`
--
ALTER TABLE `ho_so_giao_vien`
  ADD CONSTRAINT `FK3kxkf6tnpxbjpbme8ywd1rrn5` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`nguoi_dung_id`);

--
-- Ràng buộc cho bảng `ho_so_hoc_sinh`
--
ALTER TABLE `ho_so_hoc_sinh`
  ADD CONSTRAINT `FKlp96san7ah61o9j17n2tg0vyy` FOREIGN KEY (`phu_huynh_id`) REFERENCES `ho_so_phu_huynh` (`phu_huynh_id`),
  ADD CONSTRAINT `FKpqw3ufc76dt9cpoy6uh0q3w8y` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`nguoi_dung_id`),
  ADD CONSTRAINT `FKprvdoml4awle5gu83gbpngefi` FOREIGN KEY (`lop_hoc_id`) REFERENCES `lop_hoc` (`lop_hoc_id`);

--
-- Ràng buộc cho bảng `ho_so_phu_huynh`
--
ALTER TABLE `ho_so_phu_huynh`
  ADD CONSTRAINT `FK1r3k738u3w204oo3e5uqu1y2a` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`nguoi_dung_id`);

--
-- Ràng buộc cho bảng `lop_hoc`
--
ALTER TABLE `lop_hoc`
  ADD CONSTRAINT `FK96e4m3dj0bp88d16b0vwvitnn` FOREIGN KEY (`giao_vien_chu_nhiem_id`) REFERENCES `ho_so_giao_vien` (`giao_vien_id`);

--
-- Ràng buộc cho bảng `lo_import`
--
ALTER TABLE `lo_import`
  ADD CONSTRAINT `FKf9g4f0enflwcotsja6pm81ory` FOREIGN KEY (`nguoi_thuc_hien_id`) REFERENCES `nguoi_dung` (`nguoi_dung_id`);

--
-- Ràng buộc cho bảng `phan_phoi_hoc_lieu`
--
ALTER TABLE `phan_phoi_hoc_lieu`
  ADD CONSTRAINT `FK9e7c90oiggbu762d4h5mijy2f` FOREIGN KEY (`lop_hoc_id`) REFERENCES `lop_hoc` (`lop_hoc_id`),
  ADD CONSTRAINT `FKi8vl9e3qe30v4slqp1qko5k1a` FOREIGN KEY (`giao_vien_id`) REFERENCES `ho_so_giao_vien` (`giao_vien_id`),
  ADD CONSTRAINT `FKpxc66ebx4ohhwqn9ltgbrxx0c` FOREIGN KEY (`hoc_lieu_id`) REFERENCES `hoc_lieu` (`hoc_lieu_id`);

--
-- Ràng buộc cho bảng `phan_thuong_hoc_sinh`
--
ALTER TABLE `phan_thuong_hoc_sinh`
  ADD CONSTRAINT `FKfm6djnf69d0x06x8day9kw554` FOREIGN KEY (`giao_vien_tang_id`) REFERENCES `ho_so_giao_vien` (`giao_vien_id`),
  ADD CONSTRAINT `FKt18iyd3agvmcph9hlwnhj95xi` FOREIGN KEY (`hoc_sinh_id`) REFERENCES `ho_so_hoc_sinh` (`hoc_sinh_id`);

--
-- Ràng buộc cho bảng `phieu_ho_tro`
--
ALTER TABLE `phieu_ho_tro`
  ADD CONSTRAINT `FKeiotqk6qpu26oyq1vp0ya491q` FOREIGN KEY (`giao_vien_tao_id`) REFERENCES `nguoi_dung` (`nguoi_dung_id`),
  ADD CONSTRAINT `FKhtynf0fm6jxolmdku6qxb5f7h` FOREIGN KEY (`hoc_sinh_lien_quan_id`) REFERENCES `nguoi_dung` (`nguoi_dung_id`),
  ADD CONSTRAINT `FKphf8cil4cpuos9nufc8ropsou` FOREIGN KEY (`admin_xu_ly_id`) REFERENCES `nguoi_dung` (`nguoi_dung_id`);

--
-- Ràng buộc cho bảng `thong_bao`
--
ALTER TABLE `thong_bao`
  ADD CONSTRAINT `FKuqt61uibe8dxw2aw7rn5gq6l` FOREIGN KEY (`nguoi_nhan_id`) REFERENCES `nguoi_dung` (`nguoi_dung_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
