export const dashboardData = {
  heroMetrics: {
    totalClasses: 5,
    pendingGrades: 32,
    systemAlerts: 2,
  },
  todaySchedule: [
    { id: 1, time: '07:30 - 09:00', className: 'Toán 10A1', room: 'Phòng 302', type: 'Chính khóa' },
    { id: 2, time: '09:15 - 10:45', className: 'Toán 10A2', room: 'Phòng 305', type: 'Chính khóa' },
    { id: 3, time: '13:30 - 15:00', className: 'Bồi dưỡng HSG', room: 'Phòng Lab 1', type: 'Ngoại khóa' },
  ],
  studentAlerts: [
    { id: 1, name: 'Nguyễn Văn A', className: 'Toán 10A1', issue: 'Chưa nộp 3 bài tập liên tiếp' },
    { id: 2, name: 'Trần Thị B', className: 'Toán 10A2', issue: 'Tiến độ học tập tuần này dưới 20%' },
  ]
};

// Thêm vào cuối file src/mockData.ts

// Sửa lại biến gradingData trong src/mockData.ts

export const gradingData = {
  students: [
    { id: 1, name: 'Nguyễn Văn A', status: 'CHUA_CHAM', time: 'Nộp 10 phút trước', type: 'TRAC_NGHIEM' },
    { id: 2, name: 'Trần Thị B', status: 'DA_CHAM', time: 'Nộp 1 giờ trước', score: 9, type: 'TU_LUAN' },
  ],
  // Giả lập dữ liệu fetch từ API dựa theo học sinh được chọn
  submissions: {
    1: {
      type: 'TRAC_NGHIEM',
      cauHinh: {
        loai: 'TRAC_NGHIEM',
        cauHoi: 'Khẳng định nào sau đây là đúng về Hàm số bậc 2?',
        luaChon: [
          { id: 'A', noiDung: 'Đồ thị luôn là một đường thẳng.' },
          { id: 'B', noiDung: 'Đồ thị là một đường Parabol.' }
        ],
        dapAnDungId: 'B'
      },
      chiTietBaiLam: { dapAnDaChonId: 'B' },
      diemTuDong: 10
    },
    2: {
      type: 'TU_LUAN',
      noiDungText: 'Thưa cô, theo em hiểu thì hàm số bậc 2 có dạng tổng quát là y = ax^2 + bx + c (với a khác 0). Đồ thị của hàm số này là một đường Parabol. Nếu a > 0 thì bề lõm hướng lên trên, còn nếu a < 0 thì bề lõm hướng xuống dưới ạ.',
      fileDinhKem: 'BaiTap_TranThiB.pdf',
      diemTuDong: null // Tự luận không có điểm tự động
    }
  }
};


export const assignmentListData = [
  { 
    id: 1, 
    title: 'Bài kiểm tra 15 phút Đại số', 
    className: 'Toán 10A1', 
    subject: 'Toán học', 
    deadline: '2026-10-15T23:59:00',
    deadlineText: '15/10/2026 23:59', 
    status: 'DANG_MO', 
    submitted: 42, 
    total: 45 
  },
  { 
    id: 2, 
    title: 'Bài tập về nhà: Hàm số bậc 2', 
    className: 'Toán 10A2', 
    subject: 'Toán học', 
    deadline: '2026-10-10T23:59:00',
    deadlineText: '10/10/2026 23:59', 
    status: 'DA_DONG', 
    submitted: 45, 
    total: 45 
  },
  { 
    id: 3, 
    title: 'Thực hành hình học không gian', 
    className: 'Toán 11B1', 
    subject: 'Toán học', 
    deadline: '2026-10-20T17:00:00',
    deadlineText: '20/10/2026 17:00', 
    status: 'DANG_MO', 
    submitted: 12, 
    total: 40 
  },
  { 
    id: 4, 
    title: 'Ôn tập chương 1', 
    className: 'Toán 10A1', 
    subject: 'Toán học', 
    deadline: '2026-09-30T23:59:00',
    deadlineText: '30/09/2026 23:59', 
    status: 'DA_DONG', 
    submitted: 40, 
    total: 45 
  },
];

