import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, AlertCircle, Users, GraduationCap, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { teacherService } from '../../services/teacher.service';
import { ticketService } from '../../services/ticket.service';
import { useAcademicStore } from '../../stores/useAcademicStore';

export default function Dashboard() {
  const studentAlerts: any[] = [];
  const [classes, setClasses] = useState<any[]>([]);
  const [ticketCount, setTicketCount] = useState(0);
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { currentHocKyId, selectedNamHocId } = useAcademicStore();

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const cls = await teacherService.getClasses();
        setClasses(cls);
        const tickets = await ticketService.getMyTickets();
        setTicketCount(tickets.length);
        
        // Cố gắng lấy báo cáo buổi sáng
        try {
          const rpt = await teacherService.getMorningReport();
          if (rpt?.summary) {
            setReport(rpt.summary);
          }
        } catch (e) {
          // Bỏ qua lỗi báo cáo buổi sáng nếu API chưa hỗ trợ
        }
      } catch (err) {
        console.error('Lỗi khi tải Dashboard giáo viên:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [currentHocKyId, selectedNamHocId]);

  const recentClasses = classes.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Lớp Chính (Primary): Hero Metrics */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Tổng quan hôm nay</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metric 1 */}
          <Link to="/teacher/classes" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition group block">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium group-hover:text-blue-600 transition">Lớp đang phụ trách</p>
              <p className="text-3xl font-bold text-slate-900">{loading ? '-' : classes.length}</p>
            </div>
          </Link>

          {/* Metric 2: Điểm nhấn màu Cam/Đỏ */}
          <Link to="/teacher/grading" className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 ring-1 ring-orange-50 flex items-center gap-4 hover:shadow-md hover:border-orange-200 transition group block">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium group-hover:text-orange-600 transition">Bài tập chờ chấm</p>
              <p className="text-3xl font-bold text-orange-600">15</p>
            </div>
          </Link>

          {/* Metric 3 */}
          <Link to="/teacher/tickets" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-slate-200 transition group block">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-slate-100 transition">
              <AlertCircle className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium group-hover:text-slate-700 transition">Thông báo hệ thống</p>
              <p className="text-3xl font-bold text-slate-900">{loading ? '-' : ticketCount}</p>
            </div>
          </Link>
        </div>
      </section>

      {/* AI Summary Section */}
      <section>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100/50 flex items-start gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm z-10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="z-10 flex-1">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              AI Tóm tắt buổi sáng
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Beta</span>
            </h3>
            <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">
              {report || "Chào buổi sáng! Hệ thống đang cập nhật báo cáo cho bạn."}
            </p>
          </div>
        </div>
      </section>

      {/* Lớp Phụ (Secondary) và Lớp Thứ cấp (Tertiary) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cột trái (Chiếm 2/3): Phân công giảng dạy (Thay thế cho Lịch dạy) */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Phân công giảng dạy</h2>
            <Link to="/teacher/classes" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {recentClasses.map((cls) => (
                <Link
                  to={`/teacher/classes/${cls.id}`}
                  state={{ isHomeroom: cls.role === 'Giáo viên chủ nhiệm', className: cls.name }}
                  key={cls.id}
                  className="p-4 hover:bg-slate-50 flex items-center justify-between transition-colors group cursor-pointer block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      {cls.role === 'Giáo viên chủ nhiệm' ? <GraduationCap className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{cls.name}</p>
                      <p className="text-sm text-slate-500">{cls.grade && `Khối ${cls.grade}`} • {cls.role}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Users className="w-4 h-4 text-slate-400" /> {cls.students || 0} học sinh
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Cột phải (Chiếm 1/3): Cảnh báo học sinh */}
        <section className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Cần lưu ý</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
            {studentAlerts.map((alert) => (
              <div key={alert.id} className="flex gap-3 items-start">
                <div className="mt-0.5 shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {alert.name} <span className="text-slate-500 font-medium">({alert.className})</span>
                  </p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{alert.issue}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
