import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Users, BookOpen, CheckSquare, Bell, HelpCircle, 
  Maximize2, Phone, Mail, Megaphone, Library, GraduationCap, Award, FileText, MessageSquare, LogOut
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { userService } from '../services/user.service';
import { ticketService } from '../services/ticket.service';
import { cn } from '../lib/utils';
import { useAcademicStore } from '../stores/useAcademicStore';
import { academicService, type NamHoc } from '../services/academic.service';
import { Calendar } from 'lucide-react';

function NavItem({ to, icon: Icon, label, badge }: { to: string, icon: React.ElementType, label: string, badge?: number }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/teacher' && location.pathname.startsWith(to));
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-sm",
        isActive ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("w-5 h-5", isActive ? "text-blue-700" : "text-slate-400")} />
        {label}
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="flex items-center justify-center bg-red-500 text-white font-bold text-[10px] rounded-full px-2 py-0.5 min-w-[20px]">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

function CurrentAcademicInfo() {
  const { currentNamHoc, currentHocKyId } = useAcademicStore();

  useEffect(() => {
    academicService.getCauHinhHeThong().then(cauHinh => {
      academicService.getNamHocs().then(list => {
        const current = list.find((nh) => nh.tenNamHoc === cauHinh.tenNamHocHienTai);
        if (current) {
          useAcademicStore.getState().setCurrentNamHoc(current.tenNamHoc, current.namHocId, current.ngayBatDau);
        }
      });
      useAcademicStore.getState().setCurrentHocKy(cauHinh.hocKyHienTaiId);
    }).catch(console.error);
  }, []);

  return (
    <div className="flex items-center space-x-3 mr-4">
      <div className="flex items-center bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 shadow-sm">
        <Calendar className="w-4 h-4 text-blue-600 mr-2" />
        <span className="text-sm font-bold text-blue-800">
          Học kỳ {currentHocKyId || '-'} • Năm học {currentNamHoc || '...'}
        </span>
      </div>
    </div>
  );
}

export default function TeacherLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);
  
  const [teacherTicketsCount, setTeacherTicketsCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user?.requirePasswordChange) {
      navigate('/force-change-password');
      return;
    }

    if (user && !user.fullName) {
      userService.getMyProfile()
        .then(data => {
          updateUser({ fullName: data.fullName, avatarUrl: data.avatarUrl || undefined });
        })
        .catch(err => console.error("Failed to fetch profile", err));
    }
  }, [user, navigate, updateUser]);

  useEffect(() => {
    const fetchTicketsCount = () => {
      ticketService.getMyTickets()
        .then(tickets => {
          const lastSeenStr = localStorage.getItem('lastSeenTickets');
          const lastSeenTime = lastSeenStr ? parseInt(lastSeenStr, 10) : 0;
          
          const processedCount = tickets.filter((t: any) => {
            const isProcessed = t.status === 'DA_DUYET' || t.status === 'TU_CHOI';
            const timeToCheck = new Date(t.processedAt || t.createdAt).getTime();
            return isProcessed && timeToCheck > lastSeenTime;
          }).length;
          
          setTeacherTicketsCount(processedCount);
        })
        .catch(err => console.error("Failed to fetch teacher tickets", err));
    };

    fetchTicketsCount();
    window.addEventListener('ticketsUpdated', fetchTicketsCount);
    return () => window.removeEventListener('ticketsUpdated', fetchTicketsCount);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans relative">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 shrink-0">
        <div className="p-6 flex items-center justify-center">
          <img 
            src="https://www.titkul.vn/upload/photo/cropped-titkul-logo-header-7055.png" 
            alt="Logo" 
            className="h-10 w-auto object-contain"
          />
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          <NavItem to="/teacher" icon={Home} label="Tổng quan" />
          <NavItem to="/teacher/classes" icon={Users} label="Lớp học của tôi" />
          <NavItem to="/teacher/materials" icon={Library} label="Học liệu" />
        </nav>
        
        {/* Vùng dưới cùng Sidebar */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link 
            to="/teacher/tickets"
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium text-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-slate-400" />
              Hỗ trợ
            </div>
            {teacherTicketsCount > 0 && (
              <span className="flex items-center justify-center bg-red-500 text-white font-bold text-[10px] rounded-full px-2 py-0.5 min-w-[20px]">
                {teacherTicketsCount > 99 ? '99+' : teacherTicketsCount}
              </span>
            )}
          </Link>

          <Link to="/teacher/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0 overflow-hidden border border-blue-200">
               {user?.avatarUrl ? (
                 <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <span className="uppercase">{user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'GV'}</span>
               )}
            </div>
            <div className="text-sm overflow-hidden flex-1">
              <p className="font-semibold text-slate-900 truncate" title={user?.fullName || user?.username}>{user?.fullName || user?.username}</p>
              <p className="text-slate-500 text-xs truncate">Giáo viên</p>
            </div>
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm cursor-pointer group mt-1">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
              Đăng xuất
            </div>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="text-sm text-slate-500 font-medium">Hệ thống Quản lý Giảng dạy</div>
          
          <div className="flex items-center gap-4 relative">
            <CurrentAcademicInfo />
            
            <div className="relative group">
              <button 
                type="button" 
                onClick={() => navigate('/teacher/announcements')}
                className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <Bell className="w-5 h-5" />
              </button>

              {/* Dropdown Thông báo */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-bold text-slate-900">Thông báo</h3>
                  <button type="button" className="text-xs text-blue-600 font-medium hover:underline cursor-pointer">Đã đọc tất cả</button>
                </div>
                <div className="p-8 text-center text-slate-500 text-sm">
                  Chưa có thông báo nào.
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* KHU VỰC CUỘN NỘI DUNG VÀ FOOTER */}
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="p-8 flex-1 max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>

          {/* FOOTER */}
          <footer className="mt-auto px-8 py-6 border-t border-slate-200 bg-white/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} <span className="font-semibold text-slate-700">Titkul Kids</span>. Hệ thống Quản lý Giảng dạy.
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400" /> Hotline: 1900 1234</span>
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-400" /> hotro@titkul.edu.vn</span>
            </div>
          </footer>
        </div>

      </main>
    </div>
  );
}