// Thêm vào cuối file src/mockData.ts

export const myClassesData = [
  { 
    id: 1, 
    name: 'Toán 10A1', 
    subject: 'Toán học', 
    semester: 'Học kỳ 1 - 2026', 
    studentsCount: 45, 
    role: 'Giáo viên chủ nhiệm' // Lớp chủ nhiệm
  },
  { 
    id: 2, 
    name: 'Toán 10A2', 
    subject: 'Toán học', 
    semester: 'Học kỳ 1 - 2026', 
    studentsCount: 42, 
    role: 'Giáo viên bộ môn' 
  },
  { 
    id: 3, 
    name: 'Toán 11B1', 
    subject: 'Toán học', 
    semester: 'Học kỳ 1 - 2026', 
    studentsCount: 40, 
    role: 'Giáo viên bộ môn' 
  },
];

// Thêm vào cuối file src/mockData.ts

export const classStudentsData = [
  { id: 1, name: 'Nguyễn Văn A', dob: '15/03/2011', avgScore: 8.5, conduct: 'Tốt', academic: 'Giỏi', result: 'LEN_LOP' },
  { id: 2, name: 'Trần Thị B', dob: '22/07/2011', avgScore: 6.2, conduct: 'Khá', academic: 'Trung bình', result: 'LEN_LOP' },
  { id: 3, name: 'Lê Hoàng C', dob: '05/11/2011', avgScore: 4.5, conduct: 'Trung bình', academic: 'Yếu', result: 'O_LAI_LOP' },
  { id: 4, name: 'Phạm Thị D', dob: '10/01/2011', avgScore: 9.2, conduct: 'Tốt', academic: 'Giỏi', result: 'LEN_LOP' },
  { id: 5, name: 'Đỗ Văn E', dob: '19/09/2011', avgScore: 7.8, conduct: 'Tốt', academic: 'Khá', result: 'LEN_LOP' },
];

// Thêm vào cuối file src/mockData.ts

export const teacherProfileData = {
  id: 'GV10042',
  fullName: 'Trần Lê A',
  email: 'tranlea.gv@eduteacher.edu.vn',
  phone: '0901234567',
  dob: '1985-05-15',
  gender: 'Nam',
  department: 'Tổ Toán - Tin',
  role: 'Giáo viên bộ môn',
  joinDate: '15/08/2015',
  avatarUrl: '' // Để trống để dùng avatar chữ mặc định
};

// Thêm vào cuối file src/mockData.ts

export const notificationsData = [
  { 
    id: 1, 
    type: 'assignment', 
    title: 'Có bài nộp mới', 
    desc: 'Học sinh Nguyễn Văn A vừa nộp Bài kiểm tra 15 phút.', 
    time: '5 phút trước', 
    isRead: false 
  },
  { 
    id: 2, 
    type: 'system', 
    title: 'Bảo trì hệ thống', 
    desc: 'Hệ thống sẽ tạm ngưng từ 00:00 đến 02:00 đêm nay.', 
    time: '2 giờ trước', 
    isRead: false 
  },
  { 
    id: 3, 
    type: 'grading', 
    title: 'Nhắc nhở chấm bài', 
    desc: 'Lớp Toán 10A1 còn 32 bài tập chưa chấm.', 
    time: '1 ngày trước', 
    isRead: true 
  },
];
// Thêm vào cuối file src/mockData.ts

