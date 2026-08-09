export const parentProfile = {
  id: 1,
  name: 'Nguyễn Văn Phụ Huynh',
  phone: '0901234567',
  email: 'phuhuynh@example.com',
  relation: 'Cha'
};

export const childrenData = [
  {
    id: 101,
    name: 'Nguyễn Văn Bé Bi',
    class: '1A1',
    school: 'Trường Tiểu Học Hướng Dương',
    avatar: 'BB',
    color: 'bg-blue-600'
  },
  {
    id: 102,
    name: 'Nguyễn Thị Bông',
    class: '3A2',
    school: 'Trường Tiểu Học Hướng Dương',
    avatar: 'TB',
    color: 'bg-emerald-500'
  }
];

export const learningProgressData = {
  101: [
    { id: 1, subject: 'Toán học', lesson: 'Phép cộng trong phạm vi 10', progress: 100, isCompleted: true, timeSpent: '45 phút' },
    { id: 2, subject: 'Tiếng Việt', lesson: 'Tập đọc: Trường em', progress: 80, isCompleted: false, timeSpent: '20 phút' },
    { id: 3, subject: 'Tự nhiên Xã hội', lesson: 'Các bộ phận cơ thể', progress: 0, isCompleted: false, timeSpent: '0 phút' }
  ],
  102: [
    { id: 4, subject: 'Toán học', lesson: 'Bảng nhân 3', progress: 100, isCompleted: true, timeSpent: '30 phút' },
    { id: 5, subject: 'Tiếng Anh', lesson: 'Unit 2: My family', progress: 100, isCompleted: true, timeSpent: '40 phút' },
  ]
};

export const gradesData = {
  101: {
    semester: 'Học kỳ 1 - 2026',
    subjects: [
      { id: 1, name: 'Toán học', scoreHomework: 9.5, scoreSelfStudy: 9.0, finalScore: 9.3 },
      { id: 2, name: 'Tiếng Việt', scoreHomework: 8.0, scoreSelfStudy: 8.5, finalScore: 8.3 },
      { id: 3, name: 'Tiếng Anh', scoreHomework: 10, scoreSelfStudy: 9.5, finalScore: 9.8 }
    ],
    finalResult: {
      academic: 'TỐT',
      conduct: 'TỐT',
      decision: 'LÊN LỚP',
      teacher: 'Trần Lê A',
      note: 'Học sinh ngoan, tiếp thu bài nhanh.'
    }
  },
  102: {
    semester: 'Học kỳ 1 - 2026',
    subjects: [
      { id: 4, name: 'Toán học', scoreHomework: 7.5, scoreSelfStudy: 8.0, finalScore: 7.8 },
      { id: 5, name: 'Tiếng Anh', scoreHomework: 8.5, scoreSelfStudy: 8.5, finalScore: 8.5 }
    ],
    finalResult: {
      academic: 'KHÁ',
      conduct: 'TỐT',
      decision: 'LÊN LỚP',
      teacher: 'Nguyễn Thị B',
      note: 'Cần chú ý hơn ở môn Toán.'
    }
  }
};

export const badgesData = {
  101: [
    { id: 1, name: 'Chăm ngoan', date: '10/08/2026', teacher: 'Trần Lê A', message: 'Con làm bài tập về nhà đầy đủ!', icon: '🌟', color: 'bg-yellow-100 text-yellow-600' },
    { id: 2, name: 'Sáng tạo', date: '05/08/2026', teacher: 'Trần Lê A', message: 'Cách giải toán rất thông minh.', icon: '💡', color: 'bg-blue-100 text-blue-600' }
  ],
  102: [
    { id: 3, name: 'Giúp đỡ bạn', date: '01/08/2026', teacher: 'Nguyễn Thị B', message: 'Con đã hướng dẫn bạn làm bài.', icon: '🤝', color: 'bg-emerald-100 text-emerald-600' }
  ]
};
