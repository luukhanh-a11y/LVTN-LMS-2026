import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import StudentDashboard from './StudentDashboard';
import StudentDashboardSenior from './StudentDashboardSenior';

export default function DashboardRouter() {
  const [grade, setGrade] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const dashboardData = await studentService.getDashboard();
        // Giả sử className là '1A', '2B', etc.
        const className = dashboardData.className || '';
        const gradeLevel = parseInt(className.charAt(0)) || 2; // Mặc định là lớp 2 nếu không parse được
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
    return <div className="flex h-screen items-center justify-center">Đang tải...</div>;
  }

  // Nếu là học sinh lớp 1, hiển thị giao diện có Cú Mèo
  if (grade === 1) {
    return <StudentDashboard />;
  }

  // Các lớp khác hiển thị giao diện mặc định
  return <StudentDashboardSenior />;
}