export const gradebookData = [
  { id: 1, name: 'Nguyễn Văn A', hs1: [8, 9, 8.5], hs2: [8.5], dtb: 8.5, status: 'Đạt' },
  { id: 2, name: 'Trần Thị B', hs1: [6, 7], hs2: [6.5, 7], dtb: 6.6, status: 'Đạt' },
  { id: 3, name: 'Lê Hoàng C', hs1: [5, 4, 6], hs2: [4.5], dtb: 4.8, status: 'Nguy cơ' },
  { id: 4, name: 'Phạm Thị D', hs1: [9, 10], hs2: [9.5], dtb: 9.6, status: 'Đạt' },
  { id: 5, name: 'Đỗ Văn E', hs1: [7, 8, 7.5], hs2: [8], dtb: 7.6, status: 'Đạt' },
];
// Thêm vào cuối file src/mockData.ts

export const badgesData = [
  { id: 'badge_1', name: 'Nỗ lực vượt bậc', icon: '🌟', desc: 'Dành cho học sinh có sự cố gắng lớn.', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'badge_2', name: 'Tư duy sáng tạo', icon: '💡', desc: 'Cách giải quyết vấn đề độc đáo.', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'badge_3', name: 'Điểm tuyệt đối', icon: '🎯', desc: 'Hoàn thành xuất sắc 100% bài làm.', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'badge_4', name: 'Tiến bộ rõ rệt', icon: '📈', desc: 'Có sự cải thiện so với bài trước.', color: 'bg-green-100 text-green-700 border-green-200' },
];

export const sentAnnouncementsData = [
  {
    id: 1,
    title: 'Nghỉ học thứ 6 tuần này do bão',
    target: 'Tất cả các lớp',
    content: 'Các em chú ý ở nhà tự ôn tập, không ra ngoài khi có bão. Bài tập cô đã giao trên hệ thống.',
    time: '2 ngày trước',
    views: 120,
    file: null,
  },
  {
    id: 2,
    title: 'Tài liệu tham khảo môn Toán học kỳ 1',
    target: 'Toán 10A1, Toán 10A2',
    content: 'Gửi các em tài liệu ôn tập giữa kỳ, các em tải về và làm trước bài 1 đến bài 5.',
    time: '5 ngày trước',
    views: 85,
    file: 'TaiLieuOnTap_Toan10.pdf',
  }
];

export const materialsData = {
  grades: [
    { id: 'g10', name: 'Khối 10' },
    { id: 'g11', name: 'Khối 11' },
    { id: 'g12', name: 'Khối 12' }
  ],
  books: [
    { id: 'b1', name: 'Toán 10 - Kết nối tri thức' },
    { id: 'b2', name: 'Toán 10 - Chân trời sáng tạo' }
  ],
  topics: [
    { id: 't1', bookId: 'b1', name: 'Chương 1: Mệnh đề và tập hợp' },
    { id: 't2', bookId: 'b1', name: 'Chương 2: Bất phương trình' }
  ],
  lessons: [
    { id: 'l1', topicId: 't2', name: 'Bài 3: Bất phương trình bậc nhất hai ẩn' },
    { id: 'l2', topicId: 't2', name: 'Bài 4: Hệ bất phương trình bậc nhất hai ẩn' }
  ],
  questions: [
    { 
      id: 'q1', lessonId: 'l2', type: 'TRAC_NGHIEM', 
      content: 'Miền nghiệm của bất phương trình x + y > 0 là gì?',
      level: 'Nhận biết',
      uiMode: ['Mặc định', 'Game Giải cứu']
    },
    { 
      id: 'q2', lessonId: 'l2', type: 'NOI_CAP', 
      content: 'Nối các hệ bất phương trình với hình ảnh đồ thị tương ứng.',
      level: 'Vận dụng',
      uiMode: ['Mặc định', 'Game Đua xe']
    },
    { 
      id: 'q3', lessonId: 'l2', type: 'TU_LUAN', 
      content: 'Giải hệ bất phương trình sau và biểu diễn miền nghiệm trên mặt phẳng tọa độ.',
      level: 'Vận dụng cao',
      uiMode: ['Mặc định']
    }
  ]
};