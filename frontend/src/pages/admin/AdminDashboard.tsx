import { Users, GraduationCap, School, Ticket, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service';

function StatCard({ title, value, icon: Icon, color, to }: { title: string, value: string | number, icon: React.ElementType, color: string, to: string }) {
  return (
    <Link to={to} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer group">
      <div className={`p-4 rounded-xl ${color} flex-shrink-0`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition">{value}</h3>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    pendingTickets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        if (data) {
          setStats({
            totalStudents: data.totalStudents || 0,
            totalTeachers: data.totalTeachers || 0,
            totalClasses: data.totalClasses || 0,
            pendingTickets: data.pendingTickets || 0,
          });
        }
      } catch (error) {
        console.error('Lỗi khi tải thống kê Dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tổng quan Hệ thống</h2>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Đang cập nhật dữ liệu...' : 'Dữ liệu được cập nhật tự động'}
          </p>
        </div>
        <div className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
          <TrendingUp className="w-4 h-4" /> Hệ thống ổn định
        </div>
      </div>

      {/* THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          to="/admin/users"
          title="Học sinh" 
          value={stats.totalStudents} 
          icon={Users} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          to="/admin/users"
          title="Giáo viên" 
          value={stats.totalTeachers} 
          icon={GraduationCap} 
          color="bg-purple-50 text-purple-600" 
        />
        <StatCard 
          to="/admin/classes"
          title="Lớp học" 
          value={stats.totalClasses} 
          icon={School} 
          color="bg-emerald-50 text-emerald-600" 
        />
        <StatCard 
          to="/admin/support"
          title="Yêu cầu chờ duyệt" 
          value={stats.pendingTickets} 
          icon={Ticket} 
          color="bg-orange-50 text-orange-600" 
        />
      </div>

      {/* CẢNH BÁO / HOẠT ĐỘNG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" /> Cảnh báo hệ thống
            </h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex items-start gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 shrink-0"></div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Có 12 học sinh chưa được phân lớp</p>
                <p className="text-xs text-slate-500 mt-1">Vui lòng kiểm tra lại danh sách Import gần đây.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3 text-slate-500">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-300 shrink-0"></div>
              <p className="text-sm">Không có cảnh báo dung lượng máy chủ.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Hoạt động gần đây</h3>
          </div>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {/* Timeline item */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-blue-500 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10"></div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-sm">Import Giáo viên</span>
                  <span className="text-xs text-slate-400">10:30</span>
                </div>
                <div className="text-xs text-slate-500">Admin đã import thành công 10 giáo viên.</div>
              </div>
            </div>
            
            {/* Timeline item */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-slate-200 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10"></div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-sm">Tạo Lớp học</span>
                  <span className="text-xs text-slate-400">09:15</span>
                </div>
                <div className="text-xs text-slate-500">Lớp 1A1 được khởi tạo.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
