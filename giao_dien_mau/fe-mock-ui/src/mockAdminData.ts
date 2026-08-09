export const adminStats = {
  totalStudents: 1250,
  totalTeachers: 45,
  totalClasses: 35,
  pendingTickets: 12,
  systemStatus: 'Hoạt động bình thường',
  lastBackup: '08:00 12/08/2026',
};

export const usersData = [
  { id: 1, name: 'Trần Lê A', email: 'tranlea@school.edu.vn', role: 'Giáo viên', status: 'Hoạt động', lastLogin: '10 phút trước' },
  { id: 2, name: 'Nguyễn Văn B', email: 'nguyenvanb@school.edu.vn', role: 'Học sinh', status: 'Hoạt động', lastLogin: '1 ngày trước' },
  { id: 3, name: 'Lê Thị C', email: 'lethic@school.edu.vn', role: 'Phụ huynh', status: 'Khóa', lastLogin: '1 tháng trước' },
  { id: 4, name: 'Phạm Văn D', email: 'phamvand@school.edu.vn', role: 'Giáo viên', status: 'Hoạt động', lastLogin: '5 phút trước' },
  { id: 5, name: 'Hoàng Thị E', email: 'hoangthie@school.edu.vn', role: 'Học sinh', status: 'Hoạt động', lastLogin: '2 giờ trước' },
];

export const classesData = [
  { id: 1, name: '1A1', grade: 1, studentCount: 35, teacherName: 'Trần Lê A', status: 'Đang học' },
  { id: 2, name: '1A2', grade: 1, studentCount: 34, teacherName: 'Phạm Văn D', status: 'Đang học' },
  { id: 3, name: '2A1', grade: 2, studentCount: 36, teacherName: 'Nguyễn Thị F', status: 'Đang học' },
  { id: 4, name: '3A1', grade: 3, studentCount: 32, teacherName: 'Lê Minh G', status: 'Đang học' },
  { id: 5, name: '5A1', grade: 5, studentCount: 38, teacherName: 'Hoàng Văn H', status: 'Đang học' },
];

export const supportTickets = [
  { id: 101, sender: 'Trần Lê A (GV)', type: 'Reset mật khẩu', description: 'Học sinh Nguyễn Văn B quên mật khẩu, nhờ admin reset giúp.', status: 'Chờ xử lý', date: '10:30 12/08/2026' },
  { id: 102, sender: 'Phạm Văn D (GV)', type: 'Lỗi hệ thống', description: 'Không thấy danh sách học sinh lớp 1A2 trên hệ thống.', status: 'Chờ xử lý', date: '09:15 12/08/2026' },
  { id: 103, sender: 'Lê Minh G (GV)', type: 'Yêu cầu chức năng', description: 'Xin thêm mục thống kê điểm trung bình theo tuần.', status: 'Đã phê duyệt', date: '14:20 11/08/2026' },
  { id: 104, sender: 'Hoàng Thị E (GV)', type: 'Reset mật khẩu', description: 'Xin cấp lại mật khẩu cho học sinh C.', status: 'Đã từ chối', date: '13:00 10/08/2026' },
];

export const adminSettings = {
  schoolName: 'Trường Tiểu Học Hướng Dương',
  schoolYear: '2026 - 2027',
  currentSemester: 'Học kỳ 1',
  isFinalReviewOpen: false,
};
