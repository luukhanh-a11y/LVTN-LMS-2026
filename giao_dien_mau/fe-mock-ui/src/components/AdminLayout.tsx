import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Ticket, Settings, LogOut, ShieldCheck, Bell, Maximize2, AlertCircle, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { adminStats } from '../mockAdminData';
import { notificationsData } from '../mockData'; // Giả lập notif chung

function NavItem({ to, icon: Icon, label }: { to: string, icon: React.ElementType, label: string }) {
  const location = useLocation();
  // Match exactly or with prefix
  const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm",
        isActive ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className={cn("w-5 h-5", isActive ? "text-blue-700" : "text-slate-400")} />
      {label}
    </Link>
  );
}

export default function AdminLayout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notificationsData.filter(n => !n.isRead).length;

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
        
        <nav className="flex-1 px-4 flex flex-col gap-1.5 mt-2">
          <NavItem to="/admin" icon={LayoutDashboard} label="Tổng quan" />
          <NavItem to="/admin/users" icon={Users} label="Quản lý Tài khoản" />
          <NavItem to="/admin/classes" icon={GraduationCap} label="Quản lý Lớp học" />
          
          <div className="mt-4 mb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Hệ thống
          </div>
          <NavItem to="/admin/support" icon={Ticket} label="Phiếu Hỗ trợ" />
          <NavItem to="/admin/settings" icon={Settings} label="Cấu hình trường" />
        </nav>
        
        {/* Vùng dưới cùng Sidebar */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <Link to="/" className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm cursor-pointer group">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
              Đăng xuất
            </div>
          </Link>
          
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mt-2">
            <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">AD</div>
            <div className="text-sm overflow-hidden">
              <p className="font-bold text-slate-900 truncate">Super Admin</p>
              <p className="text-slate-500 text-xs truncate">Quản trị viên</p>
            </div>
          </div>
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
          
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>

            {/* Dropdown Thông báo */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-bold text-slate-900">Thông báo hệ thống</h3>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notificationsData.map(notif => (
                    <div key={notif.id} className={cn("p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer flex gap-3", !notif.isRead ? "bg-blue-50/30" : "")}>
                      <div className="mt-1 shrink-0">
                         <AlertCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className={cn("text-sm", !notif.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700")}>{notif.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                        <p className="text-xs text-slate-400 mt-2">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* KHU VỰC CUỘN NỘI DUNG VÀ FOOTER */}
        <div className="flex-1 overflow-auto flex flex-col">
          {/* Main Router Content */}
          <div className="p-8 flex-1">
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
