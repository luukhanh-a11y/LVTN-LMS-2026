import * as XLSX from 'xlsx';
import fs from 'fs';

const data = [
  ['Lớp', 'Mã HS', 'Tên HS', 'Ngày sinh', 'Tên PH', 'SĐT PH', 'Email PH'],
  ['4A1', 'HS4A1_01', 'Nguyễn Văn A', '2016-01-01', 'Nguyễn Văn Bố', '0901234567', 'boA@example.com'],
  ['4A1', 'HS4A1_02', 'Trần Thị B', '2016-02-02', 'Trần Văn Phụ', '0901234568', 'phuB@example.com'],
  ['4A2', 'HS4A2_01', 'Lê C', '2016-03-03', 'Lê Văn Ba', '0901234569', 'baC@example.com'],
  ['5A', 'HS5A_01', 'Phạm D', '2015-04-04', 'Phạm Mẹ', '0901234570', 'meD@example.com']
];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
fs.writeFileSync('Sample_Import_HS.xlsx', buffer);
console.log('Created Sample_Import_HS.xlsx');
