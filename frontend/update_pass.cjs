const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs'); // Assuming frontend has bcryptjs

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lms1'
  });

  const hashed = await bcrypt.hash('123456', 10);
  await connection.execute('UPDATE nguoi_dung SET mat_khau_hash = ? WHERE ten_dang_nhap = "gv_an"', [hashed]);
  console.log("Password updated for gv_an");
  await connection.end();
}
main().catch(console.error);
