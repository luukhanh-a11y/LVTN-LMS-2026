const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const connection = await mysql.createConnection({ user: 'root', password: '', database: 'lms_v2' });
    const [rows] = await connection.execute("SELECT dangBaiId, tenDangBai, loaiNoiDung, duLieuGame, dapAnChuan FROM dang_bai WHERE tenDangBai LIKE '%Các số%' OR tenDangBai LIKE '%So sánh số%' OR tenDangBai LIKE '%Lý thuyết%' OR tenDangBai LIKE '%Tự luận%'");
    
    fs.writeFileSync(path.join(__dirname, 'lessons_check.json'), JSON.stringify(rows, null, 2));
    console.log("Written to lessons_check.json");
    process.exit();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
run();
