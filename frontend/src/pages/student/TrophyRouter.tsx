import { useEffect, useState } from 'react';
import { studentService } from '../../services/student.service';
import StudentTrophyJunior from './StudentTrophyJunior';
import StudentTrophySenior from './StudentTrophySenior';

export default function TrophyRouter() {
  const [grade, setGrade] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const dashboardData = await studentService.getDashboard();
        const className = dashboardData.className || '';
        const gradeLevel = parseInt(className.charAt(0)) || 2; 
        setGrade(gradeLevel);
      } catch (error) {
        console.error("Lỗi lấy thông tin dashboard:", error);
        setGrade(2); // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-pro text-slate-500">Đang tải Tủ Quà...</div>;
  }

  // Nếu là học sinh lớp 1, hiển thị giao diện có thiết kế trẻ em
  if (grade === 1) {
    return <StudentTrophyJunior />;
  }

  // Các lớp khác hiển thị giao diện Bento Premium
  return <StudentTrophySenior />;
}
