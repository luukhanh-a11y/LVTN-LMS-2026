const mysql = require('mysql2/promise');

async function run() {
  let connection;
  try {
    connection = await mysql.createConnection({ user: 'root', password: '', database: 'lms_v2' });
    console.log("Connected to database. Fixing lessons...");

    // 1. Fix "Các số 0, 1, 2..." and "So sánh số" back to TRAC_NGHIEM (Multiple Choice)
    const tracNghiemData = JSON.stringify({
      loai: "TRAC_NGHIEM",
      noiDung: "Em hãy chọn đáp án đúng nhất cho câu hỏi dưới đây:",
      thanhPhanCauHoi: [{ type: "text", content: "Trong các số sau, số nào lớn nhất?" }],
      danhSachLuaChon: [
        { id: "A", loai: "text", noiDung: "Số 5" },
        { id: "B", loai: "text", noiDung: "Số 8" },
        { id: "C", loai: "text", noiDung: "Số 2" },
        { id: "D", loai: "text", noiDung: "Số 10" }
      ]
    });
    const dapAnChuan = JSON.stringify({ dapAnDungId: "D" });
    await connection.execute(
      `UPDATE dang_bai SET loaiNoiDung = 'JSON_TEXT', duLieuGame = ?, dapAnChuan = ? WHERE tenDangBai LIKE '%Các số%' OR tenDangBai LIKE '%So sánh số%'`, 
      [tracNghiemData, dapAnChuan]
    );
    console.log("Updated 'Các số...' and 'So sánh số' to TRAC_NGHIEM (Multiple choice).");

    // 2. Fix NOI_CAP without a game interface
    const [noiCapRows] = await connection.execute(`SELECT dangBaiId, duLieuGame FROM dang_bai WHERE duLieuGame LIKE '%"loai":"NOI_CAP"%' OR duLieuGame LIKE '%"loai": "NOI_CAP"%'`);
    
    for (const row of noiCapRows) {
      let dl = {};
      try {
        dl = JSON.parse(row.duLieuGame);
      } catch(e) {}
      
      // If it's NOI_CAP but has no giaoDien, assign NOI_CAP_LINE
      if (dl.loai === 'NOI_CAP' && !dl.giaoDien) {
        dl.giaoDien = 'NOI_CAP_LINE'; // Fallback to Matching Game
        
        // Ensure it has data to play the matching game
        if (!dl.danhSachNoiCap || dl.danhSachNoiCap.length === 0) {
           dl.danhSachNoiCap = [
             { id: "pair1", left: { type: "text", content: "A" }, right: { type: "text", content: "a" } },
             { id: "pair2", left: { type: "text", content: "B" }, right: { type: "text", content: "b" } },
             { id: "pair3", left: { type: "text", content: "C" }, right: { type: "text", content: "c" } }
           ];
        }
        
        await connection.execute(`UPDATE dang_bai SET duLieuGame = ? WHERE dangBaiId = ?`, [JSON.stringify(dl), row.dangBaiId]);
        
        // Update dapAnChuan for NOI_CAP_LINE
        const dapAnChuanNC = JSON.stringify({
          danhSachNoiCap: [
             { leftId: "pair1", rightId: "pair1" },
             { leftId: "pair2", rightId: "pair2" },
             { leftId: "pair3", rightId: "pair3" }
          ]
        });
        await connection.execute(`UPDATE dang_bai SET dapAnChuan = ? WHERE dangBaiId = ?`, [dapAnChuanNC, row.dangBaiId]);
        console.log(`Fixed NOI_CAP lesson ID: ${row.dangBaiId} -> Attached NOI_CAP_LINE game.`);
      }
    }

    console.log("All data fixed successfully!");
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    if (connection) await connection.end();
  }
}

run();
