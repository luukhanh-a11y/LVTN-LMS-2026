const mysql = require('mysql2/promise');

async function run() {
  let connection;
  try {
    connection = await mysql.createConnection({ user: 'root', password: '', database: 'lms_v2' });
    console.log("Connected to database.");

    // 1. Lý Thuyết: "Các số 0, 1, 2, 3, 4, 5", "Các số 6, 7, 8, 9, 10", "So sánh số"
    const lyThuyetData = JSON.stringify({
      loai: "LY_THUYET",
      noiDung: "Đây là bài học lý thuyết mặc định. Các em hãy chú ý đọc kỹ nội dung bài học để nắm bắt kiến thức nhé!",
      thanhPhanCauHoi: [
        { type: "text", content: "Hãy quan sát hình ảnh dưới đây:" },
        { type: "image", url: "/custom-assets/data-character-backgroud-for-all-game/Environment/foliagePack_006.png" }
      ]
    });
    
    await connection.execute(`UPDATE dang_bai SET loaiNoiDung = 'JSON_TEXT', duLieuGame = ? WHERE tenDangBai LIKE '%Các số%' OR tenDangBai LIKE '%So sánh số%'`, [lyThuyetData]);
    console.log("Updated Lý Thuyết lessons.");

    // 2. Tự Luận: Update a lesson named "Tự luận" or similar, or just create/update one specific.
    const tuLuanData = JSON.stringify({
      loai: "TU_LUAN",
      noiDung: "Em hãy viết một đoạn văn ngắn (khoảng 3-5 câu) miêu tả lại một trò chơi mà em yêu thích nhất.",
      thanhPhanCauHoi: []
    });
    await connection.execute(`UPDATE dang_bai SET loaiNoiDung = 'JSON_TEXT', duLieuGame = ? WHERE tenDangBai LIKE '%Tự luận%'`, [tuLuanData]);
    console.log("Updated Tự Luận lessons.");

    // 3. Trắc Nghiệm Mặc Định (QuizForm): Find one and set it up
    const tracNghiemData = JSON.stringify({
      loai: "TRAC_NGHIEM",
      noiDung: "Đọc kỹ câu hỏi và chọn đáp án đúng nhất.",
      thanhPhanCauHoi: [{ type: "text", content: "Con vật nào sau đây là con vật nuôi trong gia đình?" }],
      danhSachLuaChon: [
        { id: "A", loai: "text", noiDung: "Con Hổ" },
        { id: "B", loai: "text", noiDung: "Con Chó" },
        { id: "C", loai: "text", noiDung: "Con Sư tử" },
        { id: "D", loai: "text", noiDung: "Con Voi" }
      ]
    });
    const dapAnChuanTracNghiem = JSON.stringify({ dapAnDungId: "B" });
    await connection.execute(`UPDATE dang_bai SET loaiNoiDung = 'JSON_TEXT', duLieuGame = ?, dapAnChuan = ? WHERE tenDangBai LIKE '%Trắc nghiệm%'`, [tracNghiemData, dapAnChuanTracNghiem]);
    console.log("Updated Trắc Nghiệm lessons.");

    // 4. Điền Khuyết Mặc Định (QuizForm):
    const dienKhuyetData = JSON.stringify({
      loai: "DIEN_KHUYET",
      thanhPhanCauHoi: [{ type: "text", content: "Hãy điền từ thích hợp vào chỗ trống:" }],
      noiDung: "Mùa xuân là mùa bắt đầu của một [blank_1]. Hoa [blank_2] nở rộ khắp nơi."
    });
    const dapAnChuanDienKhuyet = JSON.stringify({ danhSachDapAn: { blank_1: ["năm", "năm mới"], blank_2: ["mai", "đào", "cúc"] } });
    await connection.execute(`UPDATE dang_bai SET loaiNoiDung = 'JSON_TEXT', duLieuGame = ?, dapAnChuan = ? WHERE tenDangBai LIKE '%Điền khuyết%'`, [dienKhuyetData, dapAnChuanDienKhuyet]);
    console.log("Updated Điền Khuyết lessons.");

    console.log("All mock data updated successfully!");
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    if (connection) await connection.end();
  }
}

run();
