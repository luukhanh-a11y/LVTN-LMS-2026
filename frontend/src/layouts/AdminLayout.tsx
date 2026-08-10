import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Ticket, Settings, LogOut, ShieldCheck, Bell, AlertCircle, FileText } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { userService } from '../services/user.service';
import { ticketService } from '../services/ticket.service';
import { cn } from '../lib/utils';
import { useAcademicStore } from '../stores/useAcademicStore';
import { academicService, type NamHoc } from '../services/academic.service';
import { Calendar } from 'lucide-react';

function NavItem({ to, icon: Icon, label, badge }: { to: string, icon: React.ElementType, label: string, badge?: number }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
  
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

function AcademicYearSelector() {
  const { selectedNamHocId, setNamHoc, isReadOnly } = useAcademicStore();
  const [namHocs, setNamHocs] = useState<NamHoc[]>([]);

  useEffect(() => {
    academicService.getNamHocs().then((list) => {
      setNamHocs(list);
      academicService.getCauHinhHeThong().then(cauHinh => {
        const current = list.find((nh) => nh.tenNamHoc === cauHinh.tenNamHocHienTai);
        if (current) {
          useAcademicStore.getState().setCurrentNamHoc(current.tenNamHoc, current.namHocId, current.ngayBatDau);
        }
        useAcademicStore.getState().setCurrentHocKy(cauHinh.hocKyHienTaiId);
      }).catch(console.error);
    }).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const nh = namHocs.find((n) => n.namHocId === id);
    if (nh) setNamHoc(nh.tenNamHoc, nh.namHocId, nh.ngayBatDau);
  };

  return (
    <div className="flex items-center space-x-3 mr-4">
      {isReadOnly && (
        <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md animate-pulse">
          CHẾ ĐỘ CHỈ XEM (NĂM HỌC CŨ)
        </span>
      )}
      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
        <Calendar className="w-4 h-4 text-slate-500 mr-2" />
        <select
          className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 cursor-pointer"
          value={selectedNamHocId ?? ''}
          onChange={handleChange}
        >
          {namHocs.map(nh => (
            <option key={nh.namHocId} value={nh.namHocId}>{nh.tenNamHoc}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);
  
  const [pendingTicketsCount, setPendingTicketsCount] = useState(0);
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
      ticketService.getPendingTickets()
        .then(tickets => {
          const pendingCount = tickets.filter((t: any) => t.status === 'CHO_DUYET').length;
          setPendingTicketsCount(pendingCount);
        })
        .catch(err => console.error("Failed to fetch tickets", err));
    };

    fetchTicketsCount();
    window.addEventListener('ticketsUpdated', fetchTicketsCount);
    return () => window.removeEventListener('ticketsUpdated', fetchTicketsCount);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        
        <nav className="flex-1 px-4 flex flex-col gap-1.5 mt-2 overflow-y-auto">
          <NavItem to="/admin" icon={LayoutDashboard} label="Tổng quan" />
          <NavItem to="/admin/users" icon={Users} label="Quản lý Tài khoản" />
          <NavItem to="/admin/classes" icon={GraduationCap} label="Quản lý Lớp học" />
          <NavItem to="/admin/curriculum" icon={FileText} label="Chương trình học" />
          
          <div className="mt-4 mb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Hệ thống
          </div>
          <NavItem to="/admin/tickets" icon={Ticket} label="Phiếu Hỗ trợ" badge={pendingTicketsCount} />
          <NavItem to="/admin/settings" icon={Settings} label="Cấu hình trường" />
        </nav>
        
        {/* Vùng dưới cùng Sidebar */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mt-2">
            <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold shrink-0 shadow-sm overflow-hidden border border-slate-200">
               {user?.avatarUrl ? (
                 <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <span className="uppercase">{user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'A'}</span>
               )}
            </div>
            <div className="text-sm overflow-hidden flex-1">
              <p className="font-semibold text-slate-900 truncate" title={user?.fullName || user?.username}>{user?.fullName || user?.username}</p>
              <p className="text-slate-500 text-xs truncate">Quản trị viên</p>
            </div>
          </div>
          
          <button onClick={handleLogout} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm cursor-pointer group mt-1">
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
          <div className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Hệ thống hoạt động bình thường
          </div>
          
          <div className="flex items-center relative">
            <AcademicYearSelector />

            <button 
              type="button" 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* Dropdown Thông báo */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-bold text-slate-900">Thông báo hệ thống</h3>
                </div>
                <div className="p-8 text-center text-slate-500 text-sm">
                  Chưa có thông báo nào.
                </div>
              </div>
            )}
          </div>
        </header>

        {/* KHU VỰC CUỘN NỘI DUNG VÀ FOOTER */}
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="p-8 flex-1 max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>

          {/* FOOTER */}
          <footer className="mt-auto px-8 py-6 border-t border-slate-200 bg-white/50 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} <span className="font-semibold text-slate-700">Titkul LMS Admin</span>
            </div>
          </footer>
        </div>

      </main>
    </div>
  );
}
