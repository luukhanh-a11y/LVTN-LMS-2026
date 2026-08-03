import { Users, BookOpen, UserCheck, AlertCircle } from 'lucide-react';

export const adminKpis = [
  { title: 'Giáo viên hoạt động', value: '45', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
  { title: 'Học sinh đang học', value: '1,250', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  { title: 'Phụ huynh liên kết', value: '1,120', icon: UserCheck, color: 'text-green-500', bg: 'bg-green-100' },
  { title: 'Tài khoản vô hiệu', value: '12', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
];

export const adminClasses = [
  { id: 1, name: 'Lớp 5A', grade: 5, teacher: 'Nguyễn Văn A', students: 35, max: 40, status: 'ACTIVE' },
  { id: 2, name: 'Lớp 3B', grade: 3, teacher: 'Trần Thị B', students: 40, max: 40, status: 'ACTIVE' },
  { id: 3, name: 'Lớp 5C (Cũ)', grade: 5, teacher: '-', students: 0, max: 40, status: 'DONG_BANG' },
];

export const adminImportErrors = [
  { row: 2, studentName: 'Nguyễn Văn A', parentPhone: '0901234567', error: 'Trống trường ngày sinh' },
  { row: 5, studentName: 'Trần Thị B', parentPhone: '0987654321', error: 'Trùng lặp mã định danh HS2026001' },
  { row: 12, studentName: 'Lê Hoàng C', parentPhone: '090111222', error: 'Sai định dạng ngày sinh (DD/MM/YYYY)' },
];

export const adminSubjects = ['Toán học', 'Tiếng Việt', 'Lịch sử', 'Địa lý', 'Khoa học', 'Tiếng Anh'];
export const adminGrades = ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'];

export const adminTickets = [
  { id: 1, student: 'Nguyễn Văn An (HS2026001)', teacher: 'Trần Thị B', reason: 'Quên mật khẩu', status: 'CHO_DUYET', date: 'Vừa xong' },
  { id: 2, student: 'Lê Hoàng C (HS2026005)', teacher: 'Trần Thị B', reason: 'Lỗi đăng nhập', status: 'DA_DUYET', date: '1 ngày trước' },
];

export const adminTeachers = [
  { id: 1, name: 'Nguyễn Văn A', username: 'GV0901234567', phone: '0901234567', status: 'ACTIVE', isDefaultPwd: false },
  { id: 2, name: 'Trần Thị B', username: 'GV0987654321', phone: '0987654321', status: 'ACTIVE', isDefaultPwd: true },
];

export const adminStudents = [
  { id: 1, name: 'Lê Hoàng Cường', username: 'HS2026001', class: 'Lớp 5A', status: 'ACTIVE' },
  { id: 2, name: 'Nguyễn Thị D', username: 'HS2026002', class: 'Lớp 5A', status: 'ACTIVE' },
];

export const adminParents = [
  { id: 1, name: 'Lê Văn C (Bố)', username: 'PH090111222', phone: '090111222', children: 'Lê Hoàng Cường (Lớp 5A)', status: 'ACTIVE' },
];
