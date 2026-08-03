import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Settings, BookOpen,
  FileText, Award, Bell, Upload, ShieldCheck, MessageSquare, Repeat, ListChecks, GraduationCap,
  type LucideIcon
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useParentContextStore } from '../stores/useParentContextStore';
import { userService } from '../services/user.service';
import { ticketService } from '../services/ticket.service';
import { cn } from '../lib/utils';

type Role = 'admin' | 'teacher' | 'parent';

export default function DashboardLayout({ role }: { role: Role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const selectedChild = useParentContextStore((state) => state.selectedChild);
  const childContextResolved = useParentContextStore((state) => state.resolved);
  const clearSelectedChild = useParentContextStore((state) => state.clearSelectedChild);

  const [pendingTicketsCount, setPendingTicketsCount] = useState(0);
  const [teacherTicketsCount, setTeacherTicketsCount] = useState(0);

  useEffect(() => {
    if (user?.requirePasswordChange) {
      navigate('/force-change-password');
      return;
    }

    if (role === 'parent' && !childContextResolved) {
      navigate('/select-child');
      return;
    }

    if (user && !user.fullName) {
      userService.getMyProfile()
        .then(data => {
          updateUser({ fullName: data.fullName, avatarUrl: data.avatarUrl || undefined });
        })
        .catch(err => console.error("Failed to fetch profile", err));
    }
  }, [user, navigate, updateUser, role, childContextResolved]);

  const handleSwitchChild = () => {
    clearSelectedChild();
    navigate('/select-child');
  };

  useEffect(() => {
    const fetchTicketsCount = () => {
      if (role === 'admin') {
        ticketService.getPendingTickets()
          .then(tickets => {
            // Count only pending tickets (CHO_DUYET)
            const pendingCount = tickets.filter((t: any) => t.status === 'CHO_DUYET').length;
            setPendingTicketsCount(pendingCount);
          })
          .catch(err => console.error("Failed to fetch tickets", err));
      } else if (role === 'teacher') {
        ticketService.getMyTickets()
          .then(tickets => {
            const lastSeenStr = localStorage.getItem('lastSeenTickets');
            const lastSeenTime = lastSeenStr ? parseInt(lastSeenStr, 10) : 0;
            
            // Hiển thị thông báo cho các phiếu đã được xử lý (DA_DUYET hoặc TU_CHOI) VÀ chưa được xem
            const processedCount = tickets.filter((t: any) => {
              const isProcessed = t.status === 'DA_DUYET' || t.status === 'TU_CHOI';
              const timeToCheck = new Date(t.processedAt || t.createdAt).getTime();
              return isProcessed && timeToCheck > lastSeenTime;
            }).length;
            
            setTeacherTicketsCount(processedCount);
          })
          .catch(err => console.error("Failed to fetch teacher tickets", err));
      }
    };

    fetchTicketsCount();

    window.addEventListener('ticketsUpdated', fetchTicketsCount);
    return () => window.removeEventListener('ticketsUpdated', fetchTicketsCount);
  }, [role]);

  interface NavItem {
    name: string;
    path: string;
    icon: LucideIcon;
    badge?: number;
  }

  const navItems: Record<Role, NavItem[]> = {
    admin: [
      { name: 'Tổng quan', path: '/admin', icon: LayoutDashboard },
      { name: 'Tài khoản', path: '/admin/users', icon: Users },
      { name: 'Phiếu hỗ trợ', path: '/admin/tickets', icon: Bell, badge: pendingTicketsCount },
      { name: 'Import dữ liệu', path: '/admin/import', icon: Upload },
      { name: 'Lớp học', path: '/admin/classes', icon: BookOpen },
      { name: 'Soạn quiz bộ sách', path: '/admin/quiz-authoring', icon: ListChecks },
      { name: 'Kết quả cuối năm', path: '/admin/ket-qua-cuoi-nam', icon: GraduationCap },
      { name: 'Cấu hình', path: '/admin/settings', icon: Settings },
    ],
    teacher: [
      { name: 'Tổng quan', path: '/teacher', icon: LayoutDashboard },
      { name: 'Lớp học', path: '/teacher/classes', icon: Users },
      { name: 'Bảng tin', path: '/teacher/announcements', icon: Bell },
      { name: 'Kho học liệu', path: '/teacher/materials', icon: BookOpen },
      { name: 'Soạn quiz bộ sách', path: '/teacher/quiz-authoring', icon: ListChecks },
      { name: 'Xét lên lớp', path: '/teacher/ket-qua-cuoi-nam', icon: GraduationCap },
      { name: 'Giao bài tập', path: '/teacher/assignments', icon: FileText },
      { name: 'Chấm bài', path: '/teacher/grading', icon: Award },
      { name: 'Sổ điểm', path: '/teacher/reports', icon: FileText },
      { name: 'Phiếu hỗ trợ', path: '/teacher/tickets', icon: MessageSquare, badge: teacherTicketsCount },
    ],
    parent: [
      { name: 'Tổng quan', path: '/parent', icon: LayoutDashboard },
      { name: 'Hồ sơ con', path: '/parent/children', icon: Users },
      { name: 'Bài tập', path: '/parent/assignments', icon: FileText },
      { name: 'Thông báo', path: '/parent/notifications', icon: Bell },
      { name: 'Thành tích', path: '/parent/rewards', icon: Award },
      { name: 'Bảng điểm', path: '/parent/grades', icon: Award },
      { name: 'Tiến trình', path: '/parent/subject-tree', icon: BookOpen },
    ]
  };

  const items = navItems[role];

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex font-pro">
      {/* Sidebar - Premium Minimalist */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6">
          <Link to={`/${role}`} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">T</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Titkul Kids</span>
          </Link>
          
          <div className="mt-8 flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
               {user?.avatarUrl ? (
                 <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <ShieldCheck className="w-5 h-5 text-indigo-600" />
               )}
             </div>
             <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-slate-900 truncate" title={user?.fullName || user?.username}>{user?.fullName || user?.username || 'User'}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {role === 'admin' ? 'Quản trị viên' : role === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}
                </span>
             </div>
          </div>

          {role === 'parent' && selectedChild && (
            <button
              onClick={handleSwitchChild}
              className="mt-3 w-full flex items-center justify-between px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-all group"
            >
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Đang xem</span>
                <span className="text-sm font-bold text-indigo-700 truncate max-w-[140px]" title={selectedChild.name}>{selectedChild.name}</span>
              </div>
              <span className="flex items-center text-xs font-bold text-indigo-600 group-hover:text-indigo-800">
                <Repeat className="w-3.5 h-3.5 mr-1" /> Đổi hồ sơ
              </span>
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Menu chính</div>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== `/${role}` && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3.5 text-[15px] font-semibold rounded-xl transition-all group relative active:scale-[0.98]",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-r-full" />
                )}
                <Icon className={cn(
                  "mr-3.5 h-5 w-5 transition-colors",
                  isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                {item.name}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute right-4 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
          <Link 
            to={`/${role}/profile`} 
            className="flex items-center px-4 py-3 text-[15px] font-semibold rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 transition-all hover:shadow-sm active:scale-[0.98]"
          >
            <Settings className="mr-3.5 h-5 w-5 text-slate-400" />
            Cài đặt hồ sơ
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 min-h-[100dvh] relative">
        <div className="max-w-[1400px] mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
